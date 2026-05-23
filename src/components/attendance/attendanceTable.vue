<template>
  <div
    class="bg-white rounded-lg shadow border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
  >
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">
        {{ markAttendanceMode ? "Mark Attendance" : "Attendance Records" }}
      </h2>

      <div class="">
        <div v-if="userHasAccess" class="flex gap-2">
          <button
            v-if="!markAttendanceMode && ['teacher'].includes(userRole)"
            @click="toggleMarkAttendanceMode"
            :disabled="!canMarkAttendance"
            :title="!canMarkAttendance ? markAttendanceDisabledMessage : ''"
            class="px-3 py-1 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm rounded hover:bg-indigo-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            class="px-3 py-1 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm rounded hover:bg-indigo-300 transition-colors"
          >
            Save
          </button>
        </div>
        <div v-else class="text-sm text-gray-500">View-only access</div>
      </div>
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
        <div
          v-if="loading"
          class="flex items-center justify-center gap-2 py-10 text-sm text-gray-600"
        >
          <span
            class="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-500"
          ></span>
          Loading attendance records...
        </div>
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
            v-if="['teacher'].includes(userRole)"
            @click="toggleMarkAttendanceMode"
            :disabled="!canMarkAttendance"
            :title="!canMarkAttendance ? markAttendanceDisabledMessage : ''"
            class="px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      'bg-green-100 text-green-800':
                        record?.present &&
                        record?.status !== 'LATE' &&
                        record?.status !== 'EARLY_LEAVE',
                      'bg-amber-100 text-amber-800':
                        record?.status === 'LATE' ||
                        record?.status === 'EARLY_LEAVE',
                      'bg-red-100 text-red-800': !record?.present,
                    }"
                  >
                    {{
                      record?.status
                        ? formatAttendanceStatus(record.status)
                        : record?.present
                          ? "Present"
                          : "Absent"
                    }}
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
        :totalPages="attendanceStore.totalPages"
        @update:page="handlePageChange"
      />
    </div>

    <!-- Mark Attendance Mode -->
    <div v-else>
      <div
        class="mb-4 inline-flex rounded-lg border border-gray-200 bg-white p-1"
      >
        <button
          class="px-4 py-2 text-sm font-medium rounded-md transition"
          :class="
            attendanceEntryMode === 'manual'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:text-indigo-600'
          "
          @click="setAttendanceEntryMode('manual')"
        >
          Manual
        </button>
        <button
          class="px-4 py-2 text-sm font-medium rounded-md transition"
          :class="
            attendanceEntryMode === 'scan'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:text-indigo-600'
          "
          @click="setAttendanceEntryMode('scan')"
        >
          Scan ID
        </button>
        <button
          class="px-4 py-2 text-sm font-medium rounded-md transition"
          :class="
            attendanceEntryMode === 'session'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:text-indigo-600'
          "
          @click="setAttendanceEntryMode('session')"
        >
          Session QR
        </button>
        <button
          class="px-4 py-2 text-sm font-medium rounded-md transition"
          :class="
            attendanceEntryMode === 'speed'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:text-indigo-600'
          "
          @click="setAttendanceEntryMode('speed')"
        >
          Speed
        </button>
      </div>

      <!-- Class and date selectors -->
      <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <CustomDropdown
            v-if="showClassSelect"
            v-model="selectedClass"
            label="Select Class"
            :options="
              accessibleClasses.map((cls) => ({
                value: cls.id,
                label: cls.name,
              }))
            "
            placeholder="Select a class"
          />
          <div v-else>
            <label
              class="block text-sm text-gray-600 mb-1 focus:outline-none focus:ring-0 focus:border-eduPurple cursor-pointer"
              >Class</label
            >
            <div class="border rounded p-2 w-full bg-gray-50 text-gray-700">
              {{ accessibleClasses[0]?.name || "" }}
            </div>
          </div>
        </div>

        <div>
          <CustomDropdown
            v-model="selectedLesson"
            label="Select Lesson"
            :options="
              filteredLessons.map((lesson) => ({
                value: lesson.id,
                label: lesson.name,
              }))
            "
            placeholder="Select a lesson"
            :disabled="!selectedClass"
          />
        </div>

        <div>
          <label
            for="date"
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

      <div v-if="selectedClass && selectedLesson && selectedDate">
        <div
          v-if="attendanceEntryMode === 'session'"
          class="rounded-lg border border-gray-200 bg-white p-4"
        >
          <div
            class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h3 class="text-sm font-semibold text-gray-800">
                Attendance Session QR
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                Students scan this QR to check in. The session token expires
                quickly and rotates automatically.
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                v-if="!sessionActive"
                class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                @click="startAttendanceSession"
              >
                Start session
              </button>
              <button
                v-else
                class="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                @click="stopAttendanceSession"
              >
                Stop
              </button>
            </div>
          </div>

          <div
            v-if="sessionError"
            class="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {{ sessionError }}
          </div>

          <div class="mt-5 grid gap-4 lg:grid-cols-2">
            <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div class="flex items-center justify-between">
                <div class="text-sm font-medium text-gray-700">Live QR</div>
                <div class="text-xs text-gray-500">
                  Expires in {{ sessionSecondsRemaining }}s
                </div>
              </div>
              <div class="mt-4 flex items-center justify-center">
                <div class="rounded-xl border border-gray-200 bg-white p-3">
                  <img
                    v-if="sessionQrUrl"
                    :src="sessionQrUrl"
                    alt="Attendance session QR"
                    class="h-48 w-48"
                  />
                  <div
                    v-else
                    class="flex h-48 w-48 items-center justify-center text-sm text-gray-500"
                  >
                    Start a session to generate a QR
                  </div>
                </div>
              </div>
              <div class="mt-4 text-center text-xs text-gray-500">
                Rotate interval: {{ sessionRotateSeconds }}s
              </div>
            </div>

            <div class="rounded-lg border border-gray-200 bg-white p-4">
              <div class="text-sm font-semibold text-gray-700">Fallback</div>
              <div class="mt-2 text-sm text-gray-500">
                If scanning fails, students can paste the payload in their
                check-in screen.
              </div>
              <div class="mt-4 rounded-lg bg-gray-50 p-3">
                <div class="font-mono text-[11px] text-gray-700 break-all">
                  {{ sessionQrPayload || "-" }}
                </div>
              </div>
              <div class="mt-3 flex gap-2">
                <button
                  class="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="!sessionQrPayload"
                  @click="copySessionPayload"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else-if="attendanceEntryMode === 'scan'"
          class="grid gap-4 lg:grid-cols-2"
        >
          <div class="rounded-lg border border-gray-200 bg-white p-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-gray-700">Camera</h3>
              <div class="flex gap-2">
                <button
                  v-if="!isScanning"
                  class="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
                  @click="startQrScan"
                >
                  Start scan
                </button>
                <button
                  v-else
                  class="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
                  @click="stopQrScan"
                >
                  Stop
                </button>
              </div>
            </div>

            <div
              v-if="cameraError"
              class="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {{ cameraError }}
            </div>

            <div class="mt-4 overflow-hidden rounded-lg bg-black">
              <video
                ref="videoEl"
                class="h-72 w-full object-cover"
                autoplay
                playsinline
                muted
              ></video>
            </div>

            <div class="mt-4 flex gap-2">
              <input
                v-model="manualStudentId"
                placeholder="Or paste Student ID"
                class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="!manualStudentId || actionLoadingId"
                @click="submitScannedStudentId(manualStudentId)"
              >
                Mark
              </button>
            </div>
          </div>

          <div class="rounded-lg border border-gray-200 bg-white p-4">
            <h3 class="text-sm font-semibold text-gray-700">Scanned</h3>
            <div
              v-if="!scannedStudents.length"
              class="mt-4 text-sm text-gray-500"
            >
              No scans yet.
            </div>
            <div v-else class="mt-4 space-y-2">
              <div
                v-for="student in scannedStudents"
                :key="student.id"
                class="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2"
              >
                <div class="min-w-0">
                  <div class="text-sm font-medium text-gray-800 truncate">
                    {{ student.name }} {{ student.surname }}
                  </div>
                  <div class="text-xs text-gray-500 truncate">
                    {{ student.id }}
                  </div>
                </div>
                <span
                  class="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                >
                  Present
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Student list for marking attendance -->
        <div v-else>
          <div class="mb-4">
            <input
              v-model="studentSearchQuery"
              placeholder="Search students..."
              class="border rounded p-2 w-full focus:outline-none focus:ring-0 focus:border-eduPurple cursor-pointer"
            />
          </div>

          <div v-if="attendanceEntryMode === 'speed'" class="mb-4 flex gap-2">
            <button
              class="rounded-md bg-green-100 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-200"
              @click="markAllPresent"
            >
              Mark all present
            </button>
            <button
              class="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              @click="clearAllMarks"
            >
              Clear
            </button>
          </div>

          <div class="overflow-x-auto">
            <div
              v-if="loadingStudents"
              class="flex items-center justify-center gap-2 py-10 text-sm text-gray-600"
            >
              <span
                class="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-500"
              ></span>
              Loading students...
            </div>
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
                    v-if="attendanceEntryMode === 'speed'"
                    class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reason
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
                          studentAttendance[student.id] === 'PRESENT',
                        'bg-amber-100 text-amber-700':
                          studentAttendance[student.id] === 'LATE' ||
                          studentAttendance[student.id] === 'EARLY_LEAVE',
                        'bg-red-100 text-red-700':
                          studentAttendance[student.id] === 'ABSENT',
                        'bg-gray-100 text-gray-600':
                          studentAttendance[student.id] === undefined,
                      }"
                    >
                      {{
                        studentAttendance[student.id] === undefined
                          ? "Not marked"
                          : formatAttendanceStatus(
                              studentAttendance[student.id],
                            )
                      }}
                    </span>
                  </td>
                  <td
                    v-if="attendanceEntryMode === 'speed'"
                    class="py-2 px-3 text-sm"
                  >
                    <div class="flex gap-2">
                      <select
                        v-if="
                          studentAttendance[student.id] === 'ABSENT' ||
                          studentAttendance[student.id] === 'LATE' ||
                          studentAttendance[student.id] === 'EARLY_LEAVE'
                        "
                        v-model="studentAttendanceReason[student.id]"
                        class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="">Select reason (optional)</option>
                        <option value="Sick">Sick</option>
                        <option value="Family emergency">
                          Family emergency
                        </option>
                        <option value="Transport issue">Transport issue</option>
                        <option value="Permission/Excused">
                          Permission/Excused
                        </option>
                        <option value="Other">Other</option>
                      </select>
                      <input
                        v-if="
                          (studentAttendance[student.id] === 'ABSENT' ||
                            studentAttendance[student.id] === 'LATE' ||
                            studentAttendance[student.id] === 'EARLY_LEAVE') &&
                          studentAttendanceReason[student.id] === 'Other'
                        "
                        v-model="studentAttendanceReasonOther[student.id]"
                        placeholder="Reason"
                        class="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </td>
                  <td class="py-2 px-3 text-sm text-center">
                    <div class="flex justify-center gap-2">
                      <button
                        @click="setStudentStatus(student.id, 'PRESENT')"
                        class="px-2 py-1 bg-green-200 text-green-700 text-xs rounded hover:bg-green-300 transition-colors"
                        :class="{
                          'ring-1 ring-inset ring-green-600/20':
                            studentAttendance[student.id] === 'PRESENT',
                        }"
                      >
                        Present
                      </button>
                      <button
                        v-if="attendanceEntryMode === 'speed'"
                        @click="setStudentStatus(student.id, 'LATE')"
                        class="px-2 py-1 bg-amber-200 text-amber-800 text-xs rounded hover:bg-amber-300 transition-colors"
                        :class="{
                          'ring-1 ring-inset ring-amber-600/20':
                            studentAttendance[student.id] === 'LATE',
                        }"
                      >
                        Late
                      </button>
                      <button
                        v-if="attendanceEntryMode === 'speed'"
                        @click="setStudentStatus(student.id, 'EARLY_LEAVE')"
                        class="px-2 py-1 bg-amber-200 text-amber-800 text-xs rounded hover:bg-amber-300 transition-colors"
                        :class="{
                          'ring-1 ring-inset ring-amber-600/20':
                            studentAttendance[student.id] === 'EARLY_LEAVE',
                        }"
                      >
                        Left early
                      </button>
                      <button
                        @click="setStudentStatus(student.id, 'ABSENT')"
                        class="px-2 py-1 bg-red-200 text-red-700 text-xs rounded hover:bg-red-300 transition-colors"
                        :class="{
                          'ring-1 ring-inset ring-red-600/10':
                            studentAttendance[student.id] === 'ABSENT',
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
              :totalPages="attendanceStore.totalPages"
              @update:page="handlePageChange"
            />
          </div>
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
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useAttendanceStore } from "../../store/attendanceStore";
import { useClassStore } from "../../store/classStore";
import { useLessonStore } from "../../store/lessonStore";
import { useNotificationStore } from "../../store/notification";
import { useParentLinkedStudents } from "../../composables/useParentLinkedStudents";
import { useStudentStore } from "../../store/studentStore";
import { useUserStore } from "../../store/userStore";
import { formatDate } from "../../utils/date.holidays";
import { apolloClient } from "../../../apollo-client";
import { createAttendanceSession } from "../../graphql/mutations";
import CustomDropdown from "../dropdowns/customDropdown.vue";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import Pagination from "../pagination.vue";

