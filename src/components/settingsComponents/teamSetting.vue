<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">User Management</h1>

    <LoadingScreen v-if="loading" message="Loading teams" />

    <ErrorScreen v-else-if="error" />

    <EmptyState
      v-else-if="!users.length && !loading"
      icon="fa-regular fa-users"
      heading="No users found"
      description="There are no users to display."
    />

    <div v-else class="bg-gray-200 rounded-lg shadow">
      <div class="p-6">
        <!-- User List -->
        <div class="space-y-4">
          <div
            v-for="user in users"
            :key="user.id"
            class="bg-white flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <!-- User Info Section -->
            <div class="flex items-center space-x-4">
              <!-- User Avatar -->
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

              <!-- Name and Email -->
              <div>
                <h3 class="font-medium text-gray-600 text-sm">
                  {{ user.name }}
                </h3>
                <p class="text-xs text-gray-500">{{ user.email }}</p>
              </div>
            </div>

            <!-- Actions Section -->
            <div class="flex items-center space-x-4 justify-between">
              <!-- Role Dropdown -->
              <div>
                <select
                  v-if="user.id !== userStore.userInfo.id"
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
                  That's you
                </span>
              </div>
              <!-- Del btn -->
              <button
                v-if="user.id !== userStore.userInfo.id"
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

    <!-- Add pagination component -->
    <div class="mt-6">
      <Pagination
        :currentPage="currentPage"
        :hasMore="userStore.hasMore"
        :totalPages="userStore.totalPages"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { apolloClient } from "../../../apollo-client";
import { assignAdminRole } from "../../graphql/mutations";
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

const users = ref([]);
const limit = 10;
const currentPage = ref(1);
const loading = computed(() => userStore.loading);
const error = computed(() => userStore.error);

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

const showDelModal = (id, title, type) => {
  modalStore.deleteModal = true;
  modalStore.modalId = id;
  modalStore.modalTitle = title;
  modalStore.source = type;
};

const updateUserRole = async (userId, newRole) => {
  try {
    userStore.loading = true;

    const uppercaseRole = newRole.toUpperCase();

    // Call the mutation to update the user's role
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
        message: `Role updated successfully`,
      });

      // Update the user's role in the local state
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
      message: `Failed to update user role: ${error.message}`,
    });
  } finally {
    // Reset loading state
    userStore.loading = false;
  }
};

const fetchUsers = async (page = 1) => {
  try {
    const { admins, teachers } = await userStore.fetchAdminUsers(apolloClient, {
      page,
      limit,
    });

    // Format admin users
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

    // Format teacher users
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

    // Combine both arrays
    let combinedUsers = [...formattedAdmins, ...formattedTeachers];

    // Check if current user is in the list
    const currentUserInList = combinedUsers.some(
      (user) => user.id === userStore.userInfo.id
    );

    // If current user is not in the list, fetch them separately and add to the list
    if (!currentUserInList && userStore.userInfo.id) {
      try {
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
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    }

    users.value = combinedUsers;
  } catch (err) {
    notificationStore.addNotification({
      type: "error",
      message: `Failed to load users. Please try again later.: ${err.message}`,
    });
  }
};

watch(currentPage, (newPage) => {
  fetchUsers(newPage);
});

onMounted(() => {
  fetchUsers(currentPage.value);
});
</script>
