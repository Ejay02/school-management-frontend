<!-- <i class="fa-regular fa-calendar-check text-gray-400 text-4xl mb-3"></i> -->

<template>
  <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 w-full">
    <div class="text-center">
      <i :class="[icon, 'text-gray-400 text-4xl mb-3']"></i>
      <h4 class="text-lg font-semibold text-gray-600 mb-2">{{ heading }}</h4>
      <p class="text-sm text-gray-500">{{ description }}</p>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
</script>

<style scoped></style>
