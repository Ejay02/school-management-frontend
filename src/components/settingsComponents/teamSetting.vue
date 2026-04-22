<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Team Management</h1>
      <div class="inline-flex rounded-lg border border-gray-200 bg-white p-1">
        <button
          class="px-4 py-2 text-sm font-medium rounded-md transition"
          :class="
            activeTab === 'users'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:text-indigo-600'
          "
          @click="activeTab = 'users'"
        >
          Users
        </button>
        <button
          class="px-4 py-2 text-sm font-medium rounded-md transition"
          :class="
            activeTab === 'invitations'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:text-indigo-600'
          "
          @click="activeTab = 'invitations'"
        >
          Invitations
        </button>
      </div>
    </div>

    <template v-if="activeTab === 'users'">
      <LoadingScreen v-if="loading" message="Loading team..." />

      <ErrorScreen v-else-if="error" />

      <EmptyState
        v-else-if="!users.length && !loading"
        icon="fa-solid fa-users"
        heading="No users found"
        description="There are no users to display."
      />

      <template v-else>
        <div class="bg-gray-200 rounded-lg shadow">
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="user in users"
                :key="user.id"
                class="bg-white flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <img
                      v-if="user.avatar"
                      :src="user.avatar"
                      :alt="user.name"
                      class="w-12 h-12 rounded-full object-cover border border-gray-100"
                    />
                    <div
                      v-else
                      class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm border-2 border-indigo-200 capitalize"
                    >
                      {{ user.firstName?.[0] || "" }}{{ user.lastName?.[0] || "" }}
                    </div>
                  </div>

                  <div>
                    <h3 class="font-medium text-gray-600 text-sm">
                      {{ user.name }}
                    </h3>
                    <p class="text-xs text-gray-500">{{ user.email }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-4 justify-between">
                  <div>
                    <div v-if="user.id !== userStore.userInfo.id">
                      <select
                        v-if="role === 'super_admin'"
                        v-model="user.role"
                        @change="updateUserRole(user.id, user.role)"
                        class="cursor-pointer block w-32 rounded-md bg-white px-2 py-1 text-base text-gray-500 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple"
                      >
                        <option value="teacher" selected>Teacher</option>
                        <option value="admin" class="text-gray-500">Admin</option>
                      </select>
                      <span
                        v-else
                        class="block w-32 rounded-md bg-gray-100 px-2 py-1 text-sm text-purple-600 italic border border-gray-300 cursor-not-allowed"
                      >
                        {{ user.role }}
                      </span>
                    </div>
                    <span
                      v-else
                      class="block w-32 rounded-md bg-gray-100 px-2 py-1 text-sm text-purple-600 italic border border-gray-300 cursor-not-allowed"
                    >
                      That's you
                    </span>
                  </div>

                  <button
                    v-if="role === 'super_admin'"
                    @click="showDelModal(user.id, user.name, 'userList')"
                    class="group relative w-6 h-6 flex items-center justify-center rounded-full text-red-400 hover:text-red-600"
                  >
                    <i class="fa-regular fa-trash-can"></i>
                    <span
                      class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    >
                      Delete User
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <Pagination
            :currentPage="currentPage"
            :hasMore="userStore.hasMore"
            :totalPages="userStore.totalPages"
            @update:page="handlePageChange"
          />
        </div>
      </template>
    </template>

    <template v-else>
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">Invitations</h2>
          <p class="text-sm text-gray-500">
            Track invite status and resend or revoke pending invites.
          </p>
        </div>

        <select
          v-model="invitationStatusFilter"
          class="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REVOKED">Revoked</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>

      <LoadingScreen v-if="invitationLoading" message="Loading invitations..." />

      <div
        v-else-if="invitationError"
        class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ invitationError }}
      </div>

      <EmptyState
        v-else-if="!invitations.length"
        icon="fa-regular fa-envelope"
        heading="No invitations found"
        description="Send a teacher or parent invite to see it here."
      />

      <div v-else class="bg-gray-200 rounded-lg shadow">
        <div class="p-6 space-y-4">
          <div
            v-for="invite in invitations"
            :key="invite.id"
            class="bg-white border rounded-lg p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div class="flex items-center gap-3">
                <h3 class="text-sm font-semibold text-gray-800">
                  {{ invite.email }}
                </h3>
                <span
                  class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="statusBadgeClass(invite.status)"
                >
                  {{ invite.status }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mt-1">
                Role: {{ invite.role }} · Sent {{ invite.sentCount }} time<span v-if="invite.sentCount !== 1">s</span>
              </p>
              <p class="text-xs text-gray-500 mt-1">
                Last sent: {{ formatDate(invite.lastSentAt) }} · Expires:
                {{ formatDate(invite.expiresAt) }}
              </p>
              <p
                v-if="invite.acceptedAt"
                class="text-xs text-green-600 mt-1"
              >
                Accepted: {{ formatDate(invite.acceptedAt) }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button
                v-if="invite.status === 'PENDING'"
                class="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                :disabled="actionLoadingId === invite.id"
                @click="resendInvite(invite.id)"
              >
                Resend
              </button>
              <button
                v-if="invite.status === 'PENDING'"
                class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                :disabled="actionLoadingId === invite.id"
                @click="revokeInvite(invite.id)"
              >
                Revoke
              </button>
              <span
                v-if="actionLoadingId === invite.id"
                class="text-xs text-gray-500"
              >
                Processing...
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { apolloClient } from "../../../apollo-client";
import {
  assignAdminRole,
  resendInvitationMutation,
  revokeInvitationMutation,
} from "../../graphql/mutations";
import { invitationsQuery } from "../../graphql/queries";
import { extractGraphQLErrorMessage } from "../../utils/graphqlError";
import { useNotificationStore } from "../../store/notification";
import { useModalStore } from "../../store/useModalStore";
import { useUserStore } from "../../store/userStore";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";
import Pagination from "../pagination.vue";

const userStore = useUserStore();
const modalStore = useModalStore();
const notificationStore = useNotificationStore();

const role = userStore.currentRole.toLowerCase();
const activeTab = ref("users");

const users = ref([]);
const limit = 10;
const currentPage = ref(1);
const loading = computed(() => userStore.loading);
const error = computed(() => userStore.error);

const invitations = ref([]);
const invitationLoading = ref(false);
const invitationError = ref("");
const invitationStatusFilter = ref("");
const actionLoadingId = ref("");

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

const showDelModal = (id, title, type) => {
  modalStore.deleteModal = true;
  modalStore.modalId = id;
  modalStore.modalTitle = title;
  modalStore.source = type;
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

const statusBadgeClass = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-700";
    case "ACCEPTED":
      return "bg-green-100 text-green-700";
    case "REVOKED":
      return "bg-red-100 text-red-700";
    case "EXPIRED":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-indigo-100 text-indigo-700";
  }
};

const updateUserRole = async (userId, newRole) => {
  try {
    userStore.loading = true;

    const uppercaseRole = newRole.toUpperCase();

    const { data } = await apolloClient.mutate({
      mutation: assignAdminRole,
      variables: {
        role: uppercaseRole,
        targetId: userId,
      },
    });

    if (data && data.assignAdminRole) {
      notificationStore.addNotification({
        type: "success",
        message: "Role updated successfully",
      });

      const updatedUser = users.value.find((user) => user.id === userId);
      if (updatedUser) {
        updatedUser.role = newRole;
      }

      await userStore.refreshUsers(apolloClient, {
        page: currentPage.value,
        limit,
      });
    }
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Failed to update user role: ${extractGraphQLErrorMessage(
        error,
        "Unable to update user role"
      )}`,
    });
  } finally {
    userStore.loading = false;
  }
};

const fetchUsers = async (page = 1) => {
  try {
    const { admins, teachers } = await userStore.fetchAdminUsers(apolloClient, {
      page,
      limit,
    });

    const formattedAdmins = admins.map((admin) => {
      const name = admin.name || admin.username?.split(" ")[0] || "";
      const surname = admin.surname || admin.username?.split(" ")[1] || "";
      return {
        id: admin.id,
        name: admin.username || `${name} ${surname}`.trim(),
        email: admin.email,
        role: "admin",
        avatar: admin.image || null,
        firstName: name,
        lastName: surname,
      };
    });

    const formattedTeachers = teachers.map((teacher) => {
      const name = teacher.name || teacher.username?.split(" ")[0] || "";
      const surname = teacher.surname || teacher.username?.split(" ")[1] || "";
      return {
        id: teacher.id,
        name: `${name} ${surname}`.trim() || teacher.username,
        email: teacher.email,
        role: "teacher",
        avatar: teacher.image || null,
        firstName: name,
        lastName: surname,
      };
    });

    let combinedUsers = [...formattedAdmins, ...formattedTeachers];

    const currentUserInList = combinedUsers.some(
      (user) => user.id === userStore.userInfo.id
    );

    if (!currentUserInList && userStore.userInfo.id) {
      const currentUser = await userStore.findUserById(
        userStore.userInfo.id,
        apolloClient
      );
      if (currentUser) {
        const name =
          currentUser.name || currentUser.username?.split(" ")[0] || "";
        const surname =
          currentUser.surname || currentUser.username?.split(" ")[1] || "";

        combinedUsers.push({
          id: currentUser.id,
          name: currentUser.username || `${name} ${surname}`.trim(),
          email: currentUser.email,
          role: currentUser.role?.toLowerCase() || userStore.currentRole,
          avatar: currentUser.image || null,
          firstName: name,
          lastName: surname,
        });
      }
    }

    users.value = combinedUsers;
  } catch (err) {
    notificationStore.addNotification({
      type: "error",
      message: `Failed to load users. Please try again later: ${extractGraphQLErrorMessage(
        err,
        "Unable to load users"
      )}`,
    });
  }
};

const fetchInvitations = async () => {
  invitationLoading.value = true;
  invitationError.value = "";

  try {
    const variables = invitationStatusFilter.value
      ? { status: invitationStatusFilter.value }
      : {};
    const { data } = await apolloClient.query({
      query: invitationsQuery,
      variables,
      fetchPolicy: "network-only",
    });

    invitations.value = data?.invitations || [];
  } catch (error) {
    invitationError.value = extractGraphQLErrorMessage(
      error,
      "Unable to load invitations"
    );
  } finally {
    invitationLoading.value = false;
  }
};

const resendInvite = async (id) => {
  actionLoadingId.value = id;
  try {
    await apolloClient.mutate({
      mutation: resendInvitationMutation,
      variables: { id },
    });

    notificationStore.addNotification({
      type: "success",
      message: "Invitation resent successfully",
    });

    await fetchInvitations();
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: extractGraphQLErrorMessage(error, "Unable to resend invitation"),
    });
  } finally {
    actionLoadingId.value = "";
  }
};

const revokeInvite = async (id) => {
  actionLoadingId.value = id;
  try {
    await apolloClient.mutate({
      mutation: revokeInvitationMutation,
      variables: { id },
    });

    notificationStore.addNotification({
      type: "success",
      message: "Invitation revoked successfully",
    });

    await fetchInvitations();
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: extractGraphQLErrorMessage(error, "Unable to revoke invitation"),
    });
  } finally {
    actionLoadingId.value = "";
  }
};

watch(currentPage, (newPage) => {
  fetchUsers(newPage);
});

watch(invitationStatusFilter, () => {
  fetchInvitations();
});

onMounted(() => {
  fetchUsers(currentPage.value);
  fetchInvitations();
});
</script>
