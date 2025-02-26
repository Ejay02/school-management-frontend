<script setup>
import { computed } from "vue";

const props = defineProps({
  message: {
    type: String,
    default: "Oops! Something went wrong",
  },
  statusCode: {
    type: Number,
    default: 500,
  },
  description: {
    type: String,
    default: "We encountered an unexpected error. Please try again later.",
  },
  buttonText: {
    type: String,
    default: "Reload",
  },
});

const handleReload = () => {
  location.reload();
};
//  class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"

// Compute background pattern color based on status code
const patternColor = computed(() => {
  switch (props.statusCode) {
    case 404:
      return "bg-indigo-200";
    case 403:
      return "bg-orange-200";
    default:
      return "bg-red-200";
  }
});
const textColor = computed(() => {
  switch (props.statusCode) {
    case 404:
      return "text-indigo-700";
    case 403:
      return "text-orange-700";
    default:
      return "text-red-700";
  }
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center"
    :class="patternColor"
  >
    <div class="max-w-xl w-full px-4">
      <!-- Error Container -->
      <div class="text-center">
        <!-- Status Code -->
        <p class="text-6xl md:text-9xl font-bold text-gray-900 animate-bounce">
          <span :class="textColor">{{ statusCode }}</span>
        </p>

        <!-- Error Message -->
        <h1
          class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
        >
          {{ message }}
        </h1>

        <!-- Description -->
        <p class="mt-6 text-base leading-7">
          <span :class="textColor">
            {{ description }}
          </span>
        </p>

        <!-- Action Button -->
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <button
            @click="handleReload"
            class="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all duration-300"
          >
            {{ buttonText }}
          </button>
        </div>

        <!-- Decorative Elements -->
        <div class="absolute inset-0 -z-10 overflow-hidden">
          <div
            class="absolute left-[50%] top-0 h-[40rem] w-[80rem] -translate-x-[50%] opacity-30"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100 [mask-image:radial-gradient(closest-side,white,transparent)]"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
