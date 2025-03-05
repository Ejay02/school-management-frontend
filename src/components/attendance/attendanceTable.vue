<template>
  <div
    class="bg-white rounded-lg shadow border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
  >
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">
        {{ markAttendanceMode ? "Mark Attendance" : "Attendance Records" }}
      </h2>

      <div v-if="userHasAccess" class="flex gap-2">
        <button
          v-if="
            !markAttendanceMode &&
            ['teacher', 'admin', 'super_admin'].includes(userRole)
          "
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
          @click="saveAttendance"
          class="px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-300 transition-colors"
        >
          Save
        </button>
      </div>
      <div v-else class="text-sm text-gray-500">View-only access</div>
    </div>

    <!-- Regular Attendance View -->
    <div v-if="!markAttendanceMode">
      <!-- Search and filter -->
      <div class="mb-4 flex gap-3">
        <input
          v-model="searchQuery"
          placeholder="Search by name, class or lesson..."
          class="border rounded p-2 flex-grow focus:outline-none focus:ring-0 focus:border-eduPurple cursor-pointer"
        />
        <select
          v-model="filterStatus"
          class="border rounded p-2 border-eduSky focus:outline-none focus:ring-0 focus:border-eduPurple cursor-pointer"
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
          v-else-if="
            studentStore?.students.length &&
            !loading &&
            attendanceRecords.length === 0
          "
          icon="fa-regular fa-hourglass"
          heading="Nothing here yet!"
          description=""
        >
          <button
            v-if="['teacher', 'admin', 'super_admin'].includes(userRole)"
            @click="toggleMarkAttendanceMode"
            class="px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-300 transition-colors"
          >
            Mark Attendance
          </button>
        </EmptyState>
        <ErrorScreen v-else-if="error" />

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

            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="record in paginatedRecords"
                :key="record?.id"
                class="hover:bg-gray-50 cursor-pointer"
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
                <td colspan="5" class="py-4 text-center text-gray-500">
                  No attendance records found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination
        :currentPage="currentPage"
        :hasMore="attendanceStore.hasMore"
        @update:page="handlePageChange"
      />
    </div>

    <!-- Mark Attendance Mode -->
    <div v-else>
      <!-- Class and date selectors -->
      <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Class</label>

          <select
            v-model="selectedClass"
            class="border rounded p-2 w-full focus:outline-none focus:ring-0 focus:border-eduPurple cursor-pointer"
          >
            <option value="">Select a class</option>
            <option
              v-for="class_ in classes"
              :key="class_.id"
              :value="class_.id"
            >
              {{ class_.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm text-gray-600 mb-1">Lesson</label>
          <select
            v-model="selectedLesson"
            class="border rounded p-2 w-full focus:outline-none focus:ring-0 focus:border-eduPurple cursor-pointer"
            :disabled="!selectedClass"
          >
            <option value="">Select a lesson</option>
            <option
              v-for="lesson in filteredLessons"
              :key="lesson.id"
              :value="lesson.id"
            >
              {{ lesson.name }}
            </option>
          </select>
        </div>

        <div>
          <label
            class="block text-sm text-gray-600 mb-1 focus:outline-none focus:ring-0 focus:border-eduPurple cursor-pointer"
            >Date</label
          >
          <input
            type="date"
            v-model="selectedDate"
            class="border rounded p-2 w-full"
          />
        </div>
      </div>

      <!-- Student list for marking attendance -->
      <div v-if="selectedClass && selectedLesson && selectedDate">
        <div class="mb-4">
          <input
            v-model="studentSearchQuery"
            placeholder="Search students..."
            class="border rounded p-2 w-full focus:outline-none focus:ring-0 focus:border-eduPurple cursor-pointer"
          />
        </div>

        <div class="overflow-x-auto">
          <LoadingScreen v-if="loadingStudents" message="Loading students..." />
          <EmptyState
            v-else-if="filteredStudents.length === 0"
            icon="fa-regular fa-user"
            heading="No students found"
            description="There are no students in this class or your search returned no results."
          />

          <table v-else class="min-w-full bg-white">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Student
                </th>
                <th
                  class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="py-2 px-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="student in filteredStudents"
                :key="student.id"
                class="hover:bg-gray-50"
              >
                <td class="py-2 px-3 text-sm capitalize">
                  {{ student.name }} {{ student.surname }}
                </td>
                <td class="py-2 px-3 text-sm">
                  <span
                    :class="{
                      'px-2 py-1 rounded-full text-xs': true,
                      'bg-green-100 text-green-700':
                        studentAttendance[student.id],
                      'bg-red-100 text-red-700':
                        studentAttendance[student.id] === false,
                      'bg-gray-100 text-gray-600':
                        studentAttendance[student.id] === undefined,
                    }"
                  >
                    {{
                      studentAttendance[student.id] === undefined
                        ? "Not marked"
                        : studentAttendance[student.id]
                        ? "Present"
                        : "Absent"
                    }}
                  </span>
                </td>
                <td class="py-2 px-3 text-sm text-center">
                  <div class="flex justify-center gap-2">
                    <button
                      @click="markStudentAttendance(student.id, true)"
                      class="px-2 py-1 bg-green-200 text-green-700 text-xs rounded hover:bg-green-300 transition-colors"
                      :class="{
                        'ring-1 ring-inset ring-green-600/20':
                          studentAttendance[student.id] === true,
                      }"
                    >
                      Present
                    </button>
                    <button
                      @click="markStudentAttendance(student.id, false)"
                      class="px-2 py-1 bg-red-200 text-red-700 text-xs rounded hover:bg-red-300 transition-colors"
                      :class="{
                        'ring-1 ring-inset ring-red-600/10':
                          studentAttendance[student.id] === false,
                      }"
                    >
                      Absent
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <Pagination
            :currentPage="currentPage"
            :hasMore="attendanceStore.hasMore"
            @update:page="handlePageChange"
          />
        </div>
      </div>

      <div
        v-else
        class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
        role="alert"
      >
        <p class="font-bold">Warning</p>
        <p>Please select a class, lesson, and date to mark attendance.</p>
      </div>
    </div>
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
import { useClassStore } from "../../store/classStore";
import { useLessonStore } from "../../store/lessonStore";
import { formatDate } from "../../utils/date.holidays";
import Pagination from "../pagination.vue";

