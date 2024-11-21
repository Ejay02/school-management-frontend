<template>
  <div class="rounded-2xl odd:bg-eduPurple even:bg-eduYellow p-4 flex-1">
    <div class="flex justify-between items-center text-xs">
      <span class="text-[10px] bg-white px-2 py-1 rounded-full text-green-600"
        >2024/25</span
      >
      <img src="/more.png" alt="more icon" class="h-5 w-5" />
    </div>
    <h1 class="text-2xl font-semibold my-4">1,234</h1>
    <h2 class="capitalize text-sm font-medium text-gray-400 ">{{ userType }}s</h2>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const type = ref("teacher");

const userType = computed(() => {
  switch (type.value) {
    case "teacher":
      return "Teacher";
    case "student":
      return "Student";
    case "admin":
      return "Admin";
    case "parent":
      return "Parent";
    default:
      return "Admin";
  }
});
</script>

<style scoped></style>
