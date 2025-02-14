<template>
  <div
    :class="[
      'flex items-center justify-between p-4 rounded-lg shadow-lg mb-3 transition-all duration-300 transform',
      notificationTypeClasses[notification.type] ||
        notificationTypeClasses.info,
    ]"
    @mouseenter="pauseTimeout"
    @mouseleave="resumeTimeout"
  >
    <div class="flex items-center space-x-3">
      <div class="flex-shrink-0">
        <i
          :class="[
            'text-lg',
            icons[notification.type] || icons.info,
            iconColors[notification.type] || iconColors.info,
          ]"
        ></i>
      </div>
      <p class="text-sm font-medium">{{ notification.message }}</p>
    </div>
    <button
      @click="onClose"
      class="ml-4 flex-shrink-0 hover:opacity-75 focus:outline-none"
    >
      <i class="fas fa-times text-gray-400 hover:text-gray-600"></i>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const notificationTypeClasses = {
  success: "bg-green-50 border-l-4 border-green-400",
  error: "bg-red-50 border-l-4 border-red-400",
  warning: "bg-yellow-50 border-l-4 border-yellow-400",
  info: "bg-blue-50 border-l-4 border-blue-400",
};

const icons = {
  success: "fas fa-check-circle",
  error: "fas fa-times-circle",
  warning: "fas fa-exclamation-circle",
  info: "fas fa-info-circle",
};

const iconColors = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
};

const onClose = () => {
  emit("close", props.notification.id);
};
</script>
