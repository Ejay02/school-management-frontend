<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <div class="bg-blue-50 p-4 rounded-lg shadow border border-blue-100">
      <div class="text-blue-500 text-xl mb-1">Total Classes</div>
      <div class="text-3xl font-bold">{{ stats.totalClasses || 0 }}</div>
    </div>
    <div class="bg-green-50 p-4 rounded-lg shadow border border-green-100">
      <div class="text-green-500 text-xl mb-1">Present</div>
      <div class="text-3xl font-bold">
        {{ stats.presentClasses || 0 }}
      </div>
    </div>
    <div class="bg-red-50 p-4 rounded-lg shadow border border-red-100">
      <div class="text-red-500 text-xl mb-1">Absent</div>
      <div class="text-3xl font-bold">{{ stats.absentClasses || 0 }}</div>
    </div>
    <div class="bg-purple-50 p-4 rounded-lg shadow border border-purple-100">
      <div class="text-purple-500 text-xl mb-1">Attendance Rate</div>
      <div class="text-3xl font-bold">{{ stats.attendanceRate || 0 }}%</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  stats: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped></style>
