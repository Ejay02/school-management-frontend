<template>
  <div class="w-full lg:w-1/3 flex flex-col gap-8">
    <CalenderCard />
    <AnnouncementCard />
  </div>
</template>

<script setup>
import CalenderCard from "./cards/calenderCard.vue";
import AnnouncementCard from "./cards/announcementCard.vue";
</script>

<style scoped></style>
