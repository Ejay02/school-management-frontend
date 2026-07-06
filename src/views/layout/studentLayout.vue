<template>
  <div class="rounded border-l border-t border-b border-gray-300 p-2 w-full">
    <div class="gap-4 flex-col xl:flex-row w-full mt-1">
      <div class="">
        <div class="">
          <div class="h-full bg-white p-4 rounded-md w-full">
            <div class="mb-6">
              <h1 class="text-xl font-semibold text-gray-600">Today</h1>
              <p class="mt-2 text-sm text-gray-500">
                Your due assignments and assigned exams in one place.
              </p>
            </div>

            <div
              class="mb-6 grid gap-4 md:grid-cols-3 items-stretch auto-rows-fr"
            >
              <router-link to="/assignments" class="block h-full">
                <div
                  class="h-full min-h-[180px] rounded-xl border p-4 transition-colors"
                  :class="assignmentCardClass"
                >
                  <div class="flex h-full flex-col">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-gray-900">
                          Assignments due
                        </p>
                        <p class="mt-1 text-xs text-gray-600">
                          Outstanding work still waiting for submission.
                        </p>
                      </div>
                      <div
                        class="h-9 w-9 shrink-0 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"
                      >
                        <i class="fa-solid fa-book-open"></i>
                      </div>
                    </div>

                    <div class="mt-5">
                      <p class="text-3xl font-semibold text-gray-900">
                        {{ todayOverview.dueAssignmentCount }}
                      </p>
                      <p class="mt-2 text-xs text-gray-500">
                        {{ assignmentSummaryLabel }}
                      </p>
                    </div>

                    <div class="mt-auto pt-4 text-sm font-medium text-indigo-600">
                      View assignments
                    </div>
                  </div>
                </div>
              </router-link>

              <router-link to="/exams" class="block h-full">
                <div
                  class="h-full min-h-[180px] rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50"
                >
                  <div class="flex h-full flex-col">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-gray-900">
                          Assigned exams
                        </p>
                        <p class="mt-1 text-xs text-gray-500">
                          Upcoming and not-yet-taken exams assigned to you.
                        </p>
                      </div>
                      <div
                        class="h-9 w-9 shrink-0 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"
                      >
                        <i class="fa-regular fa-pen-to-square"></i>
                      </div>
                    </div>

                    <div class="mt-5">
                      <p class="text-3xl font-semibold text-gray-900">
                        {{ todayOverview.upcomingExamCount }}
                      </p>
                    </div>

                    <div class="mt-auto pt-4 text-sm font-medium text-indigo-600">
                      View exams
                    </div>
                  </div>
                </div>
              </router-link>

              <div class="block h-full">
                <div
                  class="h-full min-h-[180px] rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div class="flex h-full flex-col">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-gray-900">
                          Next exam
                        </p>
                        <p class="mt-1 text-xs text-gray-500">
                          Your nearest assigned exam slot.
                        </p>
                      </div>
                      <div
                        class="h-9 w-9 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"
                      >
                        <i class="fa-regular fa-clock"></i>
                      </div>
                    </div>

                    <div class="mt-5 min-h-[56px]">
                      <p
                        v-if="nextExamTitle"
                        class="text-base font-semibold text-gray-800"
                      >
                        {{ nextExamTitle }}
                      </p>
                      <p v-if="nextExamTimeLabel" class="mt-1 text-sm text-indigo-600">
                        {{ nextExamTimeLabel }}
                      </p>
                      <p v-else class="text-sm text-gray-500">
                        No assigned exams pending right now.
                      </p>
                    </div>

                    <div class="mt-auto pt-4 text-sm font-medium text-indigo-600">
                      Stay prepared
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm"
            >
              <div
                class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
              >
                <div>
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700"
                    >
                      <i class="fa-solid fa-note-sticky"></i>
                    </div>
                    <div>
                      <h2 class="text-lg font-semibold text-gray-800">
                        Student Note
                      </h2>
                      <p class="text-sm text-gray-600">
                        Due work and exams that still need your attention.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap gap-2">
                  <span
                    class="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-yellow-700"
                  >
                    Assignments {{ todayOverview.dueAssignmentCount }}
                  </span>
                  <span
                    class="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700"
                  >
                    Exams {{ todayOverview.upcomingExamCount }}
                  </span>
                </div>
              </div>

              <div
                v-if="!todoItems.length"
                class="mt-4 rounded-xl border border-dashed border-yellow-200 bg-white/70 px-4 py-6 text-sm text-gray-500"
              >
                Nothing urgent right now. You are clear on due assignments and assigned exams.
              </div>

              <div v-else class="mt-4 space-y-3">
                <div
                  v-for="item in todoItems"
                  :key="item.kind + ':' + item.id"
                  class="rounded-xl border border-yellow-100 bg-white p-4"
                >
                  <div class="flex items-start gap-3">
                    <span
                      class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs"
                      :class="item.done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-yellow-400 bg-white text-yellow-700'"
                    >
                      <i
                        :class="item.done ? 'fa-solid fa-check' : 'fa-regular fa-square'"
                      ></i>
                    </span>

                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-start justify-between gap-3">
                        <div class="min-w-0">
                          <p
                            class="font-medium text-gray-800"
                            :class="item.done ? 'line-through text-gray-500' : ''"
                          >
                            {{ item.title }}
                          </p>
                          <p class="mt-1 text-xs text-gray-500">
                            {{ item.subtitle }}
                          </p>
                        </div>

                        <span
                          class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                          :class="item.statusClass"
                        >
                          {{ item.statusLabel }}
                        </span>
                      </div>

                      <div class="mt-3">
                        <router-link
                          :to="item.link"
                          class="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                        >
                          {{ item.linkLabel }}
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h1 class="text-xl font-semibold mb-6 text-gray-500">Schedule</h1>

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
import { getStudentTodayOverview } from "../../graphql/queries";

