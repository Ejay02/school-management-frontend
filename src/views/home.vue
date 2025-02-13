<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <HomeNav />

    <!-- banner -->
    <Banner />

    <!-- Hero Section with Sign Up -->
    <HomeHero />

    <!-- Features Section -->
    <HomeFeatures />

    <!-- Testimonials Section -->
    <HomeTestimonials />

    <!-- Call to Action -->
    <HomeCallToAction />

    <!-- Footer -->
    <Footer />

    <!-- Chatbot Component -->
    <Chatbot />
  </div>
</template>

<script setup>
import Banner from "../components/banner.vue";
import Chatbot from "../components/chat/chatbot.vue";
import Footer from "../components/homeComponents/footer.vue";
import HomeNav from "../components/homeComponents/homeNav.vue";
import HomeHero from "../components/homeComponents/homeHero.vue";
import HomeFeatures from "../components/homeComponents/homeFeatures.vue";
import HomeTestimonials from "../components/homeComponents/homeTestimonials.vue";
import HomeCallToAction from "../components/homeComponents/homeCallToAction.vue";
</script>

<style scoped></style>