const userStore = useUserStore();
const studentStore = useStudentStore();
const attendanceStore = useAttendanceStore();
const classStore = useClassStore();
const lessonStore = useLessonStore();
const notificationStore = useNotificationStore();
const { isParent, selectedStudentId } = useParentLinkedStudents();

const userRole = computed(() => userStore.currentRole);
const userHasAccess = computed(() => ["teacher"].includes(userRole.value));
const isTeacher = computed(
  () => String(userRole.value || "").toLowerCase() === "teacher",
);

// Regular attendance view
const limit = 10;
const searchQuery = ref("");
const filterStatus = ref("all");
const currentPage = ref(1);
const pageSize = 10;

// Mark attendance mode
const markAttendanceMode = ref(false);
const attendanceEntryMode = ref("manual");
const selectedClass = ref("");
const selectedLesson = ref("");
const selectedDate = ref(new Date().toISOString().split("T")[0]); // Today's date
const studentSearchQuery = ref("");
const studentAttendance = ref({});
const studentAttendanceReason = ref({});
const studentAttendanceReasonOther = ref({});
const loadingStudents = ref(false);
const actionLoadingId = ref("");
const videoEl = ref(null);
const isScanning = ref(false);
const cameraError = ref("");
const manualStudentId = ref("");
const scannedIds = ref(new Set());
const sessionActive = ref(false);
const sessionQrPayload = ref("");
const sessionExpiresAt = ref(null);
const sessionError = ref("");
const sessionSecondsRemaining = ref(0);
const sessionRotateSeconds = 20;
let sessionRefreshIntervalId = null;
let sessionTickIntervalId = null;

