<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="w-full">
      <div
        class="bg-eduYellowLight rounded-lg shadow-sm border border-gray-200"
      >
        <!-- Header -->
        <div class="p-6 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-center text-gray-600">
            Account Settings
          </h1>
          <p class="mt-1 text-sm text-center text-gray-500">
            Manage your account preferences and settings
          </p>
        </div>

        <!-- Navigation -->
        <div class="border-b border-gray-200">
          <!-- Desktop Navigation -->
          <div
            class="hidden sm:flex bg-eduSkyLight justify-between text-gray-600 text-md font-semibold p-2"
          >
            <router-link
              to="/settings/profile"
              class="hover:text-eduPurple pl-4"
              :class="{ 'text-indigo-600': $route.name === 'profile' }"
            >
              Account
            </router-link>
            <router-link
              to="/settings/notifications"
              class="hover:text-eduPurple"
              :class="{ 'text-indigo-600': $route.name === 'notifications' }"
            >
              Notifications
            </router-link>
            <router-link
             v-if="role === 'super_admin' || role === 'parent'"
              to="/settings/billing"
              class="hover:text-eduPurple"
              :class="{ 'text-indigo-600': $route.name === 'billing' }"
            >
              Billing
            </router-link>
            <router-link
              v-if="role === 'super_admin' || role === 'admin' || role === 'teacher' "
              to="/settings/team"
              class="hover:text-eduPurple"
              :class="{ 'text-indigo-600': $route.name === 'team' }"
            >
              Team
            </router-link>
            <router-link
              to="/settings/integrations"
              class="hover:text-eduPurple pr-4"
              :class="{ 'text-indigo-600': $route.name === 'integrations' }"
            >
              Integrations
            </router-link>
          </div>
          
          <!-- Mobile Navigation -->
          <div class="sm:hidden bg-eduSkyLight p-2">
            <select 
              v-model="currentRoute" 
              @change="navigateTo"
              class="w-full p-2 bg-white border border-gray-300 rounded-md text-gray-600 font-semibold focus:outline-none focus:ring-2 focus:ring-eduPurple focus:border-transparent"
            >
              <option value="/settings/profile">Account</option>
              <option value="/settings/notifications">Notifications</option>
              <option value="/settings/billing">Billing</option>
              <option v-if="role === 'super_admin' || role === 'admin'" value="/settings/team">Team</option>
              <option value="/settings/integrations">Integrations</option>
            </select>
          </div>
        </div>

        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "../store/userStore";
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const userStore = useUserStore();
const role = userStore.currentRole.toLowerCase();
const router = useRouter();
const route = useRoute();

// For mobile dropdown navigation
const currentRoute = ref('');

// Set initial value based on current route
onMounted(() => {
  currentRoute.value = route.path;
});

// Update dropdown when route changes
watch(() => route.path, (newPath) => {
  currentRoute.value = newPath;
});

// Navigate when dropdown changes
const navigateTo = () => {
  router.push(currentRoute.value);
};
</script>
