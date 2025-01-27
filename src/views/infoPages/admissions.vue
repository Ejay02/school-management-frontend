<template>
  <div class="min-h-screen bg-eduSkyLight">
    <!-- Hero Section -->
    <AdmissionsHero />

    <!-- Application Timeline -->
    <ApplicationTimeline />

    <!-- Requirements -->
    <Requirements />

    <!-- Application Form Section -->
    <ApplicationForm />
  </div>
</template>
<script setup>
import Requirements from "../../components/admissionsComponents/requirements.vue";
import AdmissionsHero from "../../components/admissionsComponents/admissionsHero.vue";
import ApplicationForm from "../../components/admissionsComponents/applicationForm.vue";
import ApplicationTimeline from "../../components/admissionsComponents/applicationTimeline.vue";
</script>
