<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <!-- top -->
      <div class="border-b p-4">
        <TopList :txt="pageTitle" />
      </div>

      <div
        v-if="isParent && hasLinkedStudents"
        class="border-b border-gray-100 px-4 py-3"
      >
        <ParentChildSelector />
      </div>

      <LoadingScreen
        v-if="
          (isParent && !isParentCheckLoaded) || isParentCheckLoading || loading
        "
        message="Loading Subjects..."
      />

      <ParentLinkedStudentEmptyState
        v-else-if="shouldShowParentLinkEmptyState"
        resource-label="subjects"
      />

      <ErrorScreen v-else-if="error" />

      <EmptyState
        v-else-if="!subjectStore.subjects.length && !loading"
        icon="fa-regular fa-hourglass"
        :heading="emptyStateHeading"
        :description="emptyStateDescription"
      />

      <!-- list -->
      <div class="" v-else>
        <SubjectTable :columns="columns" :data="subjectStore.subjects" />
      </div>

      <!-- pagination -->
      <Pagination
        v-if="!shouldShowParentLinkEmptyState"
        :currentPage="currentPage"
        :hasMore="subjectStore.hasMore"
        :totalPages="subjectStore.totalPages"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import TopList from "../lists/topList.vue";
import Pagination from "../pagination.vue";

import { computed, onMounted, ref, watch } from "vue";
import { useParentLinkedStudents } from "../../composables/useParentLinkedStudents";
import { useSubjectStore } from "../../store/subjectStore";
import { useUserStore } from "../../store/userStore";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";
import ParentLinkedStudentEmptyState from "../parents/parentLinkedStudentEmptyState.vue";
import ParentChildSelector from "../parents/parentChildSelector.vue";
import SubjectTable from "./subjectTable.vue";

const limit = 10;
const currentPage = ref(1);

const subjectStore = useSubjectStore();
const userStore = useUserStore();
const {
  isParent,
  loaded: isParentCheckLoaded,
  loading: isParentCheckLoading,
  fetchLinkedStudents,
  hasLinkedStudents,
  selectedStudentId,
  selectedStudentName,
  shouldShowParentLinkEmptyState,
} = useParentLinkedStudents();

const role = userStore.currentRole;

const error = computed(() => subjectStore.error);

const loading = computed(() => subjectStore.loading);
const pageTitle = computed(() =>
  role.toLowerCase() === "parent"
    ? `${parentLabel.value}'s Subjects`
    : role.toLowerCase() === "teacher"
      ? "My Subjects"
      : "All Subjects",
);
const parentLabel = computed(() => selectedStudentName.value || "My Child");
const emptyStateHeading = computed(() =>
  ["parent", "student"].includes(role.toLowerCase())
    ? "No subjects yet"
    : "Nothing here yet!",
);
const emptyStateDescription = computed(() =>
  ["parent", "student"].includes(role.toLowerCase())
    ? "Subjects will appear here once classes are available for the linked student."
    : "Add subject to get started.",
);

watch(currentPage, (newPage) => {
  if (shouldShowParentLinkEmptyState.value) return;
  subjectStore.fetchSubjects({
    page: newPage,
    limit,
    studentId: selectedStudentId.value,
  });
});

watch(selectedStudentId, (studentId) => {
  if (!isParent.value || !studentId) return;
  currentPage.value = 1;
  subjectStore.fetchSubjects({ page: 1, limit, studentId });
});

function handlePageChange(newPage) {
  currentPage.value = newPage;
}

onMounted(async () => {
  await fetchLinkedStudents();
  if (shouldShowParentLinkEmptyState.value) return;
  subjectStore.fetchSubjects({
    page: currentPage.value,
    limit,
    studentId: selectedStudentId.value,
  });
});

const columns = [
  {
    header: "Subject Name",
    accessor: "name",
  },

  {
    header: "Teachers",
    accessor: "teachers",
    class: "hidden md:table-cell",
  },
  ...(role.toLowerCase() === "admin" || role.toLowerCase() === "super_admin"
    ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
    : []),
];
</script>

<style scoped></style>
