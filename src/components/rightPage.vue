<template>
  <div class="w-full lg:w-1/3 flex flex-col gap-8">
    <!-- <div class="rounded border border-gray-300 p-2 w-full"> -->
    <div class="rounded border-r border-t border-b border-gray-300 p-2 w-full">
      <CalenderCard />
      <AnnouncementCard />
    </div>
  </div>
</template>

<script setup>
import CalenderCard from "./cards/calenderCard.vue";
import AnnouncementCard from "./cards/announcementCard.vue";
</script>

<style scoped></style>
