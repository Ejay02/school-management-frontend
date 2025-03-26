<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <!-- top -->
      <div class="border-b p-4">
        <TopList :txt="'All Assignments'" />
      </div>

      <LoadingScreen v-if="loading" message="Loading Assignments..." />

      <ErrorScreen v-else-if="error" />

      <EmptyState
        v-else-if="!assignmentStore?.assignments?.length && !loading"
        icon="fa-regular fa-hourglass"
        heading="Nothing here yet!"
        description="Add assignment to get started."
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
import { useAssignmentStore } from "../../store/assignmentStore";
import { computed, onMounted, ref, watch } from "vue";

const limit = 10;
const currentPage = ref(1);
const assignmentStore = useAssignmentStore();
const loading = computed(() => assignmentStore.loading);
const error = computed(() => assignmentStore.error);

watch(currentPage, (newPage) => {
  assignmentStore.fetchAssignments({ page: newPage, limit });
});

function handlePageChange(newPage) {
  currentPage.value = newPage;
}

onMounted(() => {
  assignmentStore.fetchAssignments({ page: currentPage.value, limit });
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
