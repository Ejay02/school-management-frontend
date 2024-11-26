<template>
  <div class="">
    <NavBar />
  </div>
  <div class="p-4 flex gap-4 flex-col md:flex-row bg-gray-200 justify-between">
    <RouterView />
    <RightPage v-if="showRightCard" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import NavBar from "./navBar.vue";
import { useRoute } from "vue-router";
import RightPage from "./rightPage.vue";

const $route = useRoute();

const allowedRoutes = [
  "/dashboard/admin",
  "/dashboard/parent",
  "/dashboard/teacher",
  "/dashboard/student",
];

const showRightCard = computed(() => allowedRoutes.includes($route.fullPath));
</script>

<style scoped></style>
