<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-white/90">
    <div class="text-center">
      <!-- <div class="animate-spin mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mx-auto text-indigo-500"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div> -->
      <div
        class="animate-spin rounded-full  h-16 w-16 border-t-4 border-indigo-500 text-center mb-4 mx-auto"
      ></div>
      <div class="text-lg font-mono text-gray-600">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: "Loading...",
  },
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
