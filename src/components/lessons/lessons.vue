<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <!-- top -->
      <div class="border-b p-4">
        <TopList :txt="'All Lessons'" />
      </div>

      <LoadingScreen v-if="loading" message="Loading Lessons..." />

      <ErrorScreen v-else-if="error" />

      <EmptyState
        v-else-if="!lessonStore?.lessons?.length && !loading"
        icon="fa-regular fa-hourglass"
        heading="Nothing here yet!"
        description="Add a lesson to get started."
      />

      <!-- list -->
      <div class="" v-else>
        <LessonsTable :columns="columns" :data="lessonStore?.lessons" />
      </div>

      <!-- pagination -->
      <Pagination
        :currentPage="currentPage"
        :hasMore="lessonStore.hasMore"
        :totalPages="lessonStore.totalPages"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import TopList from "../lists/topList.vue";
import Pagination from "../pagination.vue";

import { computed, onMounted, ref, watch } from "vue";
import { useLessonStore } from "../../store/lessonStore";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";
import LessonsTable from "./lessonsTable.vue";

const limit = 10;
const currentPage = ref(1);
const lessonStore = useLessonStore();
const loading = computed(() => lessonStore.loading);
const error = computed(() => lessonStore.error);

watch(currentPage, (newPage) => {
  lessonStore.fetchLessons({ page: newPage, limit });
});

function handlePageChange(newPage) {
  currentPage.value = newPage;
}

onMounted(() => {
  lessonStore.fetchLessons({ page: currentPage.value, limit });
});

const columns = [
  {
    header: "Lesson Name",
    accessor: "lesson",
  },
  {
    header: "Subject Name",
    accessor: "subject",
    class: "hidden md:table-cell",
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
    header: "Actions",
    accessor: "action",
  },
];
</script>

<style scoped></style>
