<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <div class="bg-blue-50 p-4 rounded-lg shadow border border-blue-100">
      <div class="text-blue-500 text-xl mb-1">Total Classes</div>
      <div class="text-3xl font-bold">{{ stats?.classCount }}</div>
    </div>

    <div class="bg-green-50 p-4 rounded-lg shadow border border-green-100">
      <div class="text-green-500 text-xl mb-1">Present</div>
      <div class="text-3xl font-bold">
        {{ totalPresent }}
      </div>
    </div>
    <div class="bg-red-50 p-4 rounded-lg shadow border border-red-100">
      <div class="text-red-500 text-xl mb-1">Absent</div>
      <div class="text-3xl font-bold">{{ totalAbsent }}</div>
    </div>
    <div class="bg-purple-50 p-4 rounded-lg shadow border border-purple-100">
      <div class="text-purple-500 text-xl mb-1">Attendance Rate</div>
      <div class="text-3xl font-bold">{{ attendanceRate || 0 }}%</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  stats: {
    type: Object,
    required: true,
  },
});

const totalPresent = computed(
  () => props.stats.present?.reduce((sum, num) => sum + num, 0) || 0
);

const totalAbsent = computed(
  () => props.stats.absent?.reduce((sum, num) => sum + num, 0) || 0
);

const attendanceRate = computed(() => {
  const total = totalPresent.value + totalAbsent.value;
  return total > 0 ? ((totalPresent.value / total) * 100).toFixed(2) : 0;
});
</script>

<style scoped></style>
