<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10"
  >
    <div
      class="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-8"
    >
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-2">
        Set Student Password
      </h1>
      <p class="text-center text-gray-500 mb-6">
        Choose a password to activate this student account.
      </p>

      <div
        v-if="loadingToken"
        class="rounded-md border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700"
      >
        Validating setup link...
      </div>

      <div
        v-else-if="tokenError"
        class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ tokenError }}
      </div>

      <template v-else>
        <div class="rounded-md border border-indigo-100 bg-indigo-50 p-4 mb-6">
          <p class="text-sm text-gray-700">
            <span class="font-semibold">Student:</span>
            {{ preview.name }} {{ preview.surname }}
          </p>
          <p class="text-sm text-gray-700 mt-1">
            <span class="font-semibold">Username:</span> {{ preview.username }}
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="submitPassword">
          <div>
            <label
              for="new-password"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              New password
            </label>
            <input
              id="new-password"
              v-model="form.newPassword"
              :type="showPassword ? 'text' : 'password'"
              class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              for="confirm-password"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              class="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? "Hide password" : "Show password" }}
            </button>
          </div>

          <div
            v-if="submitError"
            class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {{ submitError }}
          </div>

          <button
            type="submit"
            :disabled="!isFormValid || isSubmitting"
            class="w-full rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-2.5 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting">Saving...</span>
            <span v-else>Set password</span>
          </button>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apolloClient } from "../../../apollo-client";
import { completePasswordSetupMutation } from "../../graphql/mutations";
import { validatePasswordSetupTokenQuery } from "../../graphql/queries";
import { useNotificationStore } from "../../store/notification";
import { formatAuthErrorMessage } from "../../utils/graphqlError";

const router = useRouter();
const route = useRoute();
const notificationStore = useNotificationStore();

const token = computed(() => String(route.query.token || ""));
const loadingToken = ref(true);
const tokenError = ref("");
const submitError = ref("");
const isSubmitting = ref(false);
const showPassword = ref(false);

const preview = ref({
  username: "",
  name: "",
  surname: "",
  role: "",
  expiresAt: "",
});

const form = reactive({
  newPassword: "",
  confirmPassword: "",
});

const isFormValid = computed(() => {
  return (
    token.value.trim().length > 0 &&
    form.newPassword.length >= 8 &&
    form.newPassword === form.confirmPassword
  );
});

const loadPreview = async () => {
  if (!token.value.trim()) {
    tokenError.value = "Setup token is missing.";
    loadingToken.value = false;
    return;
  }

  try {
    const { data } = await apolloClient.query({
      query: validatePasswordSetupTokenQuery,
      variables: { token: token.value },
      fetchPolicy: "network-only",
    });

    preview.value = data.validatePasswordSetupToken;
  } catch (error) {
    tokenError.value = formatAuthErrorMessage(
      error,
      "This setup link is invalid or has expired.",
    );
  } finally {
    loadingToken.value = false;
  }
};

const submitPassword = async () => {
  if (!isFormValid.value) return;

  isSubmitting.value = true;
  submitError.value = "";

  try {
    await apolloClient.mutate({
      mutation: completePasswordSetupMutation,
      variables: {
        input: {
          token: token.value,
          newPassword: form.newPassword,
        },
      },
    });

    notificationStore.addNotification({
      type: "success",
      message: "Student password set successfully. You can now log in.",
    });

    await router.push("/login");
  } catch (error) {
    submitError.value = formatAuthErrorMessage(
      error,
      "Unable to set password for this student account.",
    );
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(loadPreview);
</script>

