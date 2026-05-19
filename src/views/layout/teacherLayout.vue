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

              <router-link to="/attendance" class="block h-full">
                <div
                  class="h-full min-h-[160px] rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 flex"
                >
                  <div class="flex w-full items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-gray-800">
                        Attendance due
                      </p>
                      <p class="mt-1 text-xs text-gray-500">
                        Lessons today without marked attendance.
                      </p>
                      <p class="mt-3 text-2xl font-semibold text-gray-900">
                        {{ todayOverview.attendanceDueCount }}
                      </p>
                      <p class="mt-1 text-xs font-medium text-indigo-600">
                        Open attendance
                      </p>
                    </div>
                    <div
                      class="h-9 w-9 shrink-0 rounded-lg bg-eduSkyLight text-gray-700 flex items-center justify-center"
                    >
                      <i class="fa-solid fa-clipboard-check"></i>
                    </div>
                  </div>
                </div>
              </router-link>

              <router-link to="/assignments" class="block h-full">
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
                        Open assignments
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

            <h2 class="text-xl font-semibold mb-6 text-gray-500">Schedule</h2>
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
import { getTeacherTodayOverview } from "../../graphql/queries";

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

const nextClass = computed(() => {
  const classes = todayOverview.value?.nextClasses || [];
  return classes.length ? classes[0] : null;
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
</script>

<style lang="scss" scoped></style>
