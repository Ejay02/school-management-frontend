<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <!-- top -->
      <div class="border-b p-4">
        <TopList :txt="'All Parents'" />
      </div>

      <LoadingScreen v-if="loading" message="Loading Parents..." />

      <ErrorScreen v-else-if="error" />

      <EmptyState
        v-else-if="!parentStore.parents.length && !loading"
        icon="fa-regular fa-hourglass"
        heading="Nothing here yet!"
        description="Invite a parent to get started."
      />

      <!-- list -->
      <div class="" v-else>
        <ParentsTable :columns="columns" :data="parentStore?.parents" />
      </div>

      <!-- pagination -->

      <Pagination
        :currentPage="currentPage"
        :hasMore="parentStore.hasMore"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import TopList from "../lists/topList.vue";
import Pagination from "../pagination.vue";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import ParentsTable from "./parentsTable.vue";
import LoadingScreen from "../loadingScreen.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useParentStore } from "../../store/parentStore";

const limit = 10;
const currentPage = ref(1);
const parentStore = useParentStore();
const error = computed(() => parentStore.error);
const loading = computed(() => parentStore.loading);

watch(currentPage, (newPage) => {
  parentStore.fetchParents({ page: newPage, limit });
});

function handlePageChange(newPage) {
  currentPage.value = newPage;
}

onMounted(() => {
  parentStore.fetchParents();
});

const columns = [
  { header: "Info", accessor: "info" },
  {
    header: "Student Name",
    accessor: "students",
    class: "hidden md:table-cell",
  },

  {
    header: "Phone",
    accessor: "phone",
    class: "hidden md:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    class: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];
</script>

<style scoped></style>
