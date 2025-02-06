<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">User Management</h1>
    
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <!-- User List -->
        <div class="space-y-4">
          <div v-for="user in users" :key="user.id" 
               class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            
            <!-- User Info Section -->
            <div class="flex items-center space-x-4">
              <!-- User Avatar -->
              <div class="relative">
                <img 
                  :src="user.avatar" 
                  :alt="user.name"
                  class="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
              
              <!-- Name and Email -->
              <div>
                <h3 class="font-medium text-gray-900">{{ user.name }}</h3>
                <p class="text-sm text-gray-500">{{ user.email }}</p>
              </div>
            </div>

            <!-- Actions Section -->
            <div class="flex items-center space-x-4">
              <!-- Role Dropdown -->
              <select 
                v-model="user.role"
                class="block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                @change="updateUserRole(user.id, user.role)"
              >
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>

              <!-- Edit Button -->
              <button 
                @click="editUser(user.id)"
                class="text-gray-400 hover:text-gray-600"
              >
                <i class="fas fa-edit text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Sample users data - replace with your actual data source
const users = ref([
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'teacher',
    avatar: 'https://via.placeholder.com/150'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    avatar: 'https://via.placeholder.com/150'
  }
])

// Function to handle role updates
const updateUserRole = (userId, newRole) => {
  // Implement your role update logic here
  console.log(`Updating user ${userId} role to ${newRole}`)
}

// Function to handle edit action
const editUser = (userId) => {
  // Implement your edit logic here
  console.log(`Editing user ${userId}`)
}
</script>

<style scoped>
/* Add any additional custom styles here */
</style>