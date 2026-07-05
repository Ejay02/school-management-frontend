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
              <div class="block h-full">
                <div
                  class="h-full min-h-[180px] rounded-xl border p-4 transition-colors cursor-pointer"
                  :class="attendanceDueCardClass"
                  @click="openAttendanceDashboard"
                >
                  <div class="flex h-full w-full flex-col">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-gray-900">
                          Attendance due
                        </p>
                        <p class="mt-1 text-xs text-gray-600">
                          Lessons today without marked attendance.
                        </p>
                      </div>
                      <div
                        class="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-gray-100 text-gray-500"
                      >
                        <i class="fa-solid fa-clipboard-check"></i>
                      </div>
                    </div>

                    <div class="mt-5">
                      <p class="text-3xl font-semibold text-gray-900">
                        {{ todayOverview.attendanceDueCount }}
                      </p>
                    </div>

                    <div class="mt-auto pt-4">
                      <div class="flex flex-wrap items-center gap-3">
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
                        <div
                          v-if="!attendanceSpeedEnabled"
                          class="text-xs text-gray-500"
                        >
                          {{ attendanceSpeedDisabledLabel }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <router-link to="/lessons" class="block h-full">
                <div
                  class="h-full min-h-[180px] rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50"
                >
                  <div class="flex h-full flex-col">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-gray-900">
                          Next classes today
                        </p>
                        <p class="mt-1 text-xs text-gray-500">
                          {{ nextClassSubtitle }}
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
                        v-if="nextClassTitle"
                        class="text-base font-semibold text-gray-800 truncate"
                      >
                        {{ nextClassTitle }}
                      </p>
                      <p
                        v-if="nextClassTime"
                        class="mt-1 text-sm font-medium text-indigo-600"
                      >
                        {{ nextClassTime }}
                      </p>
                    </div>

                    <div v-if="moreClasses.length" class="mt-3 space-y-2">
                      <div
                        v-for="cls in moreClasses"
                        :key="cls.id"
                        class="flex items-center justify-between gap-3"
                      >
                        <div class="min-w-0 text-xs text-gray-600 truncate">
                          {{ cls.subjectName || cls.name }}
                          <span v-if="cls.className" class="text-gray-400">
                            • {{ cls.className }}
                          </span>
                        </div>
                        <div class="shrink-0 text-xs text-gray-500">
                          {{ cls.startTime }} - {{ cls.endTime }}
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

              <router-link to="/submissions" class="block h-full">
                <div
                  class="h-full min-h-[180px] rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50"
                >
                  <div class="flex h-full flex-col">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-gray-900">
                          Assignments to grade
                        </p>
                        <p class="mt-1 text-xs text-gray-500">
                          Student submissions waiting for grading.
                        </p>
                      </div>
                      <div
                        class="h-9 w-9 shrink-0 rounded-lg bg-eduYellowLight text-gray-700 flex items-center justify-center"
                      >
                        <i class="fa-solid fa-pen-nib"></i>
                      </div>
                    </div>

                    <div class="mt-5">
                      <p class="text-3xl font-semibold text-gray-900">
                        {{ todayOverview.assignmentsToGradeCount }}
                      </p>
                    </div>

                    <div
                      class="mt-auto pt-4 text-sm font-medium text-indigo-600"
                    >
                      View submissions
                    </div>
                  </div>
                </div>
              </router-link>
            </div>

            <div
              class="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm"
            >
              <div
                class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
              >
                <div>
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700"
                    >
                      <i class="fa-solid fa-note-sticky"></i>
                    </div>
                    <div>
                      <h2 class="text-lg font-semibold text-gray-800">
                        Supervisor Note
                      </h2>
                      <p class="text-sm text-gray-600">
                        Term report remarks for your supervised classes.
                      </p>
                    </div>
                  </div>
                  <p class="mt-3 text-sm text-gray-600">
                    {{ supervisorTaskSubtitle }}
                  </p>
                </div>

                <div class="flex flex-wrap gap-2">
                  <span
                    class="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-amber-700"
                  >
                    Pending {{ supervisorPendingCount }}
                  </span>
                  <span
                    class="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                  >
                    Done {{ supervisorCompletedCount }}
                  </span>
                </div>
              </div>

              <div
                v-if="!supervisorTasks.length"
                class="mt-4 rounded-xl border border-dashed border-amber-200 bg-white/70 px-4 py-6 text-sm text-gray-500"
              >
                No class supervisor remark tasks for the current term.
              </div>

              <div v-else class="mt-4 space-y-3">
                <div
                  v-for="task in supervisorTasks"
                  :key="task.studentId"
                  class="rounded-xl border border-amber-100 bg-white p-4"
                >
                  <div
                    class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"
                  >
                    <div class="min-w-0 flex-1">
                      <button
                        type="button"
                        class="flex w-full items-start gap-3 text-left"
                        @click="
                          !task.locked && toggleTaskEditor(task.studentId)
                        "
                      >
                        <span
                          class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs"
                          :class="
                            task.completed
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : 'border-amber-400 bg-white text-amber-600'
                          "
                        >
                          <i
                            :class="
                              task.completed
                                ? 'fa-solid fa-check'
                                : 'fa-regular fa-square'
                            "
                          ></i>
                        </span>
                        <div class="min-w-0">
                          <p
                            class="font-medium text-gray-800"
                            :class="
                              task.completed ? 'line-through text-gray-500' : ''
                            "
                          >
                            {{ task.studentName }}
                            <span class="text-gray-400">
                              • {{ task.className }}
                            </span>
                          </p>
                          <p class="mt-1 text-xs text-gray-500">
                            {{ task.studentCode || "No student code" }}
                            <span v-if="task.updatedAt">
                              • Updated {{ formatTimestamp(task.updatedAt) }}
                            </span>
                          </p>
                        </div>
                      </button>
                    </div>

                    <div class="shrink-0">
                      <span
                        class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                        :class="
                          task.locked
                            ? 'bg-slate-200 text-slate-700'
                            : task.completed
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                        "
                      >
                        {{
                          task.locked
                            ? "Published"
                            : task.completed
                              ? "Done"
                              : "Pending"
                        }}
                      </span>
                    </div>
                  </div>

                  <div
                    v-if="isTaskEditorOpen(task.studentId) && !task.locked"
                    class="mt-4 rounded-xl bg-amber-50/60 p-3"
                  >
                    <textarea
                      v-model.trim="remarkDrafts[task.studentId]"
                      rows="3"
                      class="w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                      placeholder="Write the class supervisor's term remark..."
                    ></textarea>

                    <div class="mt-3 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        class="rounded-md bg-amber-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-amber-300"
                        :disabled="savingRemarkStudentId === task.studentId"
                        @click="saveSupervisorRemark(task)"
                      >
                        {{
                          savingRemarkStudentId === task.studentId
                            ? "Saving..."
                            : task.completed
                              ? "Update Remark"
                              : "Save Remark"
                        }}
                      </button>
                      <button
                        type="button"
                        class="text-sm font-medium text-gray-500 transition hover:text-gray-700"
                        @click="closeTaskEditor(task.studentId)"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  <p
                    v-if="task.locked"
                    class="mt-3 text-xs font-medium text-slate-500"
                  >
                    This remark is already on a published report and is locked.
                  </p>
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
import { computed, ref, watch } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { apolloClient } from "../../../apollo-client";
import PlannerCard from "../../components/cards/plannerCard.vue";
import { getTeacherTodayOverview } from "../../graphql/queries";
import { upsertTermReportRemarkMutation } from "../../graphql/mutations";
import { useNotificationStore } from "../../store/notification";

const {
  result: todayResult,
  loading: todayLoading,
  refetch: refetchTodayOverview,
} = useQuery(getTeacherTodayOverview);
const router = useRouter();
const notificationStore = useNotificationStore();
const openTaskEditors = ref({});
const remarkDrafts = ref({});
const savingRemarkStudentId = ref("");

const todayOverview = computed(() => {
  return (
    todayResult.value?.getTeacherTodayOverview || {
      nextClasses: [],
      attendanceDueCount: 0,
      assignmentsToGradeCount: 0,
      supervisorAcademicPeriod: null,
      supervisorCurrentTerm: null,
      supervisorRemarkPendingCount: 0,
      supervisorRemarkCompletedCount: 0,
      supervisorRemarkTasks: [],
    }
  );
});

const supervisorTasks = computed(() => {
  return Array.isArray(todayOverview.value?.supervisorRemarkTasks)
    ? todayOverview.value.supervisorRemarkTasks
    : [];
});

const supervisorPendingCount = computed(() => {
  return todayOverview.value?.supervisorRemarkPendingCount || 0;
});

const supervisorCompletedCount = computed(() => {
  return todayOverview.value?.supervisorRemarkCompletedCount || 0;
});

const supervisorTaskSubtitle = computed(() => {
  const term = formatTermLabel(todayOverview.value?.supervisorCurrentTerm);
  const period = todayOverview.value?.supervisorAcademicPeriod;
  if (!term || !period) {
    return "Current term setup is missing, so supervisor remark reminders are unavailable.";
  }
  return `${term} • ${period}`;
});

const openAttendanceDashboard = () => {
  router.push("/attendance");
};

function formatTermLabel(term) {
  if (term === "FIRST") return "First Term";
  if (term === "SECOND") return "Second Term";
  if (term === "THIRD") return "Third Term";
  return "";
}

function formatTimestamp(value) {
  if (!value) return "";
  return new Date(value).toLocaleString();
}

function isTaskEditorOpen(studentId) {
  return Boolean(openTaskEditors.value[studentId]);
}

function toggleTaskEditor(studentId) {
  openTaskEditors.value = {
    ...openTaskEditors.value,
    [studentId]: !openTaskEditors.value[studentId],
  };
}

function closeTaskEditor(studentId) {
  openTaskEditors.value = {
    ...openTaskEditors.value,
    [studentId]: false,
  };
}

async function saveSupervisorRemark(task) {
  const nextRemark = String(remarkDrafts.value[task.studentId] || "").trim();
  if (nextRemark.length < 2) {
    notificationStore.addNotification({
      type: "warning",
      message: "Enter a proper remark before saving.",
    });
    return;
  }

  savingRemarkStudentId.value = task.studentId;
  try {
    await apolloClient.mutate({
      mutation: upsertTermReportRemarkMutation,
      variables: {
        input: {
          studentId: task.studentId,
          academicPeriod: task.academicPeriod,
          term: task.term,
          remark: nextRemark,
        },
      },
    });

    await refetchTodayOverview();
    closeTaskEditor(task.studentId);
    notificationStore.addNotification({
      type: "success",
      message: `Saved remark for ${task.studentName}.`,
    });
  } catch (error) {
    console.error("Failed to save supervisor term remark", error);
    notificationStore.addNotification({
      type: "error",
      message: error?.message || "Failed to save the supervisor remark.",
      timeout: 3500,
    });
  } finally {
    savingRemarkStudentId.value = "";
  }
}

watch(
  supervisorTasks,
  (tasks) => {
    const nextDrafts = {};
    tasks.forEach((task) => {
      nextDrafts[task.studentId] =
        remarkDrafts.value[task.studentId] ?? String(task.remark || "");
    });
    remarkDrafts.value = nextDrafts;
  },
  { immediate: true },
);

const nextClass = computed(() => {
  const classes = todayOverview.value?.nextClasses || [];
  return classes.length ? classes[0] : null;
});

const nextClassesPreview = computed(() => {
  const classes = todayOverview.value?.nextClasses || [];
  return Array.isArray(classes) ? classes.slice(0, 4) : [];
});

const moreClasses = computed(() => {
  const classes = nextClassesPreview.value || [];
  return classes.length > 1 ? classes.slice(1, 3) : [];
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
