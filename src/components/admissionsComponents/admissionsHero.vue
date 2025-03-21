<template>
  <div class="relative bg-eduPurpleLight py-16">
    <div class="absolute inset-0">
      <img
        src="/bg_1.jpg"
        alt="School campus"
        class="w-full h-full object-cover opacity-20"
      />
    </div>
    <div class="relative max-w-7xl mx-auto sm:px-6 lg:px-8 text-center px-16">
      <div class="container mx-auto py-4 flex justify-between items-center">
        <button
          @click="goBack"
          class="group flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-5 w-5 group-hover:translate-x-[-2px] transition-transform"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            />
          </svg>
          <span>Back</span>
        </button>
      </div>
      <h1 class="text-4xl font-bold text-gray-600 mb-4">
        Join Our School Community
      </h1>
      <p class="text-xl text-gray-500 max-w-3xl mx-auto">
        Begin your journey with us. We welcome students who are eager to learn,
        grow, and contribute to our vibrant community.
      </p>
    </div>
  </div>
</template>

<script setup>
import { useNavigation } from "../../composables/useNavigation";

const { goBack } = useNavigation();
</script>

<style scoped></style>
