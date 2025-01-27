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

          <!-- Request Info -->
          <RequestInfoCard />
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
import RequestInfoCard from "../cards/requestInfoCard.vue";

const handleSubmit = () => {
  // Handle form submission logic here
  console.log("Form submitted");
};
</script>

<style scoped></style>