const error = computed(() => attendanceStore.error);
const lessons = computed(() => lessonStore.lessons);
const classes = computed(() => classStore.allClasses);
const accessibleClasses = computed(() => {
  const all = classes.value || [];
  if (!isTeacher.value) return all;
  const userId = userStore.userInfo?.id;
  if (!userId) return all;

  return all.filter((cls) => {
    if (cls?.supervisor?.id && cls.supervisor.id === userId) return true;
    const subjects = Array.isArray(cls?.subjects) ? cls.subjects : [];
    return subjects.some((subject) => {
      const teachers = Array.isArray(subject?.teachers) ? subject.teachers : [];
      return teachers.some((t) => t?.id === userId);
    });
  });
});

const showClassSelect = computed(
  () => !isTeacher.value || accessibleClasses.value.length > 1,
);

watch(
  () => accessibleClasses.value,
  (next) => {
    if (!isTeacher.value) return;
    if (!Array.isArray(next) || !next.length) return;

    const selectedIsValid = next.some((c) => c.id === selectedClass.value);
    if (!selectedIsValid) {
      selectedClass.value = next.length === 1 ? next[0].id : "";
    } else if (!selectedClass.value && next.length === 1) {
      selectedClass.value = next[0].id;
    }
  },
  { immediate: true },
);
const students = computed(() => studentStore.students);
const loading = computed(() => attendanceStore.listLoading);
const attendanceRecords = computed(() => attendanceStore.attendanceRecords);
const canMarkAttendance = computed(() => {
  if (!["teacher"].includes(userRole.value)) return false;
  if (classStore.loading) return false;
  const all = classes.value || [];
  if (!all.length) return false;
  return all.some((cls) =>
    Array.isArray(cls?.subjects)
      ? cls.subjects.some(
          (subject) =>
            Array.isArray(subject?.lessons) && subject.lessons.length,
        )
      : false,
  );
});
const markAttendanceDisabledMessage = computed(() => {
  if (classStore.loading) return "Loading classes...";
  return "No class assigned yet";
});

