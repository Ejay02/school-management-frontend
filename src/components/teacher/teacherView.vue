<template>
  <div class="flex-1 p-4 flex flex-col md:flex-row gap-4">
    <div class="w-full md:w-2/3">
      <LeftTeacherView />
    </div>
    <div class="w-full md:w-1/3">
      <RightTeacherView />
    </div>
  </div>
</template>

<script setup>
import LeftTeacherView from "./leftTeacherView.vue";
import RightTeacherView from "./rightTeacherView.vue";
</script>

<style scoped></style>
