<template>
  <div class="bg-white p-4 rounded-md mb-1 cursor-pointer">
    <h1 class="text-xl font-semibold">Shortcuts</h1>
    <div class="mt-4 flex gap-4 flex-wrap text-xs text-gray-500 ">
      <router-link to="/list/classes" class="p-2 text-center rounded-md bg-eduSkyLight"
        >Teacher's Classes</router-link
      >
      <router-link to="/list/students" class="p-2 rounded-md bg-eduPurpleLight"
        >Teacher's Students</router-link
      >
      <router-link to="/list/lessons" class="p-2 rounded-md bg-eduYellowLight"
        >Teacher's Lessons</router-link
      >
      <router-link to="/list/exams" class="p-2 rounded-md bg-pink-50"
        >Teacher's Exams</router-link
      >
      <router-link to="/list/assignments" class="p-2 rounded-md bg-eduSky"
        >Teacher's Assignments</router-link
      >
    </div>
  </div>
</template>

<script setup></script>

<style scoped></style>
