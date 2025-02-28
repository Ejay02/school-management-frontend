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
            <label class="text-sm text-gray-600">From:</label>
            <input
              type="date"
              v-model="startDate"
              class="border rounded p-2 text-sm"
            />
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">To:</label>
            <input
              type="date"
              v-model="endDate"
              class="border rounded p-2 text-sm"
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

        <!-- Attendance table -->
        <AttendanceTable />
      </div>
    </div>
  </div>
</template>

<script setup>
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";

import AttendanceTable from "./attendanceTable.vue";
import { ref, computed, onMounted } from "vue";
import AttendanceCard from "../cards/attendanceCard.vue";
import { useAttendanceStore } from "../../store/attendanceStore";
import AttendanceStatsOverviewCard from "./attendanceStatsOverviewCard.vue";

const attendanceStore = useAttendanceStore();

const loading = computed(() => attendanceStore.loading);
const error = computed(() => attendanceStore.error);

// Date range for filtering
const startDate = ref(
  formatDateForInput(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
); // Last 30 days
const endDate = ref(formatDateForInput(new Date()));

// Stats for the overview card
const stats = computed(() => attendanceStore.stats);

// Format date for input fields
function formatDateForInput(date) {
  return date.toISOString().split("T")[0];
}

// Fetch attendance data based on date range
async function fetchAttendanceData() {
  attendanceStore.loading = true;
  attendanceStore.error = null;

  try {
    // Fetch weekly stats for chart
    await attendanceStore.fetchSchoolAttendanceStats(
      startDate.value,
      endDate.value
    );
  } catch (err) {
    attendanceStore.error =
      "Failed to fetch attendance data. Please try again.";
  } finally {
    attendanceStore.loading = false;
  }
}

// Initialize data on component mount
onMounted(() => {
  fetchAttendanceData();
});
</script>

<style scoped></style>
