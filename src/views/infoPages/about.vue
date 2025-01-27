<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-100">
    <!-- Header Section -->
    <header class="relative bg-gray-200 shadow-md">
      <div class="container mx-auto py-6 flex justify-between items-center">
        <router-link to="/" class="group">
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
        </router-link>
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

    <!-- Hero Section -->
    <AboutHero />

    <!-- Leadership Section -->
    <AboutLeadership />

    <!-- Video Section -->
    <AboutVideo />
  </div>
</template>

<script setup>
import AboutHero from "../../components/aboutComponents/aboutHero.vue";
import AboutLeadership from "../../components/aboutComponents/aboutLeadership.vue";
import AboutVideo from "../../components/aboutComponents/aboutVideo.vue";
</script>
