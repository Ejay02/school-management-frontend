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
          <!-- <h2 class="text-lg font-semibold mb-4">Weekly Attendance Overview</h2> -->
          <div class="h-96">
            <AttendanceCard label="Weekly Attendance Overview" />
          </div>
        </div>

        <!-- Attendance table -->
        <!-- v-if="" -->
        <AttendanceTable
          :records="attendanceRecords"
          :searchQuery="searchQuery"
          :filterStatus="filterStatus"
          :currentPage="currentPage"
          :pageSize="pageSize"
          :markAttendanceMode="markAttendanceMode"
          @update:currentPage="updatePage"
          @toggleMarkAttendanceMode="toggleMarkAttendanceMode"
          @saveAttendance="saveAttendance"
        />

        <!--  -->
      </div>
    </div>
  </div>
</template>

<script setup>
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";
import { useUserStore } from "../../store/userStore";
import AttendanceTable from "./attendanceTable.vue";
import { ref, computed, onMounted, watch } from "vue";
import AttendanceCard from "../cards/attendanceCard.vue";
import { useAttendanceStore } from "../../store/attendanceStore";
import AttendanceStatsOverviewCard from "./attendanceStatsOverviewCard.vue";

const attendanceStore = useAttendanceStore();
const userStore = useUserStore();

const userRole = computed(() => userStore.currentRole);

const loading = computed(() => attendanceStore.loading);
const error = computed(() => attendanceStore.error);

const startDate = ref(
  formatDateForInput(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
); // Last 30 days

const endDate = ref(formatDateForInput(new Date()));

const attendanceRecords = ref([]);
const markAttendanceMode = ref(false);
const searchQuery = ref("");
const filterStatus = ref("all");
const currentPage = ref(1);
const pageSize = ref(10);
const stats = ref({
  totalClasses: 0,
  presentClasses: 0,
  absentClasses: 0,
  attendanceRate: 0,
});

// Filter records based on search and status
const filteredAttendanceRecords = computed(() => {
  let filtered = attendanceRecords.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (record) =>
        record.student.name.toLowerCase().includes(query) ||
        record.lesson.subject.name.toLowerCase().includes(query)
    );
  }

  if (filterStatus.value !== "all") {
    filtered = filtered.filter(
      (record) =>
        (filterStatus.value === "present" && record.present) ||
        (filterStatus.value === "absent" && !record.present)
    );
  }

  // Apply pagination
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;

  return filtered.slice(start, end);
});

// Watch for filter changes to reset pagination
watch([searchQuery, filterStatus], () => {
  currentPage.value = 1;
});

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

// Format date for input fields
function formatDateForInput(date) {
  return date.toISOString().split("T")[0];
}

// Fetch attendance data based on role
async function fetchAttendanceData() {
  attendanceStore.loading = true;
  attendanceStore.error = null;

  try {
    // Fetch weekly stats for chart
    await attendanceStore.fetchSchoolAttendanceStats(
      startDate.value,
      endDate.value
    );

    // Fetch attendance records based on user role

    const response = await fetchAttendancesByRole(userRole.value);
    attendanceRecords.value = response.data;

    // Calculate stats
    const totalClasses = attendanceRecords.value.length;
    const presentClasses = attendanceRecords.value.filter(
      (a) => a.present
    ).length;

    stats.value = {
      totalClasses,
      presentClasses,
      absentClasses: totalClasses - presentClasses,
      attendanceRate: totalClasses
        ? Math.round((presentClasses / totalClasses) * 100 * 100) / 100
        : 0,
    };
  } catch (err) {
    console.error("Error fetching attendance data:", err);
    attendanceStore.error =
      "Failed to fetch attendance data. Please try again.";
  } finally {
    attendanceStore.loading = false;
  }
}

// Mock function to simulate API call
async function fetchAttendancesByRole(role) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Sample data structure matching your backend
      resolve({
        data: [
          {
            id: "1",
            date: "2025-02-20",
            present: true,
            student: { id: "s1", name: "John Doe" },
            lesson: {
              id: "l1",
              subject: { id: "sub1", name: "Mathematics" },
              class: { id: "c1", name: "Grade 10-A" },
            },
          },
          {
            id: "2",
            date: "2025-02-20",
            present: false,
            student: { id: "s2", name: "Jane Smith" },
            lesson: {
              id: "l1",
              subject: { id: "sub1", name: "Mathematics" },
              class: { id: "c1", name: "Grade 10-A" },
            },
          },
          {
            id: "3",
            date: "2025-02-21",
            present: true,
            student: { id: "s1", name: "John Doe" },
            lesson: {
              id: "l2",
              subject: { id: "sub2", name: "Science" },
              class: { id: "c1", name: "Grade 10-A" },
            },
          },
          // Add more mock records here for testing
        ],
      });
    }, 500);
  });
}

// Save attendance changes
async function saveAttendance() {
  loading.value = true;

  try {
    // Prepare data for backend
    const attendanceData = attendanceRecords.value.map((record) => ({
      studentId: record.student.id,
      date: record.date,
      present: record.present,
    }));

    // This would be a call  backend service
    // await saveAttendanceChanges(attendanceData);

    markAttendanceMode = false;
    // Optionally refresh data
    await fetchAttendanceData();
  } catch (err) {
    attendanceStore.error = "Failed to save attendance changes";
    console.error(err);
  } finally {
    attendanceStore.loading = false;
  }
}

function toggleMarkAttendanceMode() {
  markAttendanceMode.value = !markAttendanceMode.value;
}

function updatePage(newPage) {
  currentPage.value = newPage;
}

// Initialize data on component mount
onMounted(() => {
  fetchAttendanceData();
});
</script>

<style scoped></style>
