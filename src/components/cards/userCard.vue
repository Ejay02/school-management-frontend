<template>
  <div
    class="cursor-pointer rounded-2xl odd:bg-eduPurple even:bg-eduYellow p-4 flex-1"
  >
    <div class="flex justify-between items-center text-xs">
      <span class="text-[10px] bg-white px-2 py-1 rounded-full text-green-600"
        >2024/25</span
      >
      <div class="">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
          />
        </svg>
      </div>
    </div>
    <h1 class="text-2xl font-semibold my-4">1,234</h1>
    <h2 class="capitalize text-sm font-medium text-gray-500">
      {{ userType }}s
    </h2>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const type = ref("");

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