// Add computed property for filtered records
const filteredRecords = computed(() => {
  let records = attendanceStore.attendanceRecords;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    records = records.filter(
      (record) =>
        record?.student?.name?.toLowerCase().includes(query) ||
        record?.student?.surname?.toLowerCase().includes(query) ||
        record?.class?.name?.toLowerCase().includes(query) ||
        record?.lesson?.name?.toLowerCase().includes(query),
    );
  }

  // Apply status filter
  if (filterStatus.value !== "all") {
    records = records.filter((record) =>
      filterStatus.value === "present" ? record.present : !record.present,
    );
  }

  return records;
});

// Update paginatedRecords computed
const paginatedRecords = computed(() => {
  return filteredRecords.value;
});

// Update page change handler
const handlePageChange = async (newPage) => {
  currentPage.value = newPage;
  await attendanceStore.fetchAttendance({
    page: newPage,
    limit: pageSize,
    search: searchQuery.value,
    studentId: selectedStudentId.value,
  });
};

// Get lessons for selected class
const filteredLessons = computed(() => {
  if (!selectedClass.value) return [];

  // Find the selected class in the classes array
  const currentClass = classes.value.find(
    (cls) => cls.id === selectedClass.value,
  );

  if (!currentClass || !currentClass.subjects) return [];

  // Flatten lessons from all subjects in the selected class
  return currentClass.subjects.flatMap((subject) =>
    subject.lessons.map((lesson) => ({
      ...lesson,
      subjectId: subject.id,
      subjectName: subject.name,
      classId: currentClass.id,
    })),
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
        (record.class?.name || "").toLowerCase().includes(query),
    );
  }

  if (filterStatus.value !== "all") {
    filtered = filtered.filter(
      (record) =>
        (filterStatus.value === "present" && record.present) ||
        (filterStatus.value === "absent" && !record.present),
    );
  }

  return filtered;
});

