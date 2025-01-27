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
    <section class="container mx-auto px-4 py-16">
      <div class="bg-eduPurple rounded-xl overflow-hidden grid md:grid-cols-2">
        <div class="p-12 flex flex-col justify-center">
          <h2 class="text-3xl font-bold text-gray-600 mb-4">
            Discover Our Campus
          </h2>
          <p class="text-gray-500 mb-6">
            Take a virtual tour and experience the vibrant learning environment
            that sets us apart.
          </p>
          <button
            @click="openVideoModal"
            class="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-400 transition hover:animate-bounce-once"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
            <span>Watch Campus Video</span>
          </button>
        </div>
        <div>
          <img
            src="/zetong-li-y8diuDh3M0s-unsplash.jpg"
            alt="Campus Video Preview"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>

    <VideoModal :show="videoModalVisible" @close="closeVideoModal" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import VideoModal from "../../components/aboutComponents/videoModal.vue";

import AboutHero from "../../components/aboutComponents/aboutHero.vue";
import AboutLeadership from "../../components/aboutComponents/aboutLeadership.vue";

const videoModalVisible = ref(false);

const openVideoModal = () => {
  videoModalVisible.value = true;
};

const closeVideoModal = () => {
  videoModalVisible.value = false;
};
</script>
