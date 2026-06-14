<template>
  <div class="rounded border-l border-t border-b border-gray-300 p-2 w-full">
    <div class="gap-4 flex-col xl:flex-row w-full mt-1">
      <div class="">
        <div class="">
          <div class="h-full bg-white p-4 rounded-md w-full">
            <div class="mb-6">
              <h1 class="text-xl font-semibold text-gray-600">
                Family Overview
              </h1>
              <p class="mt-2 text-sm text-gray-500">
                Welcome{{ parentName ? `, ${parentName}` : "" }}. Keep track of
                your child&apos;s timetable, school updates, and upcoming items
                from one place.
              </p>
              <p
                v-if="shouldShowParentLinkEmptyState"
                class="mt-2 text-sm text-amber-700"
              >
                Your child&apos;s schedule and school activity will appear here
                once the school links them to this parent account.
              </p>
            </div>

            <div v-if="hasLinkedStudents" class="mb-4">
              <ParentChildSelector />
            </div>
            <div
              v-if="hasLinkedStudents"
              class="mb-6 grid gap-4 md:grid-cols-3 items-stretch auto-rows-fr"
            >
              <router-link to="/attendance" class="block h-full">
                <div
                  class="h-full min-h-[180px] rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50"
                >
                  <div class="flex h-full flex-col">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-gray-900">
                          Attendance today
                        </p>
                        <p class="mt-1 text-xs text-gray-500">
                          {{ attendanceSubtitle }}
                        </p>
                      </div>
                      <div
                        class="h-9 w-9 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"
                      >
                        <i class="fa-solid fa-clipboard-check"></i>
                      </div>
                    </div>

                    <div class="mt-5 min-h-[56px]">
                      <p class="text-3xl font-semibold text-gray-900">
                        {{ attendanceHeadline }}
                      </p>
                      <p class="mt-1 text-sm text-gray-600">
                        {{ attendanceDetail }}
                      </p>
                    </div>

                    <div
                      class="mt-auto pt-4 text-sm font-medium text-indigo-600"
                    >
                      View attendance
                    </div>
                  </div>
                </div>
              </router-link>

              <router-link to="/settings/billing" class="block h-full">
                <div
                  class="h-full min-h-[180px] rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50"
                >
                  <div class="flex h-full flex-col">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-gray-900">
                          Fees balance
                        </p>
                        <p class="mt-1 text-xs text-gray-500">
                          Across your parent account.
                        </p>
                      </div>
                      <div
                        class="h-9 w-9 shrink-0 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"
                      >
                        <i class="fa-solid fa-file-invoice-dollar"></i>
                      </div>
                    </div>

                    <div class="mt-5 min-h-[56px]">
                      <p class="text-3xl font-semibold text-gray-900">
                        {{ feesHeadline }}
                      </p>
                      <p class="mt-1 text-sm text-gray-600">
                        {{ feesDetail }}
                      </p>
                    </div>

                    <div
                      class="mt-auto pt-4 text-sm font-medium text-indigo-600"
                    >
                      View billing
                    </div>
                  </div>
                </div>
              </router-link>

              <router-link to="/lessons" class="block h-full">
                <div
                  class="h-full min-h-[180px] rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50"
                >
                  <div class="flex h-full flex-col">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-gray-900">
                          Today's timetable
                        </p>
                        <p class="mt-1 text-xs text-gray-500">
                          {{ timetableSubtitle }}
                        </p>
                      </div>
                      <div
                        class="h-9 w-9 shrink-0 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"
                      >
                        <i class="fa-regular fa-clock"></i>
                      </div>
                    </div>

                    <div class="mt-5 min-h-[56px]">
                      <p
                        v-if="nextTimetableTitle"
                        class="text-base font-semibold text-gray-800 truncate"
                      >
                        {{ nextTimetableTitle }}
                      </p>
                      <p
                        v-if="nextTimetableTime"
                        class="mt-1 text-sm font-medium text-indigo-600"
                      >
                        {{ nextTimetableTime }}
                      </p>
                      <p
                        v-if="!nextTimetableTitle"
                        class="text-sm text-gray-600"
                      >
                        {{ timetableEmptyLabel }}
                      </p>
                    </div>

                    <div
                      v-if="moreTimetableEntries.length"
                      class="mt-3 space-y-2"
                    >
                      <div
                        v-for="entry in moreTimetableEntries"
                        :key="entry.id"
                        class="flex items-center justify-between gap-3"
                      >
                        <div class="min-w-0 text-xs text-gray-600 truncate">
                          {{ entry.subjectName || entry.name }}
                          <span v-if="entry.className" class="text-gray-400">
                            • {{ entry.className }}
                          </span>
                        </div>
                        <div class="shrink-0 text-xs text-gray-500">
                          {{ entry.startTime }} - {{ entry.endTime }}
                        </div>
                      </div>
                    </div>

                    <div
                      class="mt-auto pt-4 text-sm font-medium text-indigo-600"
                    >
                      View lessons
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
            <h2
              v-if="hasLinkedStudents"
              class="text-xl font-semibold mb-4 mt-8 text-gray-500"
            >
              Schedule
            </h2>
            <div class="flex-col w-full">
              <PlannerCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { apolloClient } from "../../../apollo-client";
