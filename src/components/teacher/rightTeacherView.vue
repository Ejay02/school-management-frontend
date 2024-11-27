<template>
  <div class="w-full xl:w-1/3 flex flex-col gap-4 cursor-pointer">
    <ShortcutsCard />
    <PerformanceChartCard />
    <AnnouncementCard />
  </div>
</template>

<script setup>
import ShortcutsCard from "../cards/shortcutsCard.vue";
import AnnouncementCard from "../cards/announcementCard.vue";
import PerformanceChartCard from "./cards/performanceChartCard.vue";
</script>

<style scoped></style>
