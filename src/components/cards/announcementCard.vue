<template>
  <div class="p-4 bg-white rounded-lg shadow-lg cursor-pointer">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-lg font-semibold">Announcements</h1>
      <router-link to="/list/announcements" class="text-gray-400 text-xs"
        >View All</router-link
      >
    </div>

    <div class="flex flex-col gap-4">
      <div
        class="p-5 rounded-md odd:bg-eduSkyLight even:bg-eduPurpleLight hover:bg-gray-100"
        v-for="announce in announcements"
        :key="announce?.id"
      >
        <div class="flex items-center justify-between mb-2">
          <h1 class="font-medium text-gray-600 capitalize text-xs">
            {{ announce?.title }}
          </h1>
          <span
            class="text-[10px] bg-gray-50 rounded-md px-1 py-1 inline-flex items-center font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
            >{{ announce?.date }}</span
          >
        </div>

        <div class="mt-2">
          <span class="text-gray-400 line-clamp-2 text-xs">{{
            announce?.description
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
