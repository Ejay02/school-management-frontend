<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">User Management</h1>

    <div class="bg-gray-200 rounded-lg shadow">
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
                  :src="user.avatar"
                  :alt="user.name"
                  class="w-12 h-12 rounded-full object-cover border border-gray-100"
                />
              </div>

              <!-- Name and Email -->
              <div>
                <h3 class="font-medium text-gray-600 text-sm">
                  {{ user.name }}
                </h3>
                <p class="text-xs text-gray-500">{{ user.email }}</p>
              </div>
            </div>

            <!-- role -->

            <!-- Actions Section -->
            <div class="flex items-center space-x-4 justify-between">
              <!-- Role Dropdown -->

              <div>
                <select
                  v-model="user.role"
                  @change="updateUserRole(user.id, user.role)"
                  class="cursor-pointer block w-32 rounded-md bg-white px-2 py-1 text-base text-gray-500 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple"
                >
                  <option value="teacher" selected>Teacher</option>
                  <option value="admin" class="text-gray-500">Admin</option>
                </select>
              </div>

              <!-- Edit Button -->
              <button
                @click="editUser(user.id)"
                class="text-red-400 hover:text-red-600"
              >
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const users = ref([
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "teacher",
    avatar: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    avatar: "https://via.placeholder.com/150",
  },
]);

const updateUserRole = (userId, newRole) => {
  console.log(`Updating user ${userId} role to ${newRole}`);
};

const editUser = (userId) => {
  console.log(`Editing user ${userId}`);
};
</script>

<style scoped></style>
