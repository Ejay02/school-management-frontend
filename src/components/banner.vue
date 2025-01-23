<template>
  <div
    v-if="isVisible"
    class="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1"
  >
    <div class="marquee">
      <p class="text-sm/6 text-gray-500 inline-block">
        We collect and use your
        <strong class="font-semibold text-gray-600"> IP address </strong> to
        determine your approximate location. This information helps us provide
        location-specific services, such as region-based features or localized
        content. Your data is handled securely and is not shared with third
        parties without your consent.
      </p>
    </div>

    <div class="flex flex-1 justify-end">
      <button
        type="button"
        class="-m-3 p-3 focus-visible:outline-offset-[-4px]"
        @click="isVisible = false"
      >
        <span class="sr-only">Dismiss</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-6 w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// State to manage banner visibility
const isVisible = ref(true);
</script>

<style scoped>
/* Animation for the marquee effect */
@keyframes scroll {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.marquee {
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
}

.marquee p {
  display: inline-block;
  animation: scroll 40s linear infinite;
}
</style>
