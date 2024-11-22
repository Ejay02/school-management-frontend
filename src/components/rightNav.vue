<template>
  <div class="">
    <NavBar />
  </div>
  <div class="p-4 flex gap-4 flex-col md:flex-row  bg-gray-200 justify-between">
    <RouterView />
    <RightPage />
  </div>
</template>

<script setup>
import NavBar from "./navBar.vue";
import RightPage from "./rightPage.vue"
</script>

<style scoped></style>
