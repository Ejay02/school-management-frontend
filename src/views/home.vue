<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section with Sign Up -->
    <header class="relative bg-eduPurple overflow-hidden">
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
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">
              Nurturing Minds, Building Futures
            </h1>
            <p class="text-xl text-blue-100 mb-8">
              Join our vibrant learning community where every child's potential
              is unleashed through innovative education and personalized
              attention.
            </p>

            <!-- Sign Up Form -->
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-md">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">
                Request Information
              </h3>
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Parent's Name"
                    class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
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
            <h3 class="text-xl font-semibold mb-2">Excellence in Education</h3>
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
            <h3 class="text-xl font-semibold mb-2">Dedicated Teachers</h3>
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
            <h3 class="text-xl font-semibold mb-2">Safe Environment</h3>
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
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
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
                <h4 class="font-semibold">Sarah Johnson</h4>
                <p class="text-gray-600 text-sm">Parent of Tom, Grade 5</p>
              </div>
            </div>
            <p class="text-gray-600">
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
                <h4 class="font-semibold">Michael Chen</h4>
                <p class="text-gray-600 text-sm">Parent of Amy, Grade 3</p>
              </div>
            </div>
            <p class="text-gray-600">
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
                <h4 class="font-semibold">Emily Rodriguez</h4>
                <p class="text-gray-600 text-sm">Parent of Sofia, Grade 6</p>
              </div>
            </div>
            <p class="text-gray-600">
              "We couldn't be happier with the quality of education and the
              supportive community at this school."
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-20 bg-eduSkyLight">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-8">
          Ready to Join Our School Family?
        </h2>
        <p class="text-xl text-eduSky font-medium mb-8">
          Schedule a tour or request more information today.
        </p>
        <button
          class="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-blue-50 transition-colors"
        >
          Schedule a Tour
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-white font-semibold mb-4">Contact Us</h3>
            <p>123 School Street</p>
            <p>City, State 12345</p>
            <p>Phone: (555) 123-4567</p>
            <p>Email: info@school.com</p>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-white">About Us</a></li>
              <li><a href="#" class="hover:text-white">Academics</a></li>
              <li><a href="#" class="hover:text-white">Admissions</a></li>
              <li><a href="#" class="hover:text-white">Calendar</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Programs</h3>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-white">Primary School</a></li>
              <li>
                <a href="#" class="hover:text-white">Secondary School</a>
              </li>
              <li><a href="#" class="hover:text-white">After School</a></li>
              <li>
                <a href="#" class="hover:text-white">Summer Programs</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Follow Us</h3>
            <div class="flex space-x-4">
              <a href="#" class="hover:text-white">
                <span class="sr-only">Facebook</span>
                <i class="fa-brands fa-square-facebook"></i>
              </a>
              <a href="#" class="hover:text-white">
                <span class="sr-only">Twitter</span>
                <i class="fa-brands fa-square-x-twitter"></i>
              </a>
              <a href="#" class="hover:text-white">
                <span class="sr-only">Instagram</span>
                <i class="fa-brands fa-instagram"></i>
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
const handleSubmit = () => {
  // Handle form submission logic here
  console.log("Form submitted");
};
</script>
<style scoped></style>
