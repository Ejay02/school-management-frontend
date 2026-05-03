<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <!-- Header with date range and filters -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-3 md:mb-0">
          {{ pageTitle }}
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

      <div v-if="isParent && hasLinkedStudents" class="mb-6">
        <ParentChildSelector />
      </div>

      <!-- Loading and error states -->
      <LoadingScreen
        v-if="(isParent && !parentCheckLoaded) || parentCheckLoading || loading"
        message="Loading attendance data ..."
      />
      <ParentLinkedStudentEmptyState
        v-else-if="shouldShowParentLinkEmptyState"
        description="There’s nothing to show here yet. Once the school links your child to this parent account, this page will start showing their attendance."
      />
      <ErrorScreen v-else-if="error" message="" />

      <!-- Main content - Cards and charts -->
      <div v-else>
        <div
          v-if="isStudent"
          class="mb-6 rounded-lg border border-gray-200 bg-white p-4"
        >
          <div
            class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div class="text-sm font-semibold text-gray-800">
                Check in with Session QR
              </div>
              <div class="mt-1 text-sm text-gray-500">
                Scan the classroom QR to mark yourself present.
              </div>
            </div>
            <div class="flex gap-2">
              <button
                v-if="!isCheckInScanning"
                class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                @click="startCheckInScan"
              >
                Start scan
              </button>
              <button
                v-else
                class="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                @click="stopCheckInScan"
              >
                Stop
              </button>
            </div>
          </div>

          <div
            v-if="checkInError"
            class="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {{ checkInError }}
          </div>

          <div
            v-if="checkInSuccess"
            class="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700"
          >
            Checked in successfully.
          </div>

          <div class="mt-4 overflow-hidden rounded-lg bg-black">
            <video
              ref="checkInVideoEl"
              class="h-56 w-full object-cover"
              autoplay
              playsinline
              muted
            ></video>
          </div>

          <div class="mt-3 text-xs text-gray-500">
            Works best on Chrome/Edge. If your camera is blocked, allow
            permission and retry.
          </div>
        </div>

        <!-- Stats overview cards -->
        <AttendanceStatsOverviewCard :stats="stats" />

        <!-- Weekly attendance chart -->
        <div class="bg-white rounded-lg shadow border border-gray-200 mb-6">
          <div class="">
            <AttendanceCard
              label="Weekly Attendance Overview"
              :showSummary="true"
            />
          </div>
        </div>

        <!-- Mark attendance | list -->
        <AttendanceTable class="shadow" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useParentLinkedStudents } from "../../composables/useParentLinkedStudents";
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
import ParentChildSelector from "../parents/parentChildSelector.vue";
import ParentLinkedStudentEmptyState from "../parents/parentLinkedStudentEmptyState.vue";
import { useUserStore } from "../../store/userStore";
import { apolloClient } from "../../../apollo-client";
import { checkInAttendance } from "../../graphql/mutations";
import { useNotificationStore } from "../../store/notification";

const attendanceStore = useAttendanceStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const {
  isParent,
  loaded: parentCheckLoaded,
  loading: parentCheckLoading,
  fetchLinkedStudents,
  hasLinkedStudents,
  selectedStudentId,
  selectedStudentName,
  shouldShowParentLinkEmptyState,
} = useParentLinkedStudents();

const loading = computed(() => attendanceStore.loading);
const error = computed(() => attendanceStore.error);
const stats = computed(() => attendanceStore.stats);
const pageTitle = computed(() =>
  userStore.currentRole?.toLowerCase() === "parent"
    ? `${parentLabel.value}'s Attendance`
    : "Attendance Dashboard",
);
const parentLabel = computed(() => selectedStudentName.value || "My Child");

const startDate = ref(formatDateForInput(getMonday(new Date())));
const endDate = ref(formatDateForInput(getFriday(new Date())));

const isStudent = computed(
  () => userStore.currentRole?.toLowerCase() === "student",
);

