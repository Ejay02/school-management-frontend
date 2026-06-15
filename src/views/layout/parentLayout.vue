<template>
  <div class="rounded border-l border-t border-b border-gray-300 p-2 w-full">
    <div class="gap-4 flex-col xl:flex-row w-full mt-1">
      <div class="">
        <div class="">
          <div class="h-full bg-white p-4 rounded-md w-full">
            <div class="mb-6">
              <h1 class="text-xl font-semibold text-gray-600">
                {{ hasLinkedStudents ? "Today" : "Calendar" }}
              </h1>
              <p class="mt-2 text-sm text-gray-500">
                {{ welcomeSubtitle }}
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

            <div v-if="hasLinkedStudents" class="mb-6">
              <div
                v-if="attendanceAlert"
                class="rounded-xl border p-4"
                :class="
                  attendanceAlert.severity === 'danger'
                    ? 'border-red-200 bg-red-50'
                    : 'border-amber-200 bg-amber-50'
                "
              >
                <div
                  class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div class="min-w-0">
                    <div
                      class="text-sm font-semibold"
                      :class="
                        attendanceAlert.severity === 'danger'
                          ? 'text-red-900'
                          : 'text-amber-900'
                      "
                    >
                      {{ attendanceAlert.title }}
                    </div>
                    <div
                      class="mt-1 text-sm"
                      :class="
                        attendanceAlert.severity === 'danger'
                          ? 'text-red-800'
                          : 'text-amber-800'
                      "
                    >
                      {{ attendanceAlert.description }}
                    </div>
                  </div>
                  <router-link
                    to="/attendance"
                    class="shrink-0 inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-50"
                  >
                    View attendance
                  </router-link>
                </div>
              </div>

              <div
                v-else
                class="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <div class="text-sm font-semibold text-emerald-900">
                      No attendance alerts
                    </div>
                    <div class="mt-1 text-sm text-emerald-800">
                      No absences or lates recorded today or yesterday.
                    </div>
                  </div>
                  <router-link
                    to="/attendance"
                    class="shrink-0 inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-50"
                  >
                    View attendance
                  </router-link>
                </div>
              </div>
            </div>

            <div
              v-if="hasLinkedStudents"
              class="mb-6 grid gap-4 md:grid-cols-3 items-stretch auto-rows-fr"
            >
              <div
                class="h-full min-h-[220px] rounded-xl border border-gray-200 bg-white p-4"
              >
                <div class="flex h-full flex-col">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-gray-900">
                        Fees due
                      </p>
                      <p class="mt-1 text-xs text-gray-500">
                        Next payment on your parent account.
                      </p>
                    </div>
                    <div
                      class="h-9 w-9 shrink-0 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"
                    >
                      <i class="fa-solid fa-file-invoice-dollar"></i>
                    </div>
                  </div>

                  <div class="mt-5 min-h-[72px]">
                    <p class="text-3xl font-semibold text-gray-900">
                      {{ feesDueHeadline }}
                    </p>
                    <p class="mt-1 text-sm text-gray-600">
                      {{ feesDueDetail }}
                    </p>
                  </div>

                  <div
                    class="mt-auto pt-4 flex items-center justify-between gap-3"
                  >
                    <router-link
                      :to="billingCtaTo"
                      class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                      :class="{
                        'pointer-events-none opacity-60': !hasFeesDue,
                      }"
                    >
                      Pay
                    </router-link>
                    <router-link
                      to="/settings/billing"
                      class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View billing
                    </router-link>
                  </div>
                </div>
              </div>

              <div
                class="h-full min-h-[220px] rounded-xl border border-gray-200 bg-white p-4"
              >
                <div class="flex h-full flex-col">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-gray-900">
                        Today&apos;s timetable
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

                  <div v-if="lessonsLoading" class="mt-5 text-sm text-gray-600">
                    Fetching today&apos;s timetable...
                  </div>

                  <div
                    v-else-if="!todayTimetableEntries.length"
                    class="mt-5 text-sm text-gray-600"
                  >
                    {{ timetableEmptyLabel }}
                  </div>

                  <div v-else class="mt-5 space-y-2">
                    <div
                      v-for="entry in todayTimetableEntries"
                      :key="entry.id"
                      class="flex items-start justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2"
                    >
                      <div class="min-w-0">
                        <div class="text-sm font-medium text-gray-800 truncate">
                          {{ entry.subjectName || entry.name }}
                        </div>
                        <div
                          v-if="entry.className"
                          class="text-xs text-gray-500 truncate"
                        >
                          {{ entry.className }}
                        </div>
                      </div>
                      <div class="shrink-0 text-xs font-medium text-indigo-600">
                        {{ entry.startTime }} - {{ entry.endTime }}
                      </div>
                    </div>
                  </div>

                  <div
                    class="mt-auto pt-4 flex items-center justify-between gap-3"
                  >
                    <router-link
                      to="/lessons"
                      class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View lessons
                    </router-link>
                  </div>
                </div>
              </div>

              <AnnouncementCard class="h-full" />
            </div>

            <div class="mt-8">
              <h2 class="text-xl font-semibold mb-4 text-gray-500">Calendar</h2>
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
import { formatDate } from "../../utils/date.holidays";
import { formatNamePart } from "../../utils/displayValue";
import AnnouncementCard from "../../components/cards/announcementCard.vue";
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
const welcomeSubtitle = computed(() => {
  const greetingName = parentName.value ? `, ${parentName.value}` : "";
  if (!hasLinkedStudents.value) {
    return `Welcome${greetingName}. Review upcoming public holidays, breaks, and events below.`;
  }
  return `Welcome${greetingName}. Keep track of your child\u2019s timetable, school updates, and upcoming items from one place.`;
});
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

