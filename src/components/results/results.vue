<template>
  <TeacherResults v-if="userRole === 'teacher'" />
  <ResultsTable v-else-if="userRole === 'admin' || userRole === 'super_admin'" />

  <div
    v-else-if="userRole === 'parent'"
    class="rounded border border-gray-300 p-2 w-full"
  >
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <div class="border-b p-4">
        <TopList :txt="pageTitle" />
      </div>

      <div
        v-if="hasLinkedStudents"
        class="border-b border-gray-100 px-4 py-3"
      >
        <ParentChildSelector />
      </div>

      <LoadingScreen
        v-if="parentCheckLoading || resultLoading"
        message="Loading results..."
      />

      <ParentLinkedStudentEmptyState
        v-else-if="parentCheckLoaded && !hasLinkedStudents"
        description="There’s nothing to show here yet. Once the school links your child to this parent account, this page will start showing their results."
      />

      <ErrorScreen v-else-if="resultError" />

      <EmptyState
        v-else-if="!studentResults.length"
        icon="fa-regular fa-file-lines"
        heading="No results yet"
        description="Results will appear here once your child's school publishes them."
      />

      <div v-else class="overflow-x-auto p-4">
        <table class="min-w-full bg-white rounded-lg overflow-hidden">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Subject
              </th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Assessment
              </th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Term
              </th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Period
              </th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Score
              </th>
              <th class="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Comment
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="result in studentResults"
              :key="result.id"
              class="hover:bg-gray-50"
            >
              <td class="py-3 px-4 text-sm text-gray-700">
                {{ getResultSubject(result) }}
              </td>
              <td class="py-3 px-4 text-sm text-gray-700">
                {{ getResultAssessment(result) }}
              </td>
              <td class="py-3 px-4 text-sm text-gray-700">
                {{ result.term || "N/A" }}
              </td>
              <td class="py-3 px-4 text-sm text-gray-700">
                {{ result.academicPeriod || "N/A" }}
              </td>
              <td class="py-3 px-4 text-sm font-medium text-gray-900">
                {{ typeof result.score === "number" ? `${result.score}%` : "N/A" }}
              </td>
              <td class="py-3 px-4 text-sm text-gray-700">
                {{ result.comments || "-" }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div v-else class="p-4 text-center text-gray-600">You don't have permission to view results.</div>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";

import { useParentLinkedStudents } from "../../composables/useParentLinkedStudents";
import { useResultStore } from "../../store/resultStore";
import { useUserStore } from "../../store/userStore";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import TopList from "../lists/topList.vue";
import LoadingScreen from "../loadingScreen.vue";
import ParentChildSelector from "../parents/parentChildSelector.vue";
import ParentLinkedStudentEmptyState from "../parents/parentLinkedStudentEmptyState.vue";
import ResultsTable from "./resultsTable.vue";
import TeacherResults from "./teacherResults.vue";

const userStore = useUserStore();
const resultStore = useResultStore();
const userRole = computed(() => userStore.currentRole?.toLowerCase());
const studentResults = computed(() => resultStore.studentResults);
const resultLoading = computed(() => resultStore.loading);
const resultError = computed(() => resultStore.error);
const {
  loaded: parentCheckLoaded,
  loading: parentCheckLoading,
  fetchLinkedStudents,
  hasLinkedStudents,
  selectedStudentId,
  selectedStudentName,
} = useParentLinkedStudents();

const pageTitle = computed(
  () => `${selectedStudentName.value || "My Child"}'s Results`
);

async function fetchParentResults() {
  if (!selectedStudentId.value) return;
  await resultStore.fetchStudentResults(selectedStudentId.value);
}

function getResultSubject(result) {
  return (
    result?.exam?.subject?.name ||
    result?.assignment?.subject?.name ||
    "General"
  );
}

function getResultAssessment(result) {
  return result?.exam?.title || result?.assignment?.title || result?.type || "Result";
}

onMounted(async () => {
  await fetchLinkedStudents();
  if (!hasLinkedStudents.value) return;
  await fetchParentResults();
});

watch(selectedStudentId, async (studentId) => {
  if (!studentId) return;
  await fetchParentResults();
});
</script>
