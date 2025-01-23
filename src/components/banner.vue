<template>
  <div
    v-if="isVisible"
    class="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1"
  >
    <div class="marquee-container w-full overflow-hidden">
      <div
        class="marquee-content inline-block whitespace-nowrap animate-marquee"
      >
        <p class="text-sm/6 text-gray-500 inline-block">
          We collect and use your
          <strong class="font-semibold text-gray-600">IP address</strong>
          to determine your approximate location. This information helps us
          provide location-specific services, such as region-based features or
          localized content. Your data is handled securely and is not shared
          with third parties without your consent.
        </p>
      </div>
    </div>

    <div class="flex flex-1 justify-end">
      <button
        type="button"
        class="-m-3 p-3 focus-visible:outline-offset-[-4px]"
        @click="dismissBanner"
      >
        <span class="sr-only">Dismiss</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-4 w-4 text-gray-500"
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
import { ref, onMounted } from "vue";

const isVisible = ref(true);

onMounted(() => {
  const dismissed = localStorage.getItem("bannerDismissed");
  if (dismissed) {
    isVisible.value = false;
  }
});

const dismissBanner = () => {
  isVisible.value = false;
  localStorage.setItem("bannerDismissed", "true");
};
</script>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.marquee-content {
  animation: marquee 40s linear infinite;
}
</style>