import { useParentLinkedStudents } from "../../composables/useParentLinkedStudents";
import {
  getAllLessons,
  getAttendances,
  getMyInvoices,
} from "../../graphql/queries";
import { useUserStore } from "../../store/userStore";
import { formatNamePart } from "../../utils/displayValue";
import PlannerCard from "../../components/cards/plannerCard.vue";
import ParentChildSelector from "../../components/parents/parentChildSelector.vue";

const userStore = useUserStore();
const {
  fetchLinkedStudents,
  hasLinkedStudents,
  selectedStudent,
  selectedStudentId,
  selectedStudentName,
  shouldShowParentLinkEmptyState,
} = useParentLinkedStudents();

const parentName = computed(() => formatNamePart(userStore.userInfo?.name));
const attendanceRecords = ref([]);
const lessons = ref([]);
const invoices = ref([]);
const attendanceLoading = ref(false);
const lessonsLoading = ref(false);
const invoicesLoading = ref(false);
let overviewRequestId = 0;

const weekdayIndexByName = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const splitScheduleValue = (value) =>
  String(value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

const parseTimeToMinutes = (value) => {
  const [hours, minutes] = String(value || "").split(":");
  const parsedHours = Number(hours);
  const parsedMinutes = Number(minutes);

  if (!Number.isFinite(parsedHours) || !Number.isFinite(parsedMinutes)) {
    return Number.MAX_SAFE_INTEGER;
  }

  return parsedHours * 60 + parsedMinutes;
};

const isSameDay = (value, targetDate) => {
  const date = new Date(value);
  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === targetDate.getFullYear() &&
    date.getMonth() === targetDate.getMonth() &&
    date.getDate() === targetDate.getDate()
  );
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(amount || 0));

const buildTodayTimetableEntries = (lessonItems) => {
  const today = new Date();
  const todayIndex = today.getDay();

  return (Array.isArray(lessonItems) ? lessonItems : [])
    .flatMap((lesson) => {
      const days = splitScheduleValue(lesson?.day);
      const startTimes = splitScheduleValue(lesson?.startTime);
      const endTimes = splitScheduleValue(lesson?.endTime);
      const slots = Math.min(days.length, startTimes.length, endTimes.length);

      return Array.from({ length: slots }, (_, index) => {
        const dayIndex =
          weekdayIndexByName[String(days[index] || "").toLowerCase()];

        if (dayIndex !== todayIndex) return null;

        return {
          id: `${lesson.id}-${index}`,
          name: lesson?.name || "",
          className: lesson?.class?.name || "",
          subjectName: lesson?.subject?.name || "",
          startTime: startTimes[index],
          endTime: endTimes[index],
        };
      }).filter(Boolean);
    })
    .sort((left, right) => {
      return (
        parseTimeToMinutes(left.startTime) - parseTimeToMinutes(right.startTime)
      );
    });
};

const fetchInvoiceSummary = async () => {
  invoicesLoading.value = true;

  try {
    const { data } = await apolloClient.query({
      query: getMyInvoices,
      variables: { params: { page: 1, limit: 1000 } },
      fetchPolicy: "network-only",
    });

    invoices.value = Array.isArray(data?.getMyInvoices)
      ? data.getMyInvoices
      : [];
  } catch (error) {
    invoices.value = [];
  } finally {
    invoicesLoading.value = false;
  }
};

const fetchSelectedStudentOverview = async () => {
  if (!selectedStudentId.value) {
    attendanceRecords.value = [];
    lessons.value = [];
    return;
  }

  const requestId = ++overviewRequestId;
  attendanceLoading.value = true;
  lessonsLoading.value = true;

  try {
    const [attendanceResult, lessonResult] = await Promise.all([
      apolloClient.query({
        query: getAttendances,
        variables: { studentId: selectedStudentId.value },
        fetchPolicy: "network-only",
      }),
      apolloClient.query({
        query: getAllLessons,
        variables: {
          pagination: { page: 1, limit: 1000 },
          studentId: selectedStudentId.value,
        },
        fetchPolicy: "network-only",
      }),
    ]);

    if (requestId !== overviewRequestId) return;

    attendanceRecords.value = Array.isArray(
      attendanceResult?.data?.getAttendances,
    )
      ? attendanceResult.data.getAttendances
      : [];
    lessons.value = Array.isArray(lessonResult?.data?.getAllLessons)
      ? lessonResult.data.getAllLessons
      : [];
  } catch (error) {
    if (requestId !== overviewRequestId) return;
    attendanceRecords.value = [];
    lessons.value = [];
  } finally {
    if (requestId === overviewRequestId) {
      attendanceLoading.value = false;
      lessonsLoading.value = false;
    }
  }
};