// Filter students for the mark attendance view
const filteredStudents = computed(() => {
  if (!selectedClass.value) return [];

  // Find the class object in class store that matches the selected class ID
  const classObj = classStore.allClasses.find(
    (cls) => cls.id === selectedClass.value,
  );

  // Return the students from that class if available
  return classObj && classObj.students ? classObj.students : [];
});

const scannedStudents = computed(() => {
  if (!scannedIds.value.size) return [];
  const ids = Array.from(scannedIds.value);
  return ids
    .map((id) => filteredStudents.value.find((student) => student.id === id))
    .filter(Boolean);
});

const setAttendanceEntryMode = (mode) => {
  attendanceEntryMode.value = mode;
  if (mode !== "scan") {
    stopQrScan();
  }
  if (mode !== "session") {
    stopAttendanceSession();
  }
};

let mediaStream = null;
let scanRafId = null;
let barcodeDetector = null;

const startQrScan = async () => {
  cameraError.value = "";
  if (!selectedLesson.value || !selectedDate.value) return;

  if (!("BarcodeDetector" in globalThis)) {
    cameraError.value =
      "QR scanning is not supported in this browser. Use Chrome/Edge or paste the Student ID to mark attendance.";
    return;
  }

  try {
    barcodeDetector = new globalThis.BarcodeDetector({ formats: ["qr_code"] });
  } catch (e) {
    console.warn(e);
    cameraError.value =
      "Unable to initialize QR scanning. Use Chrome/Edge or paste the Student ID to mark attendance.";
    return;
  }

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });

    if (videoEl.value) {
      videoEl.value.srcObject = mediaStream;
      await videoEl.value.play();
    }

    isScanning.value = true;
    scanLoop();
  } catch (e) {
    console.warn(e);
    cameraError.value =
      "Camera access was blocked or is unavailable. Allow camera permission, or paste the Student ID.";
    stopQrScan();
  }
};

