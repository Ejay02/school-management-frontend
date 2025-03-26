<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <!-- Header with date range and filters -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-3 md:mb-0">
          Attendance Dashboard
        </h1>
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex items-center gap-2">
            <label for="from" class="text-sm text-gray-600">From:</label>
            <input
              type="date"
              v-model="startDate"
              class="border border-gray-300 rounded-md p-2 text-sm focus:ring-eduPurple focus:border-eduPurple focus:outline-none cursor-pointer"
            />
          </div>

          <div class="flex items-center gap-2">
            <label for="to" class="text-sm text-gray-600">To:</label>
            <input
              type="date"
              v-model="endDate"
              class="border border-gray-300 rounded-md p-2 text-sm focus:ring-eduPurple focus:border-eduPurple focus:outline-none cursor-pointer"
            />
          </div>
          <button
            @click="fetchAttendanceData"
            class="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-300 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      <!-- Loading and error states -->
      <LoadingScreen v-if="loading" message="Loading attendance data ..." />
      <ErrorScreen v-if="error" message="" />

      <!-- Main content - Cards and charts -->
      <div v-else>
        <!-- Stats overview cards -->
        <AttendanceStatsOverviewCard :stats="stats" />

        <!-- Weekly attendance chart -->
        <div class="bg-white rounded-lg shadow border border-gray-200 mb-6">
          <div class="h-96">
            <AttendanceCard label="Weekly Attendance Overview" />
          </div>
        </div>

        <!-- Mark attendance | list -->
        <AttendanceTable class="shadow" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import {
  formatDateForInput,
  getFriday,
  getMonday,
} from "../../utils/date.holidays";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";

import { useAttendanceStore } from "../../store/attendanceStore";
import AttendanceCard from "../cards/attendanceCard.vue";
import AttendanceStatsOverviewCard from "./attendanceStatsOverviewCard.vue";
import AttendanceTable from "./attendanceTable.vue";

const attendanceStore = useAttendanceStore();

const loading = computed(() => attendanceStore.loading);
const error = computed(() => attendanceStore.error);
const stats = computed(() => attendanceStore.stats);

const startDate = ref(formatDateForInput(getMonday(new Date())));
const endDate = ref(formatDateForInput(getFriday(new Date())));

// Move function outside onMounted
const fetchAttendanceData = async () => {
  await attendanceStore.fetchAttendanceData(startDate.value, endDate.value);
  await attendanceStore.fetchAttendance({ page: 1, limit: 10 });
};

onMounted(() => {
  fetchAttendanceData();
});
</script>

<style scoped></style>