const userStore = useUserStore();
const studentStore = useStudentStore();
const attendanceStore = useAttendanceStore();
const classStore = useClassStore();
const lessonStore = useLessonStore();

const userRole = computed(() => userStore.currentRole);
const userHasAccess = computed(() =>
  ["teacher", "admin", "super_admin"].includes(userRole.value)
);

// Regular attendance view
const searchQuery = ref("");
const filterStatus = ref("all");
const currentPage = ref(1);
const pageSize = ref(10);

// Mark attendance mode
const markAttendanceMode = ref(false);
const selectedClass = ref("");
const selectedLesson = ref("");
const selectedDate = ref(new Date().toISOString().split("T")[0]); // Today's date
const studentSearchQuery = ref("");
const studentAttendance = ref({});
const loadingStudents = ref(false);

// Computed properties
const loading = computed(() => attendanceStore.loading);
const error = computed(() => attendanceStore.error);
const attendanceRecords = computed(() => attendanceStore.attendanceRecords);
const classes = computed(() => classStore.classes);
const lessons = computed(() => lessonStore.lessons);
const students = computed(() => studentStore.students);

// Get lessons for selected class
const filteredLessons = computed(() => {
  if (!selectedClass.value) return [];

  // Find the selected class in the classes array
  const currentClass = classes.value.find(
    (cls) => cls.id === selectedClass.value
  );

  if (!currentClass || !currentClass.subjects) return [];

  // Flatten lessons from all subjects in the selected class
  return currentClass.subjects.flatMap((subject) =>
    subject.lessons.map((lesson) => ({
      ...lesson,
      subjectId: subject.id,
      subjectName: subject.name,
      classId: currentClass.id,
    }))
  );
});

