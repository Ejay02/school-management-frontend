<template>
  <header class="relative bg-gray-200 shadow-md">
    <div class="container mx-auto py-6 flex justify-between items-center">
      <div class="group" @click="goBack">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="text-gray-600 h-6 w-6 cursor-pointer group-hover:animate-bounce"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
          />
        </svg>
      </div>
      <!-- <nav class="space-x-4">
          <router-link
            to="/admissions"
            class="text-gray-600 hover:text-eduSky transition"
          >
            Admissions
          </router-link>
          <router-link
            to="/academics"
            class="text-gray-600 hover:text-eduSky transition"
          >
            Academics
          </router-link>
        </nav> -->
    </div>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useNavigation } from "../../composables/useNavigation";

const router = useRouter();

const { goBack } = useNavigation();
</script>

<style scoped></style>
