<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-2">
        Accept Invitation
      </h1>
      <p class="text-center text-gray-500 mb-6">
        Complete your account setup to join Eduhub.
      </p>

      <div
        v-if="loadingInvite"
        class="rounded-md border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700"
      >
        Validating your invitation...
      </div>

      <div
        v-else-if="inviteError"
        class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ inviteError }}
      </div>

      <template v-else>
        <div class="rounded-md border border-indigo-100 bg-indigo-50 p-4 mb-6">
          <p class="text-sm text-gray-700">
            <span class="font-semibold">Invited email:</span> {{ invitation.email }}
          </p>
          <p class="text-sm text-gray-700 mt-1">
            <span class="font-semibold">Role:</span> {{ invitation.role }}
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="submitAcceptance">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                v-model="form.name"
                type="text"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Surname</label>
              <input
                v-model="form.surname"
                type="text"
                class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              v-model="form.username"
              type="text"
              class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              v-model="form.password"
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
            {{ isSubmitting ? "Setting up account..." : "Accept Invitation" }}
          </button>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { apolloClient } from "../../../apollo-client";
import {
  acceptInvitationMutation,
} from "../../graphql/mutations";
import { validateInvitationTokenQuery } from "../../graphql/queries";
import { updateToken } from "../../socket/socket";
import { useNotificationStore } from "../../store/notification";
import { useUserStore } from "../../store/userStore";
import { formatAuthErrorMessage } from "../../utils/graphqlError";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

const token = computed(() => String(route.query.token || ""));
const loadingInvite = ref(true);
const isSubmitting = ref(false);
const inviteError = ref("");
const submitError = ref("");
const showPassword = ref(false);
const invitation = ref({
  email: "",
  role: "",
  status: "",
  expiresAt: "",
});

const form = reactive({
  name: "",
  surname: "",
  username: "",
  password: "",
});

const isFormValid = computed(() => {
  return (
    token.value.trim().length > 0 &&
    form.name.trim().length > 0 &&
    form.surname.trim().length > 0 &&
    form.username.trim().length > 0 &&
    form.password.length >= 8
  );
});

const loadInvitation = async () => {
  if (!token.value.trim()) {
    inviteError.value = "Invitation token is missing.";
    loadingInvite.value = false;
    return;
  }

  try {
    const { data } = await apolloClient.query({
      query: validateInvitationTokenQuery,
      variables: { token: token.value },
      fetchPolicy: "network-only",
    });

    invitation.value = data.validateInvitationToken;
  } catch (error) {
    inviteError.value = formatAuthErrorMessage(
      error,
      "This invitation is invalid or has expired."
    );
  } finally {
    loadingInvite.value = false;
  }
};

const submitAcceptance = async () => {
  if (!isFormValid.value) return;

  isSubmitting.value = true;
  submitError.value = "";

  try {
    const { data } = await apolloClient.mutate({
      mutation: acceptInvitationMutation,
      variables: {
        input: {
          token: token.value,
          username: form.username.trim(),
          name: form.name.trim(),
          surname: form.surname.trim(),
          password: form.password,
        },
      },
    });

    const userData = data?.acceptInvitation;
    if (!userData) {
      throw new Error("Invitation acceptance did not return user data.");
    }

    userStore.setUser(userData);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("refreshToken", userData.refreshToken);
    updateToken(userData.token, userData.refreshToken);

    notificationStore.addNotification({
      type: "success",
      message: "Invitation accepted successfully!",
    });

    const role = userData.role.toLowerCase();
    const dashboardPath =
      role === "super_admin" ? "/dashboard/admin" : `/dashboard/${role}`;
    await router.push(dashboardPath);
  } catch (error) {
    submitError.value = formatAuthErrorMessage(
      error,
      "Unable to accept this invitation."
    );
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(loadInvitation);
</script>
