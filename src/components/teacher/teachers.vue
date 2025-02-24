<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <!-- top -->
      <div class="border-b p-4">
        <TopList :txt="'All Teachers '" />
      </div>

      <LoadingScreen v-if="loading" message="Loading Teachers..." />

      <ErrorScreen v-else-if="error" />

      <EmptyState
        v-else-if="!teacherStore.teachers.length && !loading"
        icon="fa-regular fa-hourglass"
        heading="Nothing here yet!"
        description="Invite a teacher to get started."
      />
      <!-- list -->
      <div class="" v-else>
        <TeacherTable :columns="columns" :data="teacherStore?.teachers" />
      </div>

      <!-- pagination -->

      <Pagination
        :currentPage="currentPage"
        :hasMore="teacherStore.hasMore"
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
import TeacherTable from "./teacherTable.vue";
import LoadingScreen from "../loadingScreen.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useTeacherStore } from "../../store/teacherStore";

const limit = 10;
const currentPage = ref(1);
const teacherStore = useTeacherStore();
const loading = computed(() => teacherStore.loading);

watch(currentPage, (newPage) => {
  teacherStore.fetchTeachers({ page: newPage, limit });
});

function handlePageChange(newPage) {
  currentPage.value = newPage;
}

onMounted(() => {
  teacherStore.fetchTeachers();
});

const columns = [
  { header: "Info", accessor: "info" },
  {
    header: "Teacher Id",
    accessor: "teacherId",
    class: "hidden md:table-cell",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    class: "hidden md:table-cell",
  },
  {
    header: "Classes",
    accessor: "classes",
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
