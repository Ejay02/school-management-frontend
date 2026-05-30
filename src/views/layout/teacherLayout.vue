<template>
  <div class="rounded border-l border-t border-b border-gray-300 p-2 w-full">
    <div class="gap-4 flex-col xl:flex-row w-full mt-1">
      <div class="">
        <div class="">
          <div class="h-full bg-white p-4 rounded-md w-full">
            <div class="mb-6">
              <h1 class="text-xl font-semibold text-gray-600">Today</h1>
              <p class="mt-2 text-sm text-gray-500">
                Your next class, attendance tasks, and grading queue at a
                glance.
              </p>
            </div>

            <div
              class="mb-6 grid gap-4 md:grid-cols-3 items-stretch auto-rows-fr"
            >
              <router-link
                :to="attendanceDueLink"
                class="block h-full md:col-span-2"
              >
                <div
                  class="h-full min-h-[160px] rounded-xl border p-4 flex transition-colors"
                  :class="attendanceDueCardClass"
                >
                  <div class="flex w-full items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-gray-900">
                        Attendance due
                      </p>
                      <p class="mt-1 text-xs text-gray-600">
                        Lessons today without marked attendance.
                      </p>
                      <p class="mt-3 text-3xl font-semibold text-gray-900">
                        {{ todayOverview.attendanceDueCount }}
                      </p>
                      <p class="mt-1 text-sm font-medium text-indigo-700">
                        Speed-mode attendance
                      </p>
                      <p
                        v-if="
                          todayOverview.attendanceDueCount === 0 &&
                          !todayLoading
                        "
                        class="mt-2 text-xs text-gray-600"
                      >
                        All set. No classes need attendance right now.
                      </p>
                    </div>
                    <div
                      class="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center"
                      :class="
                        todayOverview.attendanceDueCount > 0
                          ? 'bg-red-100 text-red-700'
                          : 'bg-eduSkyLight text-gray-700'
                      "
                    >
                      <i class="fa-solid fa-clipboard-check"></i>
                    </div>
                  </div>
                </div>
              </router-link>

              <router-link to="/lessons" class="block h-full">
                <div
                  class="h-full min-h-[160px] rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 flex"
                >
                  <div class="flex w-full items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-gray-800">
                        Next class
                      </p>
                      <p class="mt-1 text-xs text-gray-500">
                        {{ nextClassSubtitle }}
                      </p>
                      <p
                        v-if="nextClassTitle"
                        class="mt-2 text-sm font-semibold text-gray-700 truncate"
                      >
                        {{ nextClassTitle }}
                      </p>
                      <p
                        v-if="nextClassTime"
                        class="mt-1 text-xs font-medium text-indigo-600"
                      >
                        {{ nextClassTime }}
                      </p>
                    </div>
                    <div
                      class="h-9 w-9 shrink-0 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"
                    >
                      <i class="fa-regular fa-clock"></i>
                    </div>
                  </div>
                </div>
              </router-link>

              <router-link to="/submissions" class="block h-full">
                <div
                  class="h-full min-h-[160px] rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 flex"
                >
                  <div class="flex w-full items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-gray-800">
                        Assignments to grade
                      </p>
                      <p class="mt-1 text-xs text-gray-500">
                        Student submissions waiting for grading.
                      </p>
                      <p class="mt-3 text-2xl font-semibold text-gray-900">
                        {{ todayOverview.assignmentsToGradeCount }}
                      </p>
                      <p class="mt-1 text-xs font-medium text-indigo-600">
                        View submissions
                      </p>
                    </div>
                    <div
                      class="h-9 w-9 shrink-0 rounded-lg bg-eduYellowLight text-gray-700 flex items-center justify-center"
                    >
                      <i class="fa-solid fa-pen-nib"></i>
                    </div>
                  </div>
                </div>
              </router-link>
            </div>

            <div class="grid gap-6 lg:grid-cols-3">
              <div class="lg:col-span-2">
                <h2 class="text-xl font-semibold mb-4 text-gray-500">
                  Next classes today
                </h2>
                <div class="rounded-xl border border-gray-200 bg-white">
                  <div
                    v-if="todayLoading"
                    class="flex items-center gap-2 p-4 text-sm text-gray-600"
                  >
                    <span
                      class="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-500"
                    ></span>
                    Loading schedule...
                  </div>
                  <div
                    v-else-if="!todayOverview.nextClasses?.length"
                    class="p-4"
                  >
                    <div class="text-sm font-semibold text-gray-800">
                      No more classes today
                    </div>
                    <div class="mt-1 text-sm text-gray-500">
                      Enjoy the break. New lessons will show up here when your
                      timetable updates.
                    </div>
                    <router-link
                      to="/lessons"
                      class="mt-3 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View all lessons <i class="fa-solid fa-arrow-right"></i>
                    </router-link>
                  </div>
                  <div v-else class="divide-y divide-gray-100">
                    <router-link
                      v-for="cls in nextClassesPreview"
                      :key="cls.id"
                      to="/lessons"
                      class="block p-4 hover:bg-gray-50"
                    >
                      <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                          <div class="text-sm font-semibold text-gray-800">
                            {{ cls.subjectName || cls.name }}
                          </div>
                          <div class="mt-1 text-sm text-gray-500 truncate">
                            {{ cls.className }}
                          </div>
                        </div>
                        <div class="text-sm font-medium text-indigo-600">
                          {{ cls.startTime }} - {{ cls.endTime }}
                        </div>
                      </div>
                    </router-link>
                    <div class="p-4">
                      <router-link
                        to="/lessons"
                        class="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View full timetable
                        <i class="fa-solid fa-arrow-right"></i>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>

              <div class="lg:col-span-1">
                <h2 class="text-xl font-semibold mb-4 text-gray-500">
                  Recent announcements
                </h2>
                <div class="rounded-xl border border-gray-200 bg-white">
                  <div
                    v-if="announcementsLoading"
                    class="flex items-center gap-2 p-4 text-sm text-gray-600"
                  >
                    <span
                      class="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-500"
                    ></span>
                    Loading announcements...
                  </div>
                  <div v-else-if="!recentAnnouncements.length" class="p-4">
                    <div class="text-sm font-semibold text-gray-800">
                      No announcements yet
                    </div>
                    <div class="mt-1 text-sm text-gray-500">
                      When admins or teachers post updates, they’ll appear here.
                    </div>
                    <div
                      v-if="unreadAnnouncementsCount > 0"
                      class="mt-3 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                    >
                      {{ unreadAnnouncementsCount }} unread
                    </div>
                    <router-link
                      to="/announcements"
                      class="mt-3 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Open announcements <i class="fa-solid fa-arrow-right"></i>
                    </router-link>
                  </div>
                  <div v-else class="divide-y divide-gray-100">
                    <div class="flex items-center justify-between p-4">
                      <div class="text-sm font-semibold text-gray-700">
                        Latest
                      </div>
                      <div
                        v-if="unreadAnnouncementsCount > 0"
                        class="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
                      >
                        {{ unreadAnnouncementsCount }} unread
                      </div>
                      <div v-else class="text-xs text-gray-500">
                        All caught up
                      </div>
                    </div>
                    <router-link
                      v-for="a in recentAnnouncements"
                      :key="a.id"
                      :to="`/announcement/${a.id}`"
                      class="block px-4 py-3 hover:bg-gray-50"
                    >
                      <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                          <div class="text-sm font-semibold text-gray-800">
                            {{ a.title }}
                          </div>
                          <div class="mt-1 text-xs text-gray-500 truncate">
                            {{ a.class?.name ? `${a.class.name} • ` : "" }}
                            {{ formatAnnouncementDate(a.createdAt) }}
                          </div>
                        </div>
                        <i class="fa-solid fa-chevron-right text-gray-300"></i>
                      </div>
                    </router-link>
                    <div class="p-4">
                      <router-link
                        to="/announcements"
                        class="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View all <i class="fa-solid fa-arrow-right"></i>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h2 class="text-xl font-semibold mb-4 mt-8 text-gray-500">
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
import { computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import PlannerCard from "../../components/cards/plannerCard.vue";
import {
  getAllAnnouncements,
  getTeacherTodayOverview,
  getUnreadAnnouncementsCount,
} from "../../graphql/queries";

const { result: todayResult, loading: todayLoading } = useQuery(
  getTeacherTodayOverview,
);

const todayOverview = computed(() => {
  return (
    todayResult.value?.getTeacherTodayOverview || {
      nextClasses: [],
      attendanceDueCount: 0,
      assignmentsToGradeCount: 0,
    }
  );
});

const { result: unreadCountResult } = useQuery(getUnreadAnnouncementsCount);
const { result: announcementsResult, loading: announcementsLoading } = useQuery(
  getAllAnnouncements,
  {
    params: {
      isArchived: false,
      page: 1,
      limit: 5,
      sortBy: "createdAt",
      sortOrder: "DESC",
    },
  },
);

const unreadAnnouncementsCount = computed(() => {
  const value = unreadCountResult.value?.getUnreadAnnouncementsCount;
  return typeof value === "number" ? value : 0;
});

const recentAnnouncements = computed(() => {
  const items = announcementsResult.value?.getAllAnnouncements || [];
  return Array.isArray(items) ? items.slice(0, 3) : [];
});

const nextClass = computed(() => {
  const classes = todayOverview.value?.nextClasses || [];
  return classes.length ? classes[0] : null;
});

const nextClassesPreview = computed(() => {
  const classes = todayOverview.value?.nextClasses || [];
  return Array.isArray(classes) ? classes.slice(0, 4) : [];
});

const nextClassTitle = computed(() => {
  if (!nextClass.value) return "";
  const subject = nextClass.value.subjectName || "";
  const cls = nextClass.value.className || "";
  if (subject && cls) return `${subject} • ${cls}`;
  return subject || cls || nextClass.value.name || "";
});

const nextClassTime = computed(() => {
  if (!nextClass.value) return "";
  return `${nextClass.value.startTime} - ${nextClass.value.endTime}`;
});

const nextClassSubtitle = computed(() => {
  if (todayLoading.value) return "Loading…";
  if (!nextClass.value) return "No more classes scheduled for today.";
  return "Up next for you today.";
});

const attendanceDueLink = computed(() => "/attendance?mode=mark&entry=speed");

const attendanceDueCardClass = computed(() => {
  if (todayLoading.value) return "border-gray-200 bg-white hover:bg-gray-50";
  if (todayOverview.value.attendanceDueCount > 0) {
    return "border-red-200 bg-red-50 hover:bg-red-100";
  }
  return "border-gray-200 bg-white hover:bg-gray-50";
});

const formatAnnouncementDate = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "Recently";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};
</script>

<style scoped></style>
