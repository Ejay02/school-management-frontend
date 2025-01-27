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
    <AcademicsCallToAction />
  </div>
</template>

<script setup>
import AcademicsHero from "../../components/academicsComponents/academicsHero.vue";
import AcademicsSupport from "../../components/academicsComponents/academicsSupport.vue";
import AcademicsPrograms from "../../components/academicsComponents/academicsPrograms.vue";
import AcademicsCurriculum from "../../components/academicsComponents/academicsCurriculum.vue";
import AcademicsCallToAction from "../../components/academicsComponents/academicsCallToAction.vue";
</script>
