<template>
  <div class="p-4 bg-white mt-4 rounded-lg shadow-lg cursor-pointer">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-lg font-semibold">Announcements</h1>
      <span class="text-gray-400 text-xs">View All</span>
    </div>

    <div class="flex flex-col gap-4 ">
      <div
        class="p-5 rounded-md odd:bg-eduSkyLight even:bg-eduPurpleLight hover:bg-gray-100"
        v-for="announce in announcements"
        :key="announce?.id"
      >
        <div class="flex items-center justify-between mb-2">
          <h1 class="font-medium text-gray-600 capitalize">
            {{ announce.title }}
          </h1>
          <span class="text-gray-300 text-xs bg-white rounded-md px-1 py-1">{{
            announce.date
          }}</span>
        </div>

        <div class="mt-2">
          <span class="text-gray-400 text-sm line-clamp-2">{{
            announce.description
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const announcements = ref([
  {
    id: 1,
    title: "Lorem ipsum dolor sit",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing.",
    date: "2024-10-10",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor sit",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, ut ullam. Quidem doloribus eos ducimus culpa quod mollitia libero qui, eum ipsum eveniet voluptate alias. Atque unde autem veritatis incidunt?",
    date: "2024-11-11",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor sit",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, ut ullam. Quidem doloribus eos ducimus culpa quod mollitia libero qui, eum ipsum eveniet voluptate alias. Atque unde autem veritatis incidunt?",
    date: "2024-11-21",
  },
]);
</script>

<style scoped></style>
