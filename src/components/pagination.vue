<template>
  <div class="p-4 flex items-center justify-between text-gray-500">
    <button
      disabled
      class="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Prev
    </button>
    <div class="flex items-center gap-2 text-sm">
      <button class="px-2 rounded-md bg-eduSky">1</button>
      <button class="px-2 rounded-md">2</button>
      <button class="px-2 rounded-md">3</button>
      <button class="px-2 rounded-md">...</button>
      <button class="px-2 rounded-md">10</button>
    </div>
    <button
      class="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
</template>

<script setup></script>

<style scoped></style>
