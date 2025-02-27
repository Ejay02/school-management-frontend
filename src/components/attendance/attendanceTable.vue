<template>
  <div class="bg-white rounded-lg shadow border border-gray-200 p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">Attendance Records</h2>

      <div v-if="userHasAccess" class="flex gap-2">
        <button
          v-if="['teacher', 'admin', 'super_admin'].includes(userRole)"
          @click="toggleMarkAttendanceMode"
          class="px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-300 transition-colors"
        >
          Mark Attendance
        </button>

        <button
          v-if="markAttendanceMode"
          @click="toggleMarkAttendanceMode"
          class="px-3 py-1 bg-gray-50 text-gray-600 text-sm rounded hover:bg-gray-100 transition-colors border border-gray-300"
        >
          Cancel
        </button>
        <button
          v-if="markAttendanceMode"
          @click="$emit('saveAttendance')"
          class="px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-300 transition-colors"
        >
          Save
        </button>
      </div>
      <div v-else class="text-sm text-gray-500">View-only access</div>
    </div>

    <div class="">
      <!-- Search and filter -->
      <div class="mb-4 flex gap-3">
        <input
          v-model="localSearchQuery"
          placeholder="Search by name or lesson..."
          class="border rounded p-2 flex-grow"
        />
        <select
          v-model="localFilterStatus"
          class="border rounded p-2 border-eduSky"
        >
          <option value="all">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
      </div>

      <!-- Table -->
      <div class="">
        <LoadingScreen v-if="loading" message="Loading attendance records..." />
        <EmptyState
          v-else-if="studentStore?.students.length && !loading"
          icon="fa-regular fa-hourglass"
          heading="Nothing here yet!"
          description=""
        >
          <!-- v-if="userRole === 'teacher'" -->
          <button
            v-if="['teacher', 'admin', 'super_admin'].includes(userRole)"
            @click="toggleMarkAttendanceMode"
            class="px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-300 transition-colors"
          >
            Mark Attendance
          </button></EmptyState
        >
        <ErrorScreen v-else-if="error" />

        <!-- description="Add a class to get started." -->

        <!-- <ErrorScreen v-else-if="error" message="" /> -->

        <!--  -->
        <div class="overflow-x-auto" v-else>
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
                  Class
                </th>
                <th
                  class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Lesson
                </th>
                <th
                  class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>

            <!--  -->
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="record in attendanceRecords"
                :key="record?.id"
                class="hover:bg-gray-50"
              >
                <td class="py-2 px-3 text-sm text-gray-500">
                  {{ formatDate(record?.date) }}
                </td>
                <td class="py-2 px-3 text-sm capitalize">
                  {{ record?.student?.name }} {{ record?.student?.surname }}
                </td>
                <td class="py-2 px-3 text-sm">{{ record?.class?.name }}</td>
                <td class="py-2 px-3 text-sm">{{ record?.lesson?.name }}</td>
                <td class="py-2 px-3 text-sm">
                  <span
                    :class="{
                      'px-2 py-1 rounded-full text-xs': true,
                      'bg-green-100 text-green-800': record?.present,
                      'bg-red-100 text-red-800': !record?.present,
                    }"
                  >
                    {{ record?.present ? "Present" : "Absent" }}
                  </span>
                </td>
              </tr>
              <tr v-if="attendanceRecords?.length === 0">
                <td colspan="4" class="py-4 text-center text-gray-500">
                  No attendance records found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Pagination -->
    <!-- <div class="flex justify-between items-center mt-4">
      <div class="text-sm text-gray-500">
        Showing {{ paginatedRecords.length }} of {{ filteredRecords.length }}
        records
      </div>
      <div class="flex gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 border rounded text-sm disabled:opacity-50"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage * pageSize >= filteredRecords.length"
          class="px-3 py-1 border rounded text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";
import { useUserStore } from "../../store/userStore";
import { ref, computed, watch, onMounted } from "vue";
import { useStudentStore } from "../../store/studentStore";
import { useAttendanceStore } from "../../store/attendanceStore";

const props = defineProps({
  records: {
    type: Array,
    required: true,
  },
  searchQuery: {
    type: String,
    required: true,
  },
  filterStatus: {
    type: String,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  markAttendanceMode: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits([
  "update:currentPage",
  "toggleMarkAttendanceMode",
  "saveAttendance",
]);

const userStore = useUserStore();

const studentStore = useStudentStore();

const userRole = computed(() => userStore.currentRole);

// For local two-way binding in search/filter inputs
const localSearchQuery = ref(props.searchQuery);
const localFilterStatus = ref(props.filterStatus);

const attendanceStore = useAttendanceStore();
const attendanceRecords = computed(() => attendanceStore.attendanceRecords);

const loading = computed(() => attendanceStore.loading);
const error = computed(() => attendanceStore.error);

watch(
  () => props.searchQuery,
  (newVal) => {
    localSearchQuery.value = newVal;
  }
);

watch(
  () => props.filterStatus,
  (newVal) => {
    localFilterStatus.value = newVal;
  }
);

// Compute filtered records
const filteredRecords = computed(() => {
  let filtered = props.records;
  if (localSearchQuery.value) {
    const query = localSearchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (record) =>
        record.student.name.toLowerCase().includes(query) ||
        record.lesson.subject.name.toLowerCase().includes(query)
    );
  }
  if (localFilterStatus.value !== "all") {
    filtered = filtered.filter(
      (record) =>
        (localFilterStatus.value === "present" && record.present) ||
        (localFilterStatus.value === "absent" && !record.present)
    );
  }
  return filtered;
});

// Compute paginated records
const paginatedRecords = computed(() => {
  const start = (props.currentPage - 1) * props.pageSize;
  return filteredRecords.value.slice(start, start + props.pageSize);
});

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function prevPage() {
  if (props.currentPage > 1) {
    emit("update:currentPage", props.currentPage - 1);
  }
}

function nextPage() {
  if (props.currentPage * props.pageSize < filteredRecords.value.length) {
    emit("update:currentPage", props.currentPage + 1);
  }
}

function toggleMarkAttendanceMode() {
  emit("toggleMarkAttendanceMode");
}

// Assume that access rights are determined elsewhere. For demonstration:
const userHasAccess = true;

onMounted(() => {
  attendanceStore.fetchAttendance();
});
</script>
