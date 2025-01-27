<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-100">
    <!-- Header Section -->
    <AboutHeader />

    <!-- Hero Section -->
    <AboutHero />

    <!-- Leadership Section -->
    <AboutLeadership />

    <!-- Video Section -->
    <AboutVideo />
  </div>
</template>

<script setup>
import AboutHero from "../../components/aboutComponents/aboutHero.vue";
import AboutVideo from "../../components/aboutComponents/aboutVideo.vue";
import AboutHeader from "../../components/aboutComponents/aboutHeader.vue";
import AboutLeadership from "../../components/aboutComponents/aboutLeadership.vue";
</script>
