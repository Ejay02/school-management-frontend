<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <!-- top -->
      <div class="border-b p-4">
        <TopList :txt="'All Classes'" />
      </div>

      <LoadingScreen v-if="loading" message="Loading Classes..." />

      <ErrorScreen v-else-if="error" />

      <EmptyState
        v-else-if="!classStore.classes.length && !loading"
        icon="fa-regular fa-hourglass"
        heading="Nothing here yet!"
        description="Add a class to get started."
      />

      <!-- list -->
      <div class="" v-else>
        <ClassesTable :columns="columns" :data="classStore.classes" />
      </div>

      <!-- pagination -->
      <Pagination
        :currentPage="currentPage"
        :hasMore="classStore.hasMore"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import TopList from "../lists/topList.vue";
import Pagination from "../pagination.vue";

import { computed, onMounted, ref, watch } from "vue";
import { useClassStore } from "../../store/classStore";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";
import ClassesTable from "./classesTable.vue";

const limit = 10;
const searchQuery = ref("");
const filterStatus = ref("all");
const currentPage = ref(1);
const pageSize = ref(10);

const classStore = useClassStore();
const loading = computed(() => classStore.loading);
const error = computed(() => classStore.error);

watch(currentPage, (newPage) => {
  classStore.fetchClasses({ page: newPage, limit });
});

function handlePageChange(newPage) {
  currentPage.value = newPage;
}

onMounted(() => {
  classStore.fetchClasses({ page: currentPage.value, limit });
});

const columns = [
  {
    header: "Class Name",
    accessor: "name",
  },
  {
    header: "Capacity",
    accessor: "capacity",
    class: "hidden md:table-cell",
  },
  {
    header: "Count",
    accessor: "count",
    class: "hidden md:table-cell",
  },
  {
    header: "Supervisor",
    accessor: "supervisor",
    class: "hidden md:table-cell",
  },
  {
    header: "Academic Year",
    accessor: "year",
    class: "hidden md:table-cell",
  },
  {
    header: "Tuition",
    accessor: "tuition",
    class: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];
</script>

<style scoped></style>
