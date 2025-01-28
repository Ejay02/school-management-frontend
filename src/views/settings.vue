<!-- <div class="rounded border border-gray-300 p-2 w-full"> -->
<!-- SettingsLayout.vue -->
<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="w-full">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
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
          class="flex justify-between text-gray-600 p-2 m-2 border-b border-gray-100"
        >
          <router-link
            to="/settings/profile"
            class="hover:text-blue-600"
            :class="{ 'text-blue-600': $route.name === 'profile' }"
          >
            Account
          </router-link>
          <router-link
            to="/settings/notifications"
            class="hover:text-blue-600"
            :class="{ 'text-blue-600': $route.name === 'notifications' }"
          >
            Notifications
          </router-link>
          <router-link
            to="/settings/billing"
            class="hover:text-blue-600"
            :class="{ 'text-blue-600': $route.name === 'billing' }"
          >
            Billing
          </router-link>
          <router-link
            to="/settings/team"
            class="hover:text-blue-600"
            :class="{ 'text-blue-600': $route.name === 'team' }"
          >
            Team
          </router-link>
          <router-link
            to="/settings/integrations"
            class="hover:text-blue-600"
            :class="{ 'text-blue-600': $route.name === 'integrations' }"
          >
            Integrations
          </router-link>
        </div>

        <!-- Router View -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup></script>
