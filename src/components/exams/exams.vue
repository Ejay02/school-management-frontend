<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <!-- top -->
      <div class="border-b p-4">
        <TopList :txt="'All Exams'" />
      </div>

      <LoadingScreen v-if="loading" message="Loading Exams..." />

      <ErrorScreen v-else-if="error" />

      <EmptyState
        v-else-if="!examStore?.exams?.length && !loading"
        icon="fa-solid fa-file-pen"
        heading="Nothing here yet!"
        description="No exam found."
      />

      <!-- list -->
      <div class="" v-else>
        <ExamsTable :columns="columns" :data="examStore?.exams" />
      </div>

      <!-- pagination -->
      <Pagination
        :currentPage="currentPage"
        :hasMore="examStore?.hasMore"
        :totalPages="examStore.totalPages"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import TopList from "../lists/topList.vue";
import Pagination from "../pagination.vue";

import { computed, onMounted, ref, watch } from "vue";
import { useExamStore } from "../../store/examStore";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";
import ExamsTable from "./examsTable.vue";

const limit = 10;
const currentPage = ref(1);
const examStore = useExamStore();
const loading = computed(() => examStore.loading);
const error = computed(() => examStore.error);

function handlePageChange(newPage) {
  currentPage.value = newPage;
}

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
    header: "Date",
    accessor: "date",
    class: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

watch(currentPage, (newPage) => {
  examStore.fetchExams({ page: newPage, limit });
});

onMounted(() => {
  examStore.fetchExams({ page: currentPage.value, limit });
});
</script>

<style scoped></style>
