<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <div class="border-b p-4">
        <TopList txt="Submissions to Grade" />
      </div>

      <div class="mt-4 mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
              <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignment
              </th>
              <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Submitted
              </th>
              <th class="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      {{ submission.student?.name }} {{ submission.student?.surname }}
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
                <router-link
                  :to="`/assignment/${submission.assignment?.id}`"
                  class="inline-flex items-center gap-2 rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                >
                  Review <i class="fa-solid fa-arrow-right"></i>
                </router-link>
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
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useQuery } from "@vue/apollo-composable";
import TopList from "../lists/topList.vue";
import LoadingScreen from "../loadingScreen.vue";
import ErrorScreen from "../errorScreen.vue";
import EmptyState from "../emptyState.vue";
import Pagination from "../pagination.vue";
import { getTeacherPendingSubmissions } from "../../graphql/queries";

const pageSize = 10;
const currentPage = ref(1);
const searchQuery = ref("");

const { result, loading, error } = useQuery(
  getTeacherPendingSubmissions,
  {
    params: { page: 1, limit: 1000, sortBy: "submissionDate", sortOrder: "DESC" },
  },
  { fetchPolicy: "network-only" },
);

const submissions = computed(() => {
  const items = result.value?.getTeacherPendingSubmissions || [];
  return Array.isArray(items) ? items : [];
});

const filteredSubmissions = computed(() => {
  const q = String(searchQuery.value || "").trim().toLowerCase();
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

const resetSearch = () => {
  searchQuery.value = "";
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

watch(searchQuery, () => {
  currentPage.value = 1;
});

const normalizeStatus = (status) => {
  const s = String(status || "").trim().toUpperCase();
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
</script>

<style scoped></style>

