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
        message="Loading Assignments..."
      />

      <ParentLinkedStudentEmptyState
        v-else-if="shouldShowParentLinkEmptyState"
        description="Once the school links your child to this parent account, this page will start showing homework, coursework, and due dates."
      />

      <ErrorScreen v-else-if="error" />

      <EmptyState
        v-else-if="!assignmentStore?.assignments?.length && !loading"
        icon="fa-regular fa-hourglass"
        :heading="emptyStateHeading"
        :description="emptyStateDescription"
      />

      <!-- list -->
      <div class="" v-else>
        <AssignmentsTable
          :columns="columns"
          :data="assignmentStore?.assignments"
        />
      </div>

      <!-- pagination -->
      <Pagination
        v-if="!shouldShowParentLinkEmptyState"
        :currentPage="currentPage"
        :hasMore="assignmentStore?.hasMore"
        :totalPages="assignmentStore.totalPages"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import TopList from "../lists/topList.vue";
import Pagination from "../pagination.vue";

import AssignmentsTable from "./assignmentsTable.vue";
import LoadingScreen from "../loadingScreen.vue";
import ErrorScreen from "../errorScreen.vue";
import EmptyState from "../emptyState.vue";
import ParentLinkedStudentEmptyState from "../parents/parentLinkedStudentEmptyState.vue";
import ParentChildSelector from "../parents/parentChildSelector.vue";
import { useParentLinkedStudents } from "../../composables/useParentLinkedStudents";
import { useAssignmentStore } from "../../store/assignmentStore";
import { useUserStore } from "../../store/userStore";
import { computed, onMounted, ref, watch } from "vue";

const limit = 10;
const currentPage = ref(1);
const assignmentStore = useAssignmentStore();
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
const role = computed(() => userStore.currentRole?.toLowerCase());
const loading = computed(() => assignmentStore.loading);
const error = computed(() => assignmentStore.error);
const pageTitle = computed(() =>
  role.value === "parent"
    ? `${parentLabel.value}'s Schoolwork`
    : "All Assignments",
);
const parentLabel = computed(() => selectedStudentName.value || "My Child");
const emptyStateHeading = computed(() =>
  ["parent", "student"].includes(role.value)
    ? "No assignments yet"
    : "Nothing here yet!",
);
const emptyStateDescription = computed(() =>
  ["parent", "student"].includes(role.value)
    ? "Assignments will appear here once work is shared for the linked student."
    : "Add assignment to get started.",
);

watch(currentPage, (newPage) => {
  if (shouldShowParentLinkEmptyState.value) return;
  assignmentStore.fetchAssignments({
    page: newPage,
    limit,
    studentId: selectedStudentId.value,
  });
});

watch(selectedStudentId, (studentId) => {
  if (!isParent.value || !studentId) return;
  currentPage.value = 1;
  assignmentStore.fetchAssignments({ page: 1, limit, studentId });
});

function handlePageChange(newPage) {
  currentPage.value = newPage;
}

onMounted(async () => {
  await fetchLinkedStudents();
  if (shouldShowParentLinkEmptyState.value) return;
  assignmentStore.fetchAssignments({
    page: currentPage.value,
    limit,
    studentId: selectedStudentId.value,
  });
});

const columns = [
  {
    header: "Subject Name",
    accessor: "subject",
  },
  {
    header: "Class",
    accessor: "class",
    class: "hidden md:table-cell",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    class: "hidden md:table-cell",
  },
  {
    header: "Due Date",
    accessor: "dueDate",
    class: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];
</script>

<style scoped></style>
