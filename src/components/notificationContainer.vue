<template>
  <div
    class="fixed right-0 top-0 z-50 p-4 space-y-4 max-w-md w-full pointer-events-none"
  >
    <TransitionGroup
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <NotificationItem
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        :notification="notification"
        @close="notificationStore.removeNotification"
        class="pointer-events-auto"
      />
    </TransitionGroup>
  </div>
</template>

<script setup>
import NotificationItem from "./notificationItem.vue";
import { useNotificationStore } from "../store/notification";

const notificationStore = useNotificationStore();
</script>