const todayTimetableEntries = computed(() =>
  buildTodayTimetableEntries(lessons.value),
);

const todayAttendanceRecords = computed(() => {
  const today = new Date();
  return attendanceRecords.value.filter((attendance) =>
    isSameDay(attendance?.date, today),
  );
});

const attendanceHeadline = computed(() => {
  if (attendanceLoading.value) return "Loading...";
  const total = todayAttendanceRecords.value.length;
  if (!total) return "0";
  const presentCount = todayAttendanceRecords.value.filter(
    (attendance) => attendance?.present,
  ).length;
  return `${presentCount}/${total}`;
});

const attendanceSubtitle = computed(() => {
  if (attendanceLoading.value) return "Loading today's attendance.";
  const studentName = selectedStudentName.value || "your child";
  return `Marked attendance for ${studentName}.`;
});

const attendanceDetail = computed(() => {
  if (attendanceLoading.value) return "Fetching today's attendance records.";
  const total = todayAttendanceRecords.value.length;
  const lessonsToday = todayTimetableEntries.value.length;
  if (!lessonsToday) return "No classes are scheduled for today.";
  if (!total) return "No attendance has been marked yet today.";
  const absentCount = todayAttendanceRecords.value.filter(
    (attendance) => !attendance?.present,
  ).length;
  if (!absentCount) return "All marked classes show present.";
  return `${absentCount} marked class${absentCount === 1 ? "" : "es"} absent today.`;
});

const outstandingInvoices = computed(() =>
  invoices.value.filter(
    (invoice) =>
      Number(invoice?.totalAmount || 0) > Number(invoice?.paidAmount || 0),
  ),
);

const feesHeadline = computed(() => {
  if (invoicesLoading.value) return "Loading...";
  const outstandingAmount = outstandingInvoices.value.reduce((sum, invoice) => {
    return (
      sum +
      Math.max(
        Number(invoice?.totalAmount || 0) - Number(invoice?.paidAmount || 0),
        0,
      )
    );
  }, 0);
  return formatCurrency(outstandingAmount);
});

const feesDetail = computed(() => {
  if (invoicesLoading.value) return "Fetching your current billing balance.";
  const count = outstandingInvoices.value.length;
  if (!count) return "No outstanding invoices on your account.";
  return `${count} invoice${count === 1 ? "" : "s"} currently outstanding.`;
});

const nextTimetableEntry = computed(() => {
  const entries = todayTimetableEntries.value || [];
  return entries.length ? entries[0] : null;
});

const moreTimetableEntries = computed(() => {
  const entries = todayTimetableEntries.value || [];
  return entries.length > 1 ? entries.slice(1, 3) : [];
});

const nextTimetableTitle = computed(() => {
  if (!nextTimetableEntry.value) return "";
  const subject = nextTimetableEntry.value.subjectName || "";
  const cls = nextTimetableEntry.value.className || "";
  if (subject && cls) return `${subject} • ${cls}`;
  return subject || cls || nextTimetableEntry.value.name || "";
});

const nextTimetableTime = computed(() => {
  if (!nextTimetableEntry.value) return "";
  return `${nextTimetableEntry.value.startTime} - ${nextTimetableEntry.value.endTime}`;
});

const timetableSubtitle = computed(() => {
  if (lessonsLoading.value) return "Loading today's classes.";
  const count = todayTimetableEntries.value.length;
  const studentName = selectedStudentName.value || "your child";
  if (!count) return `No classes scheduled today for ${studentName}.`;
  return `${count} class${count === 1 ? "" : "es"} scheduled today for ${studentName}.`;
});

const timetableEmptyLabel = computed(() => {
  if (lessonsLoading.value) return "Fetching today's timetable.";
  return "No lessons scheduled for today.";
});

onMounted(async () => {
  await fetchLinkedStudents();
  await Promise.all([fetchInvoiceSummary(), fetchSelectedStudentOverview()]);
});

watch(selectedStudentId, () => {
  void fetchSelectedStudentOverview();
});
</script>

<style lang="scss" scoped></style>
