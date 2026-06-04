<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <div class="border-b p-4">
        <TopList txt="Submissions to Grade" />
      </div>

      <div
        class="mt-4 mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div class="text-sm text-gray-500">
          {{ summaryText }}
        </div>
        <div class="flex w-full max-w-md gap-2">
          <input
            v-model="searchQuery"
            placeholder="Search by student or assignment..."
            class="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-0 focus:border-eduPurple"
          />
          <button
            class="rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
            @click="resetSearch"
            :disabled="!searchQuery"
          >
            Clear
          </button>
        </div>
      </div>

      <LoadingScreen v-if="loading" message="Loading submissions..." />
      <ErrorScreen v-else-if="error" />

      <EmptyState
        v-else-if="!filteredSubmissions.length"
        icon="fa-solid fa-pen-to-square"
        heading="Nothing to grade right now"
        description="When students submit assignments, they’ll show up here for review."
      >
        <router-link
          to="/assignments"
          class="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Open assignments <i class="fa-solid fa-arrow-right"></i>
        </router-link>
      </EmptyState>

      <div v-else class="mt-4 overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Assignment
              </th>
              <th
                class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Student
              </th>
              <th
                class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Submitted
              </th>
              <th
                class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="submission in paginatedSubmissions"
              :key="submission.id"
              class="hover:bg-gray-50"
            >
              <td class="py-2 px-3 text-sm">
                <div class="font-medium text-gray-800">
                  {{ submission.assignment?.title || "Assignment" }}
                </div>
                <div class="mt-0.5 text-xs text-gray-500">
                  {{
                    submission.assignment?.class?.name
                      ? `${submission.assignment.class.name} • `
                      : ""
                  }}
                  {{ submission.assignment?.subject?.name || "" }}
                </div>
              </td>
              <td class="py-2 px-3 text-sm">
                <div class="flex items-center gap-2">
                  <img
                    :src="submission.student?.image || '/avatar.png'"
                    alt="Student"
                    class="h-7 w-7 rounded-full object-cover"
                  />
                  <div class="min-w-0">
                    <div class="font-medium text-gray-800 truncate">
                      {{ submission.student?.name }}
                      {{ submission.student?.surname }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-2 px-3 text-sm text-gray-500 hidden md:table-cell">
                {{ formatSubmittedDate(submission.submissionDate) }}
              </td>
              <td class="py-2 px-3 text-sm">
                <span
                  class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                  :class="statusChipClass(submission.status)"
                >
                  {{ normalizeStatus(submission.status) }}
                </span>
              </td>
              <td class="py-2 px-3 text-sm text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    class="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                    @click="openGradeReview(submission)"
                  >
                    Grade <i class="fa-solid fa-check"></i>
                  </button>
                  <router-link
                    :to="`/assignment/${submission.assignment?.id}`"
                    class="inline-flex items-center gap-2 rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                  >
                    Open <i class="fa-solid fa-arrow-right"></i>
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <Pagination
          :currentPage="currentPage"
          :hasMore="hasMore"
          :totalPages="totalPages"
          @update:page="handlePageChange"
        />
      </div>
    </div>
  </div>

  <div
    v-if="selectedSubmission"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4"
    @click.self="closeGradeReview"
  >
    <div class="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
      <div
        class="flex items-center justify-between border-b border-gray-200 px-6 py-4"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Grade submission</h2>
          <p class="mt-1 text-sm text-gray-500">
            Review the student's work, record a score, and publish teacher
            feedback.
          </p>
        </div>
        <button
          type="button"
          class="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          @click="closeGradeReview"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div
        class="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]"
      >
        <div class="space-y-5">
          <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-900">
                  {{ selectedSubmission.assignment?.title || "Assignment" }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  {{ studentLabel(selectedSubmission) }}
                </p>
              </div>
              <span
                class="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
              >
                {{ normalizeStatus(selectedSubmission.status) }}
              </span>
            </div>

            <div class="mt-4 grid gap-3 text-sm text-gray-600 md:grid-cols-2">
              <div>
                <div
                  class="text-xs font-medium uppercase tracking-wide text-gray-400"
                >
                  Class
                </div>
                <div class="mt-1">
                  {{ selectedSubmission.assignment?.class?.name || "Not set" }}
                </div>
              </div>
              <div>
                <div
                  class="text-xs font-medium uppercase tracking-wide text-gray-400"
                >
                  Subject
                </div>
                <div class="mt-1">
                  {{
                    selectedSubmission.assignment?.subject?.name || "Not set"
                  }}
                </div>
              </div>
              <div>
                <div
                  class="text-xs font-medium uppercase tracking-wide text-gray-400"
                >
                  Submitted
                </div>
                <div class="mt-1">
                  {{ formatSubmittedDate(selectedSubmission.submissionDate) }}
                </div>
              </div>
              <div>
                <div
                  class="text-xs font-medium uppercase tracking-wide text-gray-400"
                >
                  Due date
                </div>
                <div class="mt-1">
                  {{ formatShortDate(selectedSubmission.assignment?.dueDate) }}
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-4">
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-sm font-semibold text-gray-900">
                Student submission
              </h3>
              <a
                v-if="submissionLooksLikeLink(selectedSubmission.content)"
                :href="selectedSubmission.content"
                target="_blank"
                rel="noreferrer"
                class="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Open attachment
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>

            <div
              v-if="selectedSubmission.content"
              class="mt-3 max-h-[360px] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700 whitespace-pre-wrap"
            >
              {{ selectedSubmission.content }}
            </div>
            <div
              v-else
              class="mt-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500"
            >
              The student submitted without written content. Use the assignment
              link if you need the full assignment context before grading.
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-4">
          <h3 class="text-sm font-semibold text-gray-900">Grade details</h3>
          <p class="mt-1 text-sm text-gray-500">
            Save a score and optional feedback. This marks the submission as
            graded and records an official result.
          </p>

          <div class="mt-4 space-y-4">
            <div>
              <label
                for="submission-score"
                class="block text-sm font-medium text-gray-700"
              >
                Score (%)
              </label>
              <input
                id="submission-score"
                v-model="gradeForm.score"
                type="number"
                min="0"
                max="100"
                placeholder="0 - 100"
                class="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-eduPurple focus:outline-none focus:ring-0"
              />
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-lg bg-gray-50 p-3">
                <div
                  class="text-xs font-medium uppercase tracking-wide text-gray-400"
                >
                  Academic period
                </div>
                <div class="mt-1 text-sm text-gray-700">
                  {{ resolvedAcademicPeriod || "Will be left blank" }}
                </div>
              </div>
              <div class="rounded-lg bg-gray-50 p-3">
                <div
                  class="text-xs font-medium uppercase tracking-wide text-gray-400"
                >
                  Current term
                </div>
                <div class="mt-1 text-sm text-gray-700">
                  {{ resolvedTerm || "Will be left blank" }}
                </div>
              </div>
            </div>

            <div>
              <label
                for="submission-comments"
                class="block text-sm font-medium text-gray-700"
              >
                Teacher feedback
              </label>
              <textarea
                id="submission-comments"
                v-model="gradeForm.comments"
                rows="6"
                placeholder="Share clear feedback with the student..."
                class="mt-1 w-full rounded-md border border-gray-300 p-3 text-sm focus:border-eduPurple focus:outline-none focus:ring-0"
              ></textarea>
            </div>

            <div
              v-if="gradeFormError"
              class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {{ gradeFormError }}
            </div>

            <div
              class="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-4"
            >
              <button
                type="button"
                class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                @click="closeGradeReview"
              >
                Cancel
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="grading"
                @click="submitGrade"
              >
                <span
                  v-if="grading"
                  class="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-white"
                ></span>
                {{ grading ? "Saving grade..." : "Save grade" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import TopList from "../lists/topList.vue";
import LoadingScreen from "../loadingScreen.vue";
import ErrorScreen from "../errorScreen.vue";
import EmptyState from "../emptyState.vue";
import Pagination from "../pagination.vue";
import {
  getSetupStateQuery,
  getTeacherPendingSubmissions,
} from "../../graphql/queries";
import { gradeSubmissionMutation } from "../../graphql/mutations";
import { useNotificationStore } from "../../store/notification";
import { extractGraphQLErrorMessage } from "../../utils/graphqlError";

const pageSize = 10;
const currentPage = ref(1);
const searchQuery = ref("");
const selectedSubmission = ref(null);
const gradeForm = ref({
  score: "",
  comments: "",
});
const gradeFormError = ref("");
const notificationStore = useNotificationStore();

const { result, loading, error, refetch } = useQuery(
  getTeacherPendingSubmissions,
  {
    params: {
      page: 1,
      limit: 1000,
      sortBy: "submissionDate",
      sortOrder: "DESC",
    },
  },
  { fetchPolicy: "network-only" },
);
const { result: setupResult } = useQuery(getSetupStateQuery, null, {
  fetchPolicy: "cache-first",
});
const { mutate: gradeSubmission, loading: grading } = useMutation(
  gradeSubmissionMutation,
);

const submissions = computed(() => {
  const items = result.value?.getTeacherPendingSubmissions || [];
  return Array.isArray(items) ? items : [];
});

const filteredSubmissions = computed(() => {
  const q = String(searchQuery.value || "")
    .trim()
    .toLowerCase();
  if (!q) return submissions.value;

  return submissions.value.filter((s) => {
    const studentName = `${s?.student?.name || ""} ${s?.student?.surname || ""}`
      .trim()
      .toLowerCase();
    const assignmentTitle = String(s?.assignment?.title || "").toLowerCase();
    return studentName.includes(q) || assignmentTitle.includes(q);
  });
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredSubmissions.value.length / pageSize)),
);

const hasMore = computed(() => currentPage.value < totalPages.value);

const paginatedSubmissions = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredSubmissions.value.slice(start, end);
});

const summaryText = computed(() => {
  if (loading.value) return "Loading grading queue...";
  const count = filteredSubmissions.value.length;
  if (!count) return "No pending submissions.";
  return `${count} submission${count === 1 ? "" : "s"} waiting for grading.`;
});

const setupState = computed(() => setupResult.value?.getSetupState || null);

const resolvedAcademicPeriod = computed(() => {
  const current = String(setupState.value?.academicYearCurrent || "").trim();
  const next = String(setupState.value?.academicYearNext || "").trim();
  if (current && next) return `${current}/${next}`;

  const now = new Date();
  const year = now.getFullYear();
  const schoolYearStart = now.getMonth() >= 7 ? year : year - 1;
  return `${schoolYearStart}/${schoolYearStart + 1}`;
});

const resolvedTerm = computed(() => {
  const raw = String(setupState.value?.currentTerm || "")
    .trim()
    .toUpperCase();
  return raw || null;
});

const resetSearch = () => {
  searchQuery.value = "";
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

watch(searchQuery, () => {
  currentPage.value = 1;
});

const openGradeReview = (submission) => {
  selectedSubmission.value = submission;
  gradeForm.value = {
    score:
      typeof submission?.result?.score === "number"
        ? String(submission.result.score)
        : "",
    comments: submission?.result?.comments || "",
  };
  gradeFormError.value = "";
};

const closeGradeReview = () => {
  selectedSubmission.value = null;
  gradeForm.value = { score: "", comments: "" };
  gradeFormError.value = "";
};

const studentLabel = (submission) =>
  `${submission?.student?.name || ""} ${submission?.student?.surname || ""}`
    .trim()
    .replace(/\s+/g, " ");

const submissionLooksLikeLink = (value) =>
  /^https?:\/\//i.test(String(value || "").trim());

const normalizeStatus = (status) => {
  const s = String(status || "")
    .trim()
    .toUpperCase();
  return s || "SUBMITTED";
};

const statusChipClass = (status) => {
  const s = normalizeStatus(status);
  if (s === "GRADED") return "bg-emerald-50 text-emerald-700";
  if (s === "LATE") return "bg-amber-50 text-amber-800";
  return "bg-indigo-50 text-indigo-700";
};

const formatSubmittedDate = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatShortDate = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const submitGrade = async () => {
  if (!selectedSubmission.value) return;

  const numericScore = Number(gradeForm.value.score);
  if (
    !Number.isFinite(numericScore) ||
    numericScore < 0 ||
    numericScore > 100
  ) {
    gradeFormError.value = "Enter a score between 0 and 100.";
    return;
  }

  gradeFormError.value = "";

  try {
    await gradeSubmission({
      input: {
        submissionId: selectedSubmission.value.id,
        score: Math.round(numericScore),
        comments: gradeForm.value.comments?.trim() || null,
        academicPeriod: resolvedAcademicPeriod.value || null,
        term: resolvedTerm.value || null,
      },
    });

    await refetch();
    notificationStore.addNotification({
      type: "success",
      message: `Grade saved for ${studentLabel(selectedSubmission.value)}.`,
    });
    closeGradeReview();
  } catch (mutationError) {
    gradeFormError.value = extractGraphQLErrorMessage(
      mutationError,
      "Unable to save grade",
    );
  }
};
</script>

<style scoped></style>
