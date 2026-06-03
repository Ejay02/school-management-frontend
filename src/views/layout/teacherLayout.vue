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
              <div class="block h-full md:col-span-2">
                <div
                  class="h-full min-h-[160px] rounded-xl border p-4 flex transition-colors cursor-pointer"
                  :class="attendanceDueCardClass"
                  @click="openAttendanceDashboard"
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

                      <div class="mt-3 flex flex-wrap items-center gap-3">
                        <router-link
                          v-if="attendanceSpeedEnabled"
                          :to="attendanceDueLink"
                          class="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                          @click.stop
                        >
                          Speed-mode <i class="fa-solid fa-bolt"></i>
                        </router-link>
                        <button
                          v-else
                          class="inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-500 cursor-not-allowed"
                          type="button"
                          :title="attendanceSpeedDisabledLabel"
                          @click.stop
                          disabled
                        >
                          Speed-mode <i class="fa-solid fa-bolt"></i>
                        </button>

                        <div class="text-xs text-gray-500">
                          {{
                            attendanceSpeedEnabled
                              ? "Open speed-mode attendance."
                              : attendanceSpeedDisabledLabel
                          }}
                        </div>
                      </div>
                    </div>
                    <div
                      class="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-gray-100 text-gray-500"
                    >
                      <i class="fa-solid fa-clipboard-check"></i>
                    </div>
                  </div>
                </div>
              </div>

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

            <div class="grid gap-6">
              <div>
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
import { useRouter } from "vue-router";
import PlannerCard from "../../components/cards/plannerCard.vue";
import { getTeacherTodayOverview } from "../../graphql/queries";

const { result: todayResult, loading: todayLoading } = useQuery(
  getTeacherTodayOverview,
);
const router = useRouter();

const todayOverview = computed(() => {
  return (
    todayResult.value?.getTeacherTodayOverview || {
      nextClasses: [],
      attendanceDueCount: 0,
      assignmentsToGradeCount: 0,
    }
  );
});

const openAttendanceDashboard = () => {
  router.push("/attendance");
};


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

const fridayCloseMinutes = 14 * 60;

const attendanceSpeedEnabled = computed(() => {
  const now = new Date();
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (day === 0 || day === 6) return false;
  if (day === 5 && minutes >= fridayCloseMinutes) return false;
  return true;
});

const attendanceSpeedDisabledLabel = computed(() => {
  const now = new Date();
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (day === 0 || day === 6)
    return "Attendance is closed for the weekend. Opens Monday.";
  if (day === 5 && minutes >= fridayCloseMinutes) {
    return "School is closed for the weekend. Speed-mode opens Monday.";
  }
  return "Speed-mode attendance is currently unavailable.";
});

const attendanceDueCardClass = computed(() => {
  if (todayLoading.value) return "border-gray-200 bg-white hover:bg-gray-50";
  if (todayOverview.value.attendanceDueCount > 0) {
    return "border-red-200 bg-red-50 hover:bg-red-100";
  }
  return "border-gray-200 bg-white hover:bg-gray-50";
});

</script>

<style scoped></style>