const normalizeAttendanceStatus = (record) =>
  String(record?.status || "")
    .trim()
    .toUpperCase();

const getAttendanceAlertType = (record) => {
  const status = normalizeAttendanceStatus(record);
  if (status === "LATE") return "late";
  if (status === "ABSENT") return "absent";
  if (record?.present === false) return "absent";
  return "";
};

const recentAttendanceAlertRecords = computed(() => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return attendanceRecords.value.filter((record) => {
    const matchesDay =
      isSameDay(record?.date, today) || isSameDay(record?.date, yesterday);
    if (!matchesDay) return false;
    return Boolean(getAttendanceAlertType(record));
  });
});

const pluralize = (count, singular, plural) => {
  const normalizedCount = Number(count || 0);
  if (normalizedCount === 1) return singular;
  return plural || `${singular}s`;
};

const attendanceAlert = computed(() => {
  if (attendanceLoading.value) return null;

  const studentName = selectedStudentName.value || "Your child";
  const records = recentAttendanceAlertRecords.value;
  if (!records.length) return null;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const counts = {
    today: { absent: 0, late: 0 },
    yesterday: { absent: 0, late: 0 },
  };

  records.forEach((record) => {
    const dayKey = isSameDay(record?.date, today) ? "today" : "yesterday";
    const type = getAttendanceAlertType(record);
    if (!type) return;
    counts[dayKey][type] += 1;
  });

  const hasAnyAbsent = counts.today.absent > 0 || counts.yesterday.absent > 0;
  const severity = hasAnyAbsent ? "danger" : "warning";

  const fragments = [];
  if (counts.today.absent) {
    fragments.push(
      `${counts.today.absent} ${pluralize(counts.today.absent, "absence")} today`,
    );
  }
  if (counts.today.late) {
    fragments.push(
      `${counts.today.late} ${pluralize(counts.today.late, "late arrival", "late arrivals")} today`,
    );
  }
  if (counts.yesterday.absent) {
    fragments.push(
      `${counts.yesterday.absent} ${pluralize(counts.yesterday.absent, "absence")} yesterday`,
    );
  }
  if (counts.yesterday.late) {
    fragments.push(
      `${counts.yesterday.late} ${pluralize(counts.yesterday.late, "late arrival", "late arrivals")} yesterday`,
    );
  }

  const description = `${studentName} has ${fragments.join(" • ")}.`;

  return {
    title: "Attendance alert",
    description,
    severity,
  };
});

const outstandingInvoices = computed(() =>
  invoices.value.filter(
    (invoice) =>
      Number(invoice?.totalAmount || 0) > Number(invoice?.paidAmount || 0),
  ),
);

const hasFeesDue = computed(() => {
  if (invoicesLoading.value) return false;
  return outstandingInvoices.value.length > 0;
});

const nextDueInvoice = computed(() => {
  const invoicesList = outstandingInvoices.value || [];
  if (!invoicesList.length) return null;

  const sorted = [...invoicesList].sort((left, right) => {
    const leftTime = new Date(left?.dueDate || 0).getTime();
    const rightTime = new Date(right?.dueDate || 0).getTime();
    const leftComparable = Number.isFinite(leftTime)
      ? leftTime
      : Number.MAX_SAFE_INTEGER;
    const rightComparable = Number.isFinite(rightTime)
      ? rightTime
      : Number.MAX_SAFE_INTEGER;
    return leftComparable - rightComparable;
  });

  return sorted[0] || null;
});

const nextDueAmount = computed(() => {
  if (!nextDueInvoice.value) return 0;
  return Math.max(
    Number(nextDueInvoice.value?.totalAmount || 0) -
      Number(nextDueInvoice.value?.paidAmount || 0),
    0,
  );
});

const feesDueHeadline = computed(() => {
  if (invoicesLoading.value) return "Loading...";
  if (!hasFeesDue.value) return "No fees due";
  return formatCurrency(nextDueAmount.value);
});

const feesDueDetail = computed(() => {
  if (invoicesLoading.value) return "Fetching fees due...";
  if (!hasFeesDue.value) return "You have no outstanding invoices.";
  const due = nextDueInvoice.value?.dueDate
    ? formatDate(nextDueInvoice.value.dueDate)
    : "N/A";
  return `Due ${due}`;
});

const billingCtaTo = computed(() => {
  const invoiceId = nextDueInvoice.value?.id;
  if (!invoiceId) return "/settings/billing";
  return { path: "/settings/billing", query: { invoiceId } };
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
