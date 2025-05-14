<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <!-- top -->
      <div class="border-b p-4">
        <TopList :txt="'All Subjects'" />
      </div>

      <LoadingScreen v-if="loading" message="Loading Subjects..." />

      <ErrorScreen v-else-if="error" />

      <EmptyState
        v-else-if="!subjectStore.subjects.length && !loading"
        icon="fa-regular fa-hourglass"
        heading="Nothing here yet!"
        description="Add subject to get started."
      />

      <!-- list -->
      <div class="" v-else>
        <SubjectTable :columns="columns" :data="subjectStore.subjects" />
      </div>

      <!-- pagination -->
      <Pagination
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
import { useSubjectStore } from "../../store/subjectStore";
import { useUserStore } from "../../store/userStore";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";
import SubjectTable from "./subjectTable.vue";

const limit = 10;
const currentPage = ref(1);

const subjectStore = useSubjectStore();
const userStore = useUserStore();

const role = userStore.currentRole;

const error = computed(() => subjectStore.error);

const loading = computed(() => subjectStore.loading);

watch(currentPage, (newPage) => {
  subjectStore.fetchSubjects({ page: newPage, limit });
});

function handlePageChange(newPage) {
  currentPage.value = newPage;
}

onMounted(() => {
  subjectStore.fetchSubjects({ page: currentPage.value, limit });
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
  ...(role.toLowerCase() === "teacher" ||
  role.toLowerCase() === "admin" ||
  role.toLowerCase() === "super_admin"
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