const stopQrScan = () => {
  isScanning.value = false;

  if (scanRafId) {
    cancelAnimationFrame(scanRafId);
    scanRafId = null;
  }

  if (videoEl.value) {
    videoEl.value.pause?.();
    videoEl.value.srcObject = null;
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach((t) => t.stop());
    mediaStream = null;
  }
};

const sessionQrUrl = computed(() => {
  if (!sessionQrPayload.value) return "";
  const size = "260x260";
  const data = encodeURIComponent(sessionQrPayload.value);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${data}`;
});

const updateSessionRemaining = () => {
  if (!sessionExpiresAt.value) {
    sessionSecondsRemaining.value = 0;
    return;
  }
  const ms = new Date(sessionExpiresAt.value).getTime() - Date.now();
  sessionSecondsRemaining.value = Math.max(0, Math.floor(ms / 1000));
};

const refreshSessionToken = async () => {
  sessionError.value = "";
  if (!selectedLesson.value || !selectedDate.value) return;

  try {
    const { data } = await apolloClient.mutate({
      mutation: createAttendanceSession,
      variables: {
        lessonId: selectedLesson.value,
        date: new Date(selectedDate.value),
      },
      fetchPolicy: "no-cache",
    });

    sessionQrPayload.value = data?.createAttendanceSession?.qrPayload || "";
    sessionExpiresAt.value = data?.createAttendanceSession?.expiresAt || null;
    updateSessionRemaining();
  } catch (e) {
    sessionError.value = "Unable to create attendance session.";
    stopAttendanceSession();
  }
};

const startAttendanceSession = async () => {
  sessionActive.value = true;
  await refreshSessionToken();

  if (!sessionQrPayload.value) {
    sessionActive.value = false;
    return;
  }

  clearInterval(sessionRefreshIntervalId);
  clearInterval(sessionTickIntervalId);

  sessionRefreshIntervalId = setInterval(
    refreshSessionToken,
    sessionRotateSeconds * 1000,
  );

  sessionTickIntervalId = setInterval(updateSessionRemaining, 250);
};

const stopAttendanceSession = () => {
  sessionActive.value = false;
  sessionQrPayload.value = "";
  sessionExpiresAt.value = null;
  sessionError.value = "";
  sessionSecondsRemaining.value = 0;

  if (sessionRefreshIntervalId) {
    clearInterval(sessionRefreshIntervalId);
    sessionRefreshIntervalId = null;
  }
  if (sessionTickIntervalId) {
    clearInterval(sessionTickIntervalId);
    sessionTickIntervalId = null;
  }
};

const copySessionPayload = async () => {
  if (!sessionQrPayload.value) return;
  try {
    await navigator.clipboard.writeText(sessionQrPayload.value);
    notificationStore.addNotification({
      type: "success",
      message: "Copied session payload.",
    });
  } catch (e) {
    notificationStore.addNotification({
      type: "error",
      message: "Unable to copy.",
    });
  }
};

const scanLoop = async () => {
  if (!isScanning.value || !videoEl.value || !barcodeDetector) return;

  try {
    const barcodes = await barcodeDetector.detect(videoEl.value);
    if (Array.isArray(barcodes) && barcodes.length) {
      const rawValue = String(barcodes[0].rawValue || "").trim();
      if (rawValue) {
        await submitScannedStudentId(rawValue);
      }
    }
  } catch (e) {
    cameraError.value =
      "Scanning failed. Try again or paste the Student ID to mark attendance.";
    stopQrScan();
    return;
  }

  scanRafId = requestAnimationFrame(scanLoop);
};

const submitScannedStudentId = async (studentIdValue) => {
  const raw = String(studentIdValue || "").trim();
  if (!raw) return;

  const studentId = raw.startsWith("school:v1:user:")
    ? raw.replace("school:v1:user:", "").trim()
    : raw;

  if (!studentId) return;
  if (scannedIds.value.has(studentId)) return;
  if (!selectedLesson.value || !selectedDate.value) return;

  actionLoadingId.value = studentId;
  try {
    await attendanceStore.markAttendance(selectedLesson.value, {
      studentId,
      present: true,
      date: selectedDate.value,
    });

    const next = new Set(scannedIds.value);
    next.add(studentId);
    scannedIds.value = next;
    manualStudentId.value = "";
  } catch (e) {
    notificationStore.addNotification({
      type: "error",
      message: "Unable to mark attendance from scan.",
    });
  } finally {
    actionLoadingId.value = "";
  }
};

// Toggle mark attendance mode
function toggleMarkAttendanceMode() {
  if (!markAttendanceMode.value && !canMarkAttendance.value) {
    notificationStore.addNotification({
      type: "error",
      message: markAttendanceDisabledMessage.value,
    });
    return;
  }
  markAttendanceMode.value = !markAttendanceMode.value;

  if (markAttendanceMode.value) {
    // Reset the form when entering mark attendance mode
    attendanceEntryMode.value = "manual";
    selectedClass.value = "";
    selectedLesson.value = "";
    selectedDate.value = new Date().toISOString().split("T")[0];
    studentAttendance.value = {};
    studentAttendanceReason.value = {};
    studentAttendanceReasonOther.value = {};
    scannedIds.value = new Set();
    manualStudentId.value = "";
    stopAttendanceSession();

    // Fetch classes and lessons if not already loaded
    if (classes.value.length === 0) {
      classStore.fetchClasses();
    }
    if (lessons.value.length === 0) {
      lessonStore.fetchLessons();
    }
  } else {
    stopQrScan();
    stopAttendanceSession();
  }
}

const handleOnline = async () => {
  const result = await attendanceStore.flushPendingAttendance();
  if (result?.flushed) {
    notificationStore.addNotification({
      type: "success",
      message: "Offline attendance synced.",
    });
  }
};

onUnmounted(() => {
  stopQrScan();
  stopAttendanceSession();
  window.removeEventListener("online", handleOnline);
});

// Initialize attendance object for all applicable students
function initializeStudentAttendance() {
  if (!selectedLesson.value) return;

  studentAttendance.value = {};
  studentAttendanceReason.value = {};
  studentAttendanceReasonOther.value = {};

  // Get students who should be marked for this lesson
  const relevantStudents = filteredStudents.value;

  // Initialize attendance state for each student
  relevantStudents.forEach((student) => {
    studentAttendance.value[student.id] = undefined;
    studentAttendanceReason.value[student.id] = "";
    studentAttendanceReasonOther.value[student.id] = "";
  });
}

const formatAttendanceStatus = (status) => {
  if (status === "PRESENT") return "Present";
  if (status === "ABSENT") return "Absent";
  if (status === "LATE") return "Late";
  if (status === "EARLY_LEAVE") return "Left early";
  return String(status || "");
};

const setStudentStatus = (studentId, status) => {
  const nextStatus = String(status || "")
    .trim()
    .toUpperCase();
  if (!nextStatus) {
    studentAttendance.value[studentId] = undefined;
    studentAttendanceReason.value[studentId] = "";
    studentAttendanceReasonOther.value[studentId] = "";
    return;
  }
  studentAttendance.value[studentId] = nextStatus;
  if (nextStatus === "PRESENT") {
    studentAttendanceReason.value[studentId] = "";
    studentAttendanceReasonOther.value[studentId] = "";
  }
};

const markAllPresent = () => {
  filteredStudents.value.forEach((student) => {
    setStudentStatus(student.id, "PRESENT");
  });
};

const clearAllMarks = () => {
  Object.keys(studentAttendance.value || {}).forEach((studentId) => {
    setStudentStatus(studentId, "");
  });
};

// Save attendance changes
async function saveAttendance() {
  if (!selectedClass.value || !selectedLesson.value || !selectedDate.value) {
    notificationStore.addNotification({
      type: "error",
      message: `Please select a class, lesson, and date`,
    });
    return;
  }

  // Check if all students have attendance marked
  const unmarkedStudents = Object.entries(studentAttendance.value).filter(
    ([_, status]) => status === undefined,
  ).length;

  if (
    unmarkedStudents > 0 &&
    !confirm(
      `${unmarkedStudents} students have not been marked. Continue anyway?`,
    )
  ) {
    return;
  }

  try {
    const attendanceData = Object.entries(studentAttendance.value)
      .filter(([_, status]) => status !== undefined)
      .map(([studentId, status]) => {
        const normalized = String(status || "")
          .trim()
          .toUpperCase();
        const present = normalized === "ABSENT" ? false : true;
        const reasonSelection =
          studentAttendanceReason.value?.[studentId] || "";
        const otherText = studentAttendanceReasonOther.value?.[studentId] || "";
        const reason =
          reasonSelection === "Other"
            ? String(otherText || "").trim()
            : String(reasonSelection || "").trim();
        return {
          studentId,
          present,
          status: normalized,
          reason: reason || null,
          date: selectedDate.value,
        };
      });

    const result = await attendanceStore.markAttendanceBulk(
      selectedLesson.value,
      attendanceData,
    );

    // Reset form and exit mark attendance mode
    markAttendanceMode.value = false;

    await attendanceStore.fetchAttendance({
      studentId: selectedStudentId.value,
    });

    notificationStore.addNotification({
      type: "success",
      message: result?.queued
        ? "Saved offline. Attendance will sync when you're back online."
        : "Attendance saved.",
    });
  } catch (err) {
    attendanceStore.error = "Failed to save attendance";
  } finally {
  }
}

// Add watcher for search and filter changes
watch([searchQuery, filterStatus], () => {
  currentPage.value = 1; // Reset to first page
  handlePageChange(1);
});

// Reset lesson when class changes
watch(selectedClass, () => {
  selectedLesson.value = "";
  studentAttendance.value = {};
  studentAttendanceReason.value = {};
  studentAttendanceReasonOther.value = {};
});

// Update student attendance state when lesson changes
watch(selectedLesson, () => {
  if (selectedLesson.value && students.value.length > 0) {
    initializeStudentAttendance();
  } else {
    studentAttendance.value = {};
    studentAttendanceReason.value = {};
    studentAttendanceReasonOther.value = {};
  }
});

// Initialize data on component mount
onMounted(async () => {
  // Fetch classes and lessons
  if (userHasAccess.value) {
    await classStore.fetchClasses();
    lessonStore.fetchLessons();
  }

  window.addEventListener("online", handleOnline);
  await handleOnline();
});

watch(selectedStudentId, async (studentId) => {
  if (!isParent.value || !studentId) return;
  currentPage.value = 1;
  await attendanceStore.fetchAttendance({
    page: 1,
    limit: pageSize,
    search: searchQuery.value,
    studentId,
  });
});
</script>
