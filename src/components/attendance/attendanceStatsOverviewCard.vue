<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 cursor-pointer"
  >
    <div
      class="bg-blue-50 p-4 rounded-lg shadow border border-blue-100 transition-transform duration-300 hover:scale-105 hover:shadow-lg"
    >
      <div class="text-blue-500 text-xl mb-1">Total Classes</div>
      <div class="text-3xl font-bold">{{ stats?.studentCount }}</div>
    </div>

    <div
      class="bg-green-50 p-4 rounded-lg shadow border border-green-100 transition-transform duration-300 hover:scale-105 hover:shadow-lg"
    >
      <div class="text-green-500 text-xl mb-1">Present</div>
      <div class="text-3xl font-bold">
        {{ totalPresent }}
      </div>
    </div>

    <div
      class="bg-red-50 p-4 rounded-lg shadow border border-red-100 transition-transform duration-300 hover:scale-105 hover:shadow-lg"
    >
      <div class="text-red-500 text-xl mb-1">Absent</div>
      <div class="text-3xl font-bold">{{ totalAbsent }}</div>
    </div>

    <div
      class="bg-purple-50 p-4 rounded-lg shadow border border-purple-100 transition-transform duration-300 hover:scale-105 hover:shadow-lg"
    >
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

const totalStudents = 12 * 30;

const attendanceRate = computed(() => {
  return totalStudents > 0
    ? ((totalPresent.value / totalStudents) * 100).toFixed(2)
    : "0.00";
});
</script>

<style scoped></style>
