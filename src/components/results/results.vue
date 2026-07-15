<template>
  <div v-if="userRole === 'teacher'" class="w-full space-y-4">
    <!-- Teacher view sub-tab navigation -->
    <div class="flex border-b border-gray-200 bg-white px-4 py-2 rounded-lg shadow-sm gap-6">
      <button
        @click="activeTeacherTab = 'summary'"
        class="pb-2 text-sm font-semibold transition"
        :class="activeTeacherTab === 'summary' ? 'border-b-2 border-indigo-600 text-indigo-650' : 'text-gray-500 hover:text-gray-700'"
      >
        Term Summary
      </button>
      <button
        @click="activeTeacherTab = 'gradebook'"
        class="pb-2 text-sm font-semibold transition"
        :class="activeTeacherTab === 'gradebook' ? 'border-b-2 border-indigo-600 text-indigo-650' : 'text-gray-500 hover:text-gray-700'"
      >
        Gradebook Grid
      </button>
    </div>

    <TeacherResults v-if="activeTeacherTab === 'summary'" />
    <GradebookGrid v-else />
  </div>
  <div v-else-if="userRole === 'admin' || userRole === 'super_admin'" class="w-full space-y-4">
    <ResultsTable />
    <TermReports />
  </div>

  <div
    v-else-if="userRole === 'parent'"
    class="rounded border border-gray-300 p-2 w-full"
  >
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl space-y-4">
      <div class="border-b p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <TopList :txt="pageTitle" />
        <div class="flex rounded-md shadow-sm border border-gray-200 p-0.5 bg-gray-50 self-start sm:self-auto">
          <button
            @click="activeParentTab = 'dashboard'"
            class="px-4 py-1.5 rounded-md text-xs font-semibold transition"
            :class="activeParentTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:text-indigo-650'"
          >
            Academic Progress
          </button>
          <button
            @click="activeParentTab = 'history'"
            class="px-4 py-1.5 rounded-md text-xs font-semibold transition"
            :class="activeParentTab === 'history' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:text-indigo-650'"
          >
            Results History
          </button>
        </div>
      </div>

      <div
        v-if="hasLinkedStudents"
        class="border-b border-gray-100 px-4 py-2"
      >
        <ParentChildSelector />
      </div>

      <Transition name="slide" mode="out-in">
        <div :key="activeParentTab" class="w-full">
          <template v-if="activeParentTab === 'dashboard'">
            <ParentProgressDashboard v-if="hasLinkedStudents" />
            <ParentLinkedStudentEmptyState
              v-else
              description="There’s nothing to show here yet. Once the school links your child to this parent account, this page will start showing their results."
            />
          </template>

          <template v-else>
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
          </template>
        </div>
      </Transition>
    </div>
  </div>

  <div v-else class="p-4 text-center text-gray-600">You don't have permission to view results.</div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";

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
import TermReports from "./termReports.vue";
import TeacherResults from "./teacherResults.vue";
import GradebookGrid from "./gradebookGrid.vue";
import ParentProgressDashboard from "./parentProgressDashboard.vue";

const userStore = useUserStore();
const resultStore = useResultStore();
const userRole = computed(() => userStore.currentRole?.toLowerCase());
const activeTeacherTab = ref("summary");
const activeParentTab = ref("dashboard");
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

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