// Filter attendance records
const filteredAttendanceRecords = computed(() => {
  let filtered = attendanceRecords.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (record) =>
        (record.student?.name || "").toLowerCase().includes(query) ||
        (record.student?.surname || "").toLowerCase().includes(query) ||
        (record.lesson?.name || "").toLowerCase().includes(query) ||
        (record.class?.name || "").toLowerCase().includes(query)
    );
  }

  if (filterStatus.value !== "all") {
    filtered = filtered.filter(
      (record) =>
        (filterStatus.value === "present" && record.present) ||
        (filterStatus.value === "absent" && !record.present)
    );
  }

  return filtered;
});

// Paginated records
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredAttendanceRecords.value.slice(start, start + pageSize.value);
});

// Filter students for the mark attendance view
const filteredStudents = computed(() => {
  if (!selectedClass.value) return [];

  // Find the class object in class store that matches the selected class ID
  const classObj = classStore.classes.find(
    (cls) => cls.id === selectedClass.value
  );

  // Return the students from that class if available
  return classObj && classObj.students ? classObj.students : [];
});

// Reset pagination when filters change
watch([searchQuery, filterStatus], () => {
  currentPage.value = 1;
});

// Reset lesson when class changes
watch(selectedClass, () => {
  selectedLesson.value = "";
  studentAttendance.value = {};
});

// Update student attendance state when lesson changes
watch(selectedLesson, () => {
  if (selectedLesson.value && students.value.length > 0) {
    initializeStudentAttendance();
  } else {
    studentAttendance.value = {};
  }
});

// Toggle mark attendance mode
function toggleMarkAttendanceMode() {
  markAttendanceMode.value = !markAttendanceMode.value;

  if (markAttendanceMode.value) {
    // Reset the form when entering mark attendance mode
    selectedClass.value = "";
    selectedLesson.value = "";
    selectedDate.value = new Date().toISOString().split("T")[0];
    studentAttendance.value = {};

    // Fetch classes and lessons if not already loaded
    if (classes.value.length === 0) {
      classStore.fetchClasses();
    }
    if (lessons.value.length === 0) {
      lessonStore.fetchLessons();
    }
  }
}

// Initialize attendance object for all applicable students
function initializeStudentAttendance() {
  if (!selectedLesson.value) return;

  studentAttendance.value = {};

  // Get students who should be marked for this lesson
  const relevantStudents = filteredStudents.value;

  // Initialize attendance state for each student
  relevantStudents.forEach((student) => {
    studentAttendance.value[student.id] = undefined;
  });
}

// Mark a student's attendance
function markStudentAttendance(studentId, isPresent) {
  studentAttendance.value[studentId] = isPresent;
}

// Save attendance changes
async function saveAttendance() {
  if (!selectedClass.value || !selectedLesson.value || !selectedDate.value) {
    alert("Please select a class, lesson, and date");
    return;
  }

  // Check if all students have attendance marked
  const unmarkedStudents = Object.entries(studentAttendance.value).filter(
    ([_, status]) => status === undefined
  ).length;

  if (
    unmarkedStudents > 0 &&
    !confirm(
      `${unmarkedStudents} students have not been marked. Continue anyway?`
    )
  ) {
    return;
  }

  attendanceStore.loading = true;

  try {
    // Prepare data for backend
    // Build attendance records array (each record for one student)
    const attendanceData = Object.entries(studentAttendance.value)
      .filter(([_, status]) => status !== undefined)
      .map(([studentId, isPresent]) => ({
        studentId,
        lessonId: selectedLesson.value,
        classId: selectedClass.value,
        date: selectedDate.value,
        present: isPresent,
      }));

    console.log("Attendance data to save:", attendanceData);

    for (const record of attendanceData) {
      await attendanceStore.markAttendance(record.lessonId, {
        studentId: record.studentId,
        present: record.present,
        date: record.date,
      });
    }

    // Reset form and exit mark attendance mode
    markAttendanceMode.value = false;

    // Refresh the attendance records
    await attendanceStore.fetchAttendance();
  } catch (err) {
    console.error("Error saving attendance:", err);
    attendanceStore.error = "Failed to save attendance";
  } finally {
    attendanceStore.loading = false;
  }
}

// Initialize data on component mount
onMounted(async () => {
  attendanceStore.fetchAttendance();

  // Fetch classes and lessons
  if (userHasAccess.value) {
    classStore.fetchClasses();
    lessonStore.fetchLessons();
  }
});
</script>
