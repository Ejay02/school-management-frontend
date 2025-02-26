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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg shadow border border-blue-100">
            <div class="text-blue-500 text-xl mb-1">Total Classes</div>
            <div class="text-3xl font-bold">{{ stats.totalClasses || 0 }}</div>
          </div>
          <div
            class="bg-green-50 p-4 rounded-lg shadow border border-green-100"
          >
            <div class="text-green-500 text-xl mb-1">Present</div>
            <div class="text-3xl font-bold">
              {{ stats.presentClasses || 0 }}
            </div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg shadow border border-red-100">
            <div class="text-red-500 text-xl mb-1">Absent</div>
            <div class="text-3xl font-bold">{{ stats.absentClasses || 0 }}</div>
          </div>
          <div
            class="bg-purple-50 p-4 rounded-lg shadow border border-purple-100"
          >
            <div class="text-purple-500 text-xl mb-1">Attendance Rate</div>
            <div class="text-3xl font-bold">
              {{ stats.attendanceRate || 0 }}%
            </div>
          </div>
        </div>

        <!-- Weekly attendance chart -->
        <div class="bg-white rounded-lg shadow border border-gray-200 mb-6">
          <!-- <h2 class="text-lg font-semibold mb-4">Weekly Attendance Overview</h2> -->
          <div class="h-96">
            <AttendanceCard label="Weekly Attendance Overview" />
          </div>
        </div>

        <!-- Attendance table -->
        <div class="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Attendance Records</h2>
            <div
              v-if="
                userRole === 'teacher' ||
                userRole === 'admin' ||
                userRole === 'super_admin'
              "
              class="flex gap-2"
            >
              <button
                @click="markAttendanceMode = true"
                class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              >
                Mark Attendance
              </button>
              <button
                v-if="markAttendanceMode"
                @click="saveAttendance"
                class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                v-if="markAttendanceMode"
                @click="markAttendanceMode = false"
                class="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
            <div v-else class="text-sm text-gray-500">View-only access</div>
          </div>

          <!-- Search and filter -->
          <div class="mb-4 flex gap-3">
            <input
              v-model="searchQuery"
              placeholder="Search by name or subject..."
              class="border rounded p-2 flex-grow"
            />
            <select v-model="filterStatus" class="border rounded p-2">
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Student
                  </th>
                  <th
                    class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Subject
                  </th>
                  <th
                    class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Class
                  </th>
                  <th
                    class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="(record, index) in filteredAttendanceRecords"
                  :key="index"
                  class="hover:bg-gray-50"
                >
                  <td class="py-2 px-3 text-sm text-gray-500">
                    {{ formatDate(record.date) }}
                  </td>
                  <td class="py-2 px-3 text-sm">{{ record.student.name }}</td>
                  <td class="py-2 px-3 text-sm">
                    {{ record.lesson.subject.name }}
                  </td>
                  <td class="py-2 px-3 text-sm">
                    {{ record.lesson.class.name }}
                  </td>
                  <td class="py-2 px-3 text-sm">
                    <span
                      v-if="!markAttendanceMode"
                      :class="`px-2 py-1 rounded-full text-xs ${
                        record.present
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`"
                    >
                      {{ record.present ? "Present" : "Absent" }}
                    </span>
                    <select
                      v-else
                      v-model="record.present"
                      class="border rounded p-1 text-sm"
                      :class="
                        record.present ? 'border-green-500' : 'border-red-500'
                      "
                    >
                      <option :value="true">Present</option>
                      <option :value="false">Absent</option>
                    </select>
                  </td>
                </tr>
                <tr v-if="filteredAttendanceRecords.length === 0">
                  <td colspan="5" class="py-4 text-center text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex justify-between items-center mt-4">
            <div class="text-sm text-gray-500">
              Showing {{ filteredAttendanceRecords.length }} of
              {{ attendanceRecords.length }} records
            </div>
            <div class="flex gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                @click="currentPage++"
                :disabled="
                  currentPage * pageSize >= filteredAttendanceRecords.length
                "
                class="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useUserStore } from "../../store/userStore";
import AttendanceCard from "../cards/attendanceCard.vue";
import { useAttendanceStore } from "../../store/attendanceStore";

// Store
const attendanceStore = useAttendanceStore();
const userStore = useUserStore();

const userRole = computed(() => userStore.currentRole);

// Component state
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
  loading.value = true;
  error.value = null;

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
    error.value = "Failed to fetch attendance data. Please try again.";
  } finally {
    loading.value = false;
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

    // This would be a call to your backend service
    // await saveAttendanceChanges(attendanceData);

    markAttendanceMode = false;
    // Optionally refresh data
    await fetchAttendanceData();
  } catch (err) {
    error.value = "Failed to save attendance changes";
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// Initialize data on component mount
onMounted(() => {
  fetchAttendanceData();
});
</script>

<style scoped>

</style>
