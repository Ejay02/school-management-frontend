<template>
  <div class="min-h-screen bg-gray-200">
    <!-- Hero Section -->
    <AcademicsHero />

    <!-- Programs Overview -->
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
                Preparing students for higher education through rigorous
                academics and specialized programs.
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

    <!-- Curriculum Highlights -->
    <section class="py-16 bg-eduSkyLight">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-600 mb-8 text-center">
          Curriculum Highlights
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Core Subjects -->
          <div class="bg-eduYellowLight p-6 rounded-lg shadow-md">
            <div
              class="w-12 h-12 bg-eduPurple rounded-lg flex items-center justify-center mb-4"
            >
              <svg
                class="h-6 w-6 text-eduYellow"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">
              Core Subjects
            </h3>
            <p class="text-gray-400">
              Strong focus on Mathematics, Science, English, and Social Studies
              with experienced subject specialists.
            </p>
          </div>

          <!-- Technology Integration -->
          <div class="bg-eduYellowLight p-6 rounded-lg shadow-md">
            <div
              class="w-12 h-12 bg-eduPurple rounded-lg flex items-center justify-center mb-4"
            >
              <svg
                class="h-6 w-6 text-eduYellow"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">
              Technology Integration
            </h3>
            <p class="text-gray-400">
              Modern learning tools and digital literacy programs integrated
              across all subjects.
            </p>
          </div>

          <!-- Arts & Athletics -->
          <div class="bg-eduYellowLight p-6 rounded-lg shadow-md">
            <div
              class="w-12 h-12 bg-eduPurple rounded-lg flex items-center justify-center mb-4"
            >
              <svg
                class="h-6 w-6 text-eduYellow"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">
              Arts & Athletics
            </h3>
            <p class="text-gray-400">
              Comprehensive programs in visual arts, music, drama, and physical
              education for holistic development.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Academic Support -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-600 mb-8 text-center">
          Academic Support
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="/yy-teoh-rtSu8oEpPo4-unsplash.jpg"
              alt="Tutorial session"
              class="rounded-lg shadow-md"
            />
          </div>
          <div>
            <h3 class="text-2xl font-semibold text-gray-600 mb-4">
              Supporting Every Student's Success
            </h3>
            <div class="space-y-4">
              <div class="flex items-start">
                <svg
                  class="h-6 w-6 text-eduPurple mt-1 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 class="font-medium text-gray-600">Small Class Sizes</h4>
                  <p class="text-gray-500">
                    Ensuring personalized attention and active participation
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <svg
                  class="h-6 w-6 text-eduPurple mt-1 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 class="font-medium text-gray-600">Tutorial Programs</h4>
                  <p class="text-gray-500">
                    Before and after-school support from dedicated teachers
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <svg
                  class="h-6 w-6 text-eduPurple mt-1 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 class="font-medium text-gray-600">
                    Learning Support Services
                  </h4>
                  <p class="text-gray-500">
                    Specialized assistance for diverse learning needs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="bg-eduSkyLight py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-gray-600 mb-4">
          Ready to Join Our Academic Community?
        </h2>
        <p class="text-xl text-gray-500 mb-8">
          Schedule a visit to learn more about our programs and see our
          classrooms in action.
        </p>

        <router-link
          to="/contact"
          class="inline-block bg-indigo-600 text-eduSky px-8 py-3 rounded-md font-semibold hover:bg-indigo-500 hover:shadow-lg"
        >
          Schedule a Visit
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import AcademicsHero from "../../components/academicsComponents/academicsHero.vue";
</script>
