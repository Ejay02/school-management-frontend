<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10"
  >
    <div
      class="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-8"
    >
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-2">
        Change Password
      </h1>
      <p class="text-center text-gray-500 mb-6">
        For security, you must change your password before continuing.
      </p>

      <form class="space-y-4" @submit.prevent="submitChange">
        <div>
          <label
            for="old-password"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Current password
          </label>
          <input
            id="old-password"
            v-model="form.oldPassword"
            :type="showPassword ? 'text' : 'password'"
            class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

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
            Confirm new password
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
            {{ showPassword ? "Hide passwords" : "Show passwords" }}
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
          <span v-else>Update password</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { apolloClient } from "../../../apollo-client";
import { changePasswordMutation } from "../../graphql/mutations";
import { useNotificationStore } from "../../store/notification";
import { useUserStore } from "../../store/userStore";
import { formatAuthErrorMessage } from "../../utils/graphqlError";

const router = useRouter();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

const isSubmitting = ref(false);
const submitError = ref("");
const showPassword = ref(false);

const form = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const isFormValid = computed(() => {
  return (
    form.oldPassword.length > 0 &&
    form.newPassword.length >= 8 &&
    form.newPassword === form.confirmPassword
  );
});

const submitChange = async () => {
  if (!isFormValid.value) return;

  isSubmitting.value = true;
  submitError.value = "";

  try {
    await apolloClient.mutate({
      mutation: changePasswordMutation,
      variables: {
        input: {
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        },
      },
    });

    userStore.setPasswordChangeRequired(false);
    notificationStore.addNotification({
      type: "success",
      message: "Password updated successfully.",
    });

    await router.push("/dashboard/student");
  } catch (error) {
    submitError.value = formatAuthErrorMessage(
      error,
      "Unable to update password.",
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>

