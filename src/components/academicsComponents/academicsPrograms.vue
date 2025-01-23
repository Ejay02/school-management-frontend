<template>
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-gray-600 mb-8 text-center">
        Our Academic Programs
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Primary School -->
        <div class="bg-eduYellowLight rounded-lg shadow-xl overflow-hidden">
          <img
            src="/alexander-grey--juj1-lre5c-unsplash.jpg"
            alt="Primary school students"
            class="w-full h-48 object-cover"
          />
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-600 mb-2">
              Primary School (Primary 1-6)
            </h3>
            <p class="text-gray-500 mb-4">
              Building strong foundations in core subjects while fostering
              creativity and social development.
            </p>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-center">
                <svg
                  class="h-5 w-5 text-eduPurple mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Foundational literacy and numeracy
              </li>
              <li class="flex items-center">
                <svg
                  class="h-5 w-5 text-eduPurple mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Hands-on learning experiences
              </li>
              <li class="flex items-center">
                <svg
                  class="h-5 w-5 text-eduPurple mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Early introduction to technology
              </li>
            </ul>
            <router-link
              to="/primary"
              class="inline-block mt-4 text-eduPurple hover:text-eduPurpleLight font-medium"
            >
              Learn more →
            </router-link>
          </div>
        </div>

        <!-- Secondary School -->
        <div class="bg-eduYellowLight rounded-lg shadow-md overflow-hidden">
          <img
            src="/jeshoots-com-5EKw8Z7CgE4-unsplash.jpg"
            alt="Secondary school students"
            class="w-full h-48 object-cover"
          />
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-600 mb-2">
              Secondary School (JSS 1 - SSS 3)
            </h3>
            <p class="text-gray-500 mb-4">
              Preparing students for higher education through rigorous academics
              and specialized programs.
            </p>
            <ul class="space-y-2 text-gray-600">
              <li class="flex items-center">
                <svg
                  class="h-5 w-5 text-eduPurple mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Advanced placement courses
              </li>
              <li class="flex items-center">
                <svg
                  class="h-5 w-5 text-eduPurple mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                STEM and humanities pathways
              </li>
              <li class="flex items-center">
                <svg
                  class="h-5 w-5 text-eduPurple mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                College preparation program
              </li>
            </ul>
            <router-link
              to="/secondary"
              class="inline-block mt-4 text-eduPurple hover:text-eduPurpleLight font-medium"
            >
              Learn more →
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped></style>
