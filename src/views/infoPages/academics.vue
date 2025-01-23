<template>
  <div class="min-h-screen bg-gray-200">
    <!-- Hero Section -->
    <AcademicsHero />

    <!-- Programs Overview -->
    <AcademicsPrograms />

    <!-- Curriculum Highlights -->
    <AcademicsCurriculum />

    <!-- Academic Support -->
    <AcademicsSupport />

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
import AcademicsCurriculum from "../../components/academicsComponents/academicsCurriculum.vue";
import AcademicsHero from "../../components/academicsComponents/academicsHero.vue";
import AcademicsPrograms from "../../components/academicsComponents/academicsPrograms.vue";
import AcademicsSupport from "../../components/academicsComponents/academicsSupport.vue";
</script>
