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
        <div
          class="flex bg-eduSkyLight justify-between text-gray-600 text-md font-semibold p-2 border-b border-gray-200"
        >
          <router-link
            to="/settings/profile"
            class="hover:text-eduPurple pl-4"
            :class="{ 'text-eduPurple': $route.name === 'profile' }"
          >
            Account
          </router-link>
          <router-link
            to="/settings/notifications"
            class="hover:text-eduPurple"
            :class="{ 'text-eduPurple': $route.name === 'notifications' }"
          >
            Notifications
          </router-link>
          <router-link
            to="/settings/billing"
            class="hover:text-eduPurple"
            :class="{ 'text-eduPurple': $route.name === 'billing' }"
          >
            Billing
          </router-link>
          <!-- v-if="role === 'superadmin'" -->
          <router-link
            to="/settings/team"
            class="hover:text-eduPurple"
            :class="{ 'text-eduPurple': $route.name === 'team' }"
          >
            Team
          </router-link>
          <router-link
            to="/settings/integrations"
            class="hover:text-eduPurple pr-4"
            :class="{ 'text-eduPurple': $route.name === 'integrations' }"
          >
            Integrations
          </router-link>
        </div>

        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "../store/userStore";

const userStore = useUserStore();
const role = userStore.currentRole;
</script>
