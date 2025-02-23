<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <!-- top -->
      <div class="border-b p-4">
        <TopList :txt="'All Students'" />
      </div>

      <LoadingScreen v-if="loading" message="Loading Students..." />

      <EmptyState
        v-if="!studentStore?.students.length && !loading"
        icon="fa-regular fa-hourglass"
        heading="Nothing here yet!"
        description="Invite a student to get started."
      />

      <ErrorScreen v-else-if="error" />

      <!-- list -->
      <div class="" v-else>
        <StudentTable :columns="columns" :data="studentStore?.students" />
      </div>

      <!-- pagination -->

      <Pagination
        :currentPage="currentPage"
        :hasMore="studentStore.hasMore"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useStudentStore } from "../../store/studentStore";
import TopList from "../lists/topList.vue";
import Pagination from "../pagination.vue";
// import { studentsData } from "../../utils/data";
import StudentTable from "./studentTable.vue";
import LoadingScreen from "../loadingScreen.vue";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";

const limit = 10;
const currentPage = ref(1);
const studentStore = useStudentStore();
const loading = computed(() => studentStore.loading);
const error = computed(() => studentStore.error);

watch(currentPage, (newPage) => {
  studentStore.fetchStudents({ page: newPage, limit });
});

function handlePageChange(newPage) {
  currentPage.value = newPage;
}

onMounted(() => {
  studentStore.fetchStudents();
});

const columns = [
  { header: "Info", accessor: "info" },
  {
    header: "Student Id",
    accessor: "studentId",
    class: "hidden md:table-cell",
  },
  {
    header: "Class",
    accessor: "class",
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