const { result: todayResult, loading: todayLoading } = useQuery(
  getStudentTodayOverview,
);

const todayOverview = computed(() => {
  return (
    todayResult.value?.getStudentTodayOverview || {
      dueAssignmentCount: 0,
      overdueAssignmentCount: 0,
      upcomingExamCount: 0,
      dueAssignments: [],
      upcomingExams: [],
    }
  );
});

const assignmentSummaryLabel = computed(() => {
  if (todayLoading.value) return "Loading your due work...";
  const overdue = todayOverview.value?.overdueAssignmentCount || 0;
  if (overdue > 0) {
    return `${overdue} overdue`;
  }
  return "No overdue assignments";
});

const nextExam = computed(() => {
  const exams = Array.isArray(todayOverview.value?.upcomingExams)
    ? todayOverview.value.upcomingExams
    : [];
  return exams.length ? exams[0] : null;
});

const nextExamTitle = computed(() => {
  if (!nextExam.value) return "";
  if (nextExam.value.subjectName) {
    return `${nextExam.value.title} • ${nextExam.value.subjectName}`;
  }
  return nextExam.value.title || "";
});

const nextExamTimeLabel = computed(() => {
  if (!nextExam.value) return "";
  return `${formatDate(nextExam.value.date)} • ${formatTime(nextExam.value.startTime)} - ${formatTime(nextExam.value.endTime)}`;
});

const assignmentCardClass = computed(() => {
  if (todayOverview.value.overdueAssignmentCount > 0) {
    return "border-red-200 bg-red-50 hover:bg-red-100";
  }
  if (todayOverview.value.dueAssignmentCount > 0) {
    return "border-yellow-200 bg-yellow-50 hover:bg-yellow-100";
  }
  return "border-gray-200 bg-white hover:bg-gray-50";
});

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString();
}

function formatTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const todoItems = computed(() => {
  const assignmentItems = (todayOverview.value?.dueAssignments || []).map(
    (assignment) => ({
      kind: "assignment",
      id: assignment.assignmentId,
      title: assignment.title,
      subtitle: `${assignment.subjectName || "Assignment"} • Due ${formatDate(assignment.dueDate)}`,
      statusLabel: assignment.statusLabel,
      statusClass: assignment.overdue
        ? "bg-red-100 text-red-700"
        : assignment.statusLabel === "Due today"
          ? "bg-amber-100 text-amber-700"
          : "bg-yellow-100 text-yellow-700",
      link: `/assignment/${assignment.assignmentId}`,
      linkLabel: "Open assignment",
      done: false,
      sortTime: new Date(assignment.dueDate).getTime(),
    }),
  );

  const examItems = (todayOverview.value?.upcomingExams || []).map((exam) => ({
    kind: "exam",
    id: exam.examId,
    title: exam.title,
    subtitle: `${exam.subjectName || "Exam"} • ${formatDate(exam.date)} • ${formatTime(exam.startTime)} - ${formatTime(exam.endTime)}`,
    statusLabel: exam.statusLabel,
    statusClass: exam.missed
      ? "bg-red-100 text-red-700"
      : exam.statusLabel === "Today"
        ? "bg-indigo-100 text-indigo-700"
        : "bg-slate-100 text-slate-700",
    link: `/exams/${exam.examId}`,
    linkLabel: "Open exam",
    done: false,
    sortTime: new Date(exam.date).getTime(),
  }));

  return [...assignmentItems, ...examItems]
    .sort((left, right) => left.sortTime - right.sortTime)
    .slice(0, 10);
});
</script>
