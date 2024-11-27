<template>
  <div class="w-full xl:w-1/3 flex flex-col gap-4 cursor-pointer">
    <ShortcutsCard :shortcuts="shortcuts" />
    <PerformanceChartCard />
    <AnnouncementCard />
  </div>
</template>

<script setup>
import ShortcutsCard from "../../components/cards/shortcutsCard.vue";
import AnnouncementCard from "../../components/cards/announcementCard.vue";
import PerformanceChartCard from "../../components/cards/singleViewCards/performanceChartCard.vue";

const props = defineProps({
  shortcuts: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped></style>
