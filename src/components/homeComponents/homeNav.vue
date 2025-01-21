<template>
  <nav class="bg-eduYellowLight shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <!-- Logo and main nav -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <router-link to="/">
              <router-link to="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-8 w-auto text-indigo-500"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                  />
                </svg>
              </router-link>
            </router-link>
          </div>
          <div class="hidden md:block ml-10">
            <div class="flex space-x-4">
              <router-link
                to="/"
                class="text-gray-600 hover:text-eduSky px-3 py-2 rounded-md text-sm font-medium"
                >Home</router-link
              >
              <router-link
                to="/about"
                class="text-gray-600 hover:text-eduSky px-3 py-2 rounded-md text-sm font-medium"
                >About</router-link
              >
              <router-link
                to="/academics"
                class="text-gray-600 hover:text-eduSky px-3 py-2 rounded-md text-sm font-medium"
                >Academics</router-link
              >
              <router-link
                to="/admissions"
                class="text-gray-600 hover:text-eduSky px-3 py-2 rounded-md text-sm font-medium"
                >Admissions</router-link
              >
              <router-link
                to="/contact"
                class="text-gray-600 hover:text-eduSky px-3 py-2 rounded-md text-sm font-medium"
                >Contact</router-link
              >
            </div>
          </div>
        </div>

        <!-- Login and Mobile menu -->
        <div class="flex items-center">
          <!-- Login button -->
          <div class="hidden md:flex items-center">
            <router-link
              to="/login"
              class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-500 focus-visible:outline-indigo-600 transition-colors"
            >
              Login
            </router-link>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden ml-4">
            <button
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="text-gray-900 hover:text-blue-600"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  v-if="!isMobileMenuOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            to="/"
            class="block text-gray-600 hover:text-eduSky px-3 py-2 rounded-md text-base font-medium"
            >Home</router-link
          >
          <router-link
            to="/about"
            class="block text-gray-600 hover:text-eduSky px-3 py-2 rounded-md text-base font-medium"
            >About</router-link
          >
          <router-link
            to="/academics"
            class="block text-gray-600 hover:text-eduSky px-3 py-2 rounded-md text-base font-medium"
            >Academics</router-link
          >
          <router-link
            to="/admissions"
            class="block text-gray-600 hover:text-eduSky px-3 py-2 rounded-md text-base font-medium"
            >Admissions</router-link
          >
          <router-link
            to="/contact"
            class="block text-gray-600 hover:text-eduSky px-3 py-2 rounded-md text-base font-medium"
            >Contact</router-link
          >
          <router-link
            to="/login"
            class="block text-gray-600 hover:text-eduSky px-3 py-2 rounded-md text-base font-medium"
            >Login</router-link
          >
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";

const isMobileMenuOpen = ref(false);
</script>

<style scoped></style>