const checkInVideoEl = ref(null);
const isCheckInScanning = ref(false);
const checkInError = ref("");
const checkInSuccess = ref(false);
let checkInMediaStream = null;
let checkInRafId = null;
let checkInBarcodeDetector = null;
let checkInSubmitting = false;

const startCheckInScan = async () => {
  checkInError.value = "";
  checkInSuccess.value = false;

  if (!("BarcodeDetector" in window)) {
    checkInError.value =
      "QR scanning is not supported in this browser. Use Chrome/Edge.";
    return;
  }

  try {
    checkInBarcodeDetector = new window.BarcodeDetector({
      formats: ["qr_code"],
    });
  } catch (e) {
    checkInError.value = "Unable to initialize QR scanning.";
    return;
  }

  try {
    checkInMediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });

    if (checkInVideoEl.value) {
      checkInVideoEl.value.srcObject = checkInMediaStream;
      await checkInVideoEl.value.play();
    }

    isCheckInScanning.value = true;
    checkInLoop();
  } catch (e) {
    checkInError.value =
      "Camera access was blocked or is unavailable. Allow camera permission and retry.";
    stopCheckInScan();
  }
};

const stopCheckInScan = () => {
  isCheckInScanning.value = false;
  checkInSubmitting = false;

  if (checkInRafId) {
    cancelAnimationFrame(checkInRafId);
    checkInRafId = null;
  }

  if (checkInVideoEl.value) {
    checkInVideoEl.value.pause?.();
    checkInVideoEl.value.srcObject = null;
  }

  if (checkInMediaStream) {
    checkInMediaStream.getTracks().forEach((t) => t.stop());
    checkInMediaStream = null;
  }
};

const checkInLoop = async () => {
  if (
    !isCheckInScanning.value ||
    !checkInVideoEl.value ||
    !checkInBarcodeDetector
  )
    return;

  try {
    const barcodes = await checkInBarcodeDetector.detect(checkInVideoEl.value);
    if (Array.isArray(barcodes) && barcodes.length && !checkInSubmitting) {
      const rawValue = String(barcodes[0].rawValue || "").trim();
      if (rawValue) {
        checkInSubmitting = true;
        await submitCheckIn(rawValue);
        checkInSubmitting = false;
      }
    }
  } catch (e) {
    checkInError.value = "Scanning failed. Try again.";
    stopCheckInScan();
    return;
  }

  checkInRafId = requestAnimationFrame(checkInLoop);
};

const submitCheckIn = async (rawValue) => {
  try {
    await apolloClient.mutate({
      mutation: checkInAttendance,
      variables: { token: rawValue },
      fetchPolicy: "no-cache",
    });

    checkInSuccess.value = true;
    notificationStore.addNotification({
      type: "success",
      message: "Checked in successfully.",
    });
    stopCheckInScan();

    await attendanceStore.fetchAttendanceData(startDate.value, endDate.value);
  } catch (e) {
    checkInError.value =
      "Unable to check in. Make sure the session QR is valid.";
    notificationStore.addNotification({
      type: "error",
      message: "Unable to check in.",
    });
  }
};

// Move function outside onMounted
const fetchAttendanceData = async () => {
  if (shouldShowParentLinkEmptyState.value) return;
  if (attendanceStore.allAttendanceRecords.length === 0) {
    await attendanceStore.fetchAttendance({
      page: 1,
      limit: 10,
      studentId: selectedStudentId.value,
    });
  }
  await attendanceStore.fetchAttendanceData(startDate.value, endDate.value);
};

onMounted(async () => {
  await fetchLinkedStudents();
  if (shouldShowParentLinkEmptyState.value) return;
  fetchAttendanceData();
});

watch([selectedStudentId, startDate, endDate], async ([studentId]) => {
  if (!studentId || shouldShowParentLinkEmptyState.value) return;
  await fetchAttendanceData();
});

onUnmounted(() => {
  stopCheckInScan();
});
</script>

<style scoped></style>
