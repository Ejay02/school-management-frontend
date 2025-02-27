<template>
  <div
    class="cursor-pointer rounded-2xl odd:bg-eduPurple even:bg-eduYellow p-4 flex-1 transition-transform duration-300 hover:scale-105 hover:shadow-lg"
  >
    <div class="flex justify-between items-center text-xs">
      <span class="text-[10px] bg-white px-2 py-1 rounded-full text-green-600"
        >{{ academicYear }}/{{ nextYear }}</span
      >

      <div
        class="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
      >
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
    <h1 class="text-2xl font-semibold my-4">{{ count }}</h1>
    <h2 class="capitalize text-sm font-medium text-gray-500">{{ role }}s</h2>
  </div>
</template>

<script setup>
const props = defineProps({
  academicYear: {
    type: String,
    default: "",
  },
  nextYear: {
    type: String,
    default: "",
  },
  count: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    default: "",
  },
});
</script>

<style scoped></style>
