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
    <section
      class="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center"
    >
      <div>
        <h2 class="text-4xl font-extrabold text-gray-600 mb-6">
          Transforming Education, Inspiring Futures
        </h2>
        <p class="text-xl text-gray-500 mb-8">
          We're not just teaching. We're empowering the next generation of
          innovators, thinkers, and leaders.
        </p>
        <div class="flex space-x-4">
          <button
            class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-400 transition"
          >
            Explore Programs
          </button>
          <button
            @click="openModal"
            class="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition"
          >
            Request Info
          </button>

          <!--  -->
        </div>
      </div>

      <div>
        <img
          src="/anatoliy-gromov-KP4ezcBNX44-unsplash.jpg"
          alt="Campus View"
          class="rounded-xl shadow-2xl"
        />
      </div>
    </section>

    <!-- request Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click="closeModal"
    >
      <div class="p-8 shadow-lg w-full max-w-2xl mx-4" @click.stop>
        <RequestInfoCard />
      </div>
    </div>

    <!-- Leadership Section -->
    <section class="bg-gray-200 py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-600 mb-4">
            Our Visionary Leadership
          </h2>
          <p class="text-gray-500 max-w-2xl mx-auto">
            Meet the innovative minds driving educational excellence and student
            success.
          </p>
        </div>
        <div class="grid md:grid-cols-4 gap-8">
          <div
            v-for="leader in leadership"
            :key="leader.name"
            class="bg-eduYellowLight cursor-pointer p-6 rounded-xl text-center hover:shadow-lg transition"
          >
            <img
              :src="leader.imageUrl"
              :alt="leader.name"
              class="w-32 h-32 mx-auto rounded-full object-cover mb-4 shadow-md"
            />
            <h3 class="text-xl font-semibold text-gray-600">
              {{ leader.name }}
            </h3>
            <p class="text-indigo-600 mb-2">{{ leader.role }}</p>
            <p class="text-gray-500 text-sm">{{ leader.bio }}</p>
          </div>
        </div>
      </div>
    </section>

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
import RequestInfoCard from "../../components/cards/requestInfoCard.vue";

const videoModalVisible = ref(false);

const openVideoModal = () => {
  videoModalVisible.value = true;
};

const closeVideoModal = () => {
  videoModalVisible.value = false;
};

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const leadership = [
  {
    name: "Dr. Elena Rodriguez",
    role: "Founder & CEO",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Pioneering educational innovation with 20 years of experience in transformative learning strategies.",
  },
  {
    name: "Michael Chen",
    role: "Chief Academic Officer",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Dedicated to curriculum development and ensuring cutting-edge educational experiences.",
  },
  {
    name: "Sarah Thompson",
    role: "Student Success Director",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Passionate about student mentorship and creating supportive learning environments.",
  },
  {
    name: "David Kim",
    role: "Technology & Innovation Lead",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Driving digital transformation and integrating emerging technologies in education.",
  },
];
</script>
