<template>
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
            Join our vibrant learning community where every child's potential is
            unleashed through innovative education and personalized attention.
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
                  class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurpleLight sm:text-sm/6"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurpleLight sm:text-sm/6"
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
</template>

<script setup>
const handleSubmit = () => {
  // Handle form submission logic here
  console.log("Form submitted");
};
</script>

<style scoped></style>
