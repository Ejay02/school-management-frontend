<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
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

    <!-- Hero Section with Sign Up -->
    <header class="relative bg-eduPurpleLight overflow-hidden">
      <div class="absolute inset-0">
        <img
          src="/bg_1.jpg"
          alt="School background"
          class="w-full h-full object-cover opacity-20"
        />
      </div>

      <div class="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left side content -->
          <div>
            <h1 class="text-4xl md:text-5xl font-bold text-gray-600 mb-6">
              Nurturing Minds, Building Futures
            </h1>
            <p class="text-xl text-gray-500 mb-8">
              Join our vibrant learning community where every child's potential
              is unleashed through innovative education and personalized
              attention.
            </p>

            <!-- Sign Up Form -->
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-md">
              <h3 class="text-lg font-semibold text-gray-600 mb-4">
                Request Information
              </h3>
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Parent's Name"
                    class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
                <button
                  type="submit"
                  class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md focus-visible:outline-indigo-600 hover:bg-indigo-500 transition-colors"
                >
                  Get Started
                </button>
              </form>
            </div>
          </div>

          <!-- Right side image -->
          <div class="hidden lg:block">
            <img
              src="/matt-ragland-02z1I7gv4ao-unsplash.jpg"
              alt="Happy students"
              class="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Features Section -->
    <section class="py-20 bg-eduSkyLight">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-600 mb-12">
          Why Choose Our School?
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-eduPurple rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-eduYellow"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-600">
              Excellence in Education
            </h3>
            <p class="text-gray-600">
              Comprehensive curriculum designed to inspire and challenge
              students at every level.
            </p>
          </div>

          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-eduPurple rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-eduYellow"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-600">
              Dedicated Teachers
            </h3>
            <p class="text-gray-600">
              Experienced educators committed to nurturing each student's unique
              potential.
            </p>
          </div>

          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-eduPurple rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-eduYellow"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-600">
              Safe Environment
            </h3>
            <p class="text-gray-600">
              Creating a secure and welcoming space where students thrive.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-20 bg-eduYellowLight">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-600 mb-12">
          What Parents Say
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-eduPurpleLight p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Parent"
                class="w-10 h-10 rounded-full"
              />
              <div class="ml-4">
                <h4 class="font-semibold text-gray-600">Sarah Johnson</h4>
                <p class="text-gray-500 text-sm">Parent of Tom, Grade 5</p>
              </div>
            </div>
            <p class="text-gray-500">
              "The teachers here go above and beyond. My son has grown so much
              academically and personally since joining."
            </p>
          </div>

          <div class="bg-eduPurpleLight p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <img
                src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Parent"
                class="w-10 h-10 rounded-full"
              />
              <div class="ml-4">
                <h4 class="font-semibold text-gray-600">Michael Chen</h4>
                <p class="text-gray-500 text-sm">Parent of Amy, Grade 3</p>
              </div>
            </div>
            <p class="text-gray-500">
              "The individualized attention and caring environment have made
              such a difference in my daughter's education."
            </p>
          </div>

          <div class="bg-eduPurpleLight p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Parent"
                class="w-10 h-10 rounded-full"
              />
              <div class="ml-4">
                <h4 class="font-semibold text-gray-600">Emily Rodriguez</h4>
                <p class="text-gray-500 text-sm">Parent of Sofia, Grade 6</p>
              </div>
            </div>
            <p class="text-gray-500">
              "We couldn't be happier with the quality of education and the
              supportive community at this school."
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-20 bg-eduPurpleLight">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center justify-center"
      >
        <h2 class="text-3xl font-bold text-gray-600 mb-2">
          Ready to Join Our School Family?
        </h2>
        <p class="text-sm text-gray-500 font-medium mb-8">
          Schedule a tour or request more information today.
        </p>

        <button
          class="text-white px-8 py-3 rounded-md font-semibold bg-indigo-600 hover:bg-indigo-500 hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out"
        >
          Schedule a Tour
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-600 text-gray-300 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-white font-semibold mb-4">Contact Us</h3>
            <p class="hover:text-eduSky cursor-pointer">
              <i class="fa-solid fa-map-location-dot"></i> 123 School Street,
            </p>
            <p class="hover:text-eduSky cursor-pointer">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;City, State 12345
            </p>
            <!-- &emsp; -->
            <p class="hover:text-eduSky cursor-pointer">
              <i class="fa-solid fa-phone"></i>&nbsp; (555) 123-4567
            </p>
            <p class="hover:text-eduSky cursor-pointer">
              <i class="fa-regular fa-envelope"></i>&nbsp; info@school.com
            </p>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li>
                <router-link to="/about" class="hover:text-eduSky"
                  >About Us</router-link
                >
              </li>
              <li>
                <router-link to="/academics" class="hover:text-eduSky"
                  >Academics</router-link
                >
              </li>
              <li>
                <router-link to="/admissions" class="hover:text-eduSky"
                  >Admissions</router-link
                >
              </li>
              <li>
                <router-link to="/calender" class="hover:text-eduSky"
                  >Calendar</router-link
                >
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Programs</h3>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-eduSky">Primary School</a></li>
              <li>
                <a href="#" class="hover:text-eduSky">Secondary School</a>
              </li>
              <li><a href="#" class="hover:text-eduSky">After School</a></li>
              <li>
                <a href="#" class="hover:text-eduSky">Summer Programs</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Follow Us</h3>
            <div class="flex space-x-4">
              <a href="#" class="hover:text-eduSky">
                <span class="sr-only">Facebook</span>
                <i class="fa-brands fa-square-facebook"></i>
              </a>
              <a href="#" class="hover:text-eduSky">
                <span class="sr-only">Twitter</span>
                <i class="fa-brands fa-square-x-twitter"></i>
              </a>
              <a href="#" class="hover:text-eduSky">
                <span class="sr-only">Instagram</span>
                <i class="fa-brands fa-instagram"></i>
              </a>
              <a href="#" class="hover:text-eduSky">
                <span class="sr-only">Tiktok</span>
                <i class="fa-brands fa-tiktok"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="mt-8 border-t border-gray-700 pt-8 text-center">
          <p>&copy; 2025 Eduhub Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isMobileMenuOpen = ref(false);

const handleSubmit = () => {
  // Handle form submission logic here
  console.log("Form submitted");
};
</script>
<style scoped></style>
