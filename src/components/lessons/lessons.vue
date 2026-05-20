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
        message="Loading Lessons..."
      />

      <ParentLinkedStudentEmptyState
        v-else-if="shouldShowParentLinkEmptyState"
        description="Once the school links your child to this parent account, this page will start showing their lesson timetable."
      />

      <ErrorScreen v-else-if="error" />

      <EmptyState
        v-else-if="!lessonStore?.lessons?.length && !loading"
        icon="fa-regular fa-hourglass"
        :heading="emptyStateHeading"
        :description="emptyStateDescription"
      />

      <!-- list -->
      <div class="" v-else>
        <LessonsTable :columns="columns" :data="lessonStore?.lessons" />
      </div>

      <!-- pagination -->
      <Pagination
        v-if="!shouldShowParentLinkEmptyState"
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
import { useParentLinkedStudents } from "../../composables/useParentLinkedStudents";
import { useLessonStore } from "../../store/lessonStore";
import { useUserStore } from "../../store/userStore";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";
import ParentLinkedStudentEmptyState from "../parents/parentLinkedStudentEmptyState.vue";
import ParentChildSelector from "../parents/parentChildSelector.vue";
import LessonsTable from "./lessonsTable.vue";

const limit = 10;
const currentPage = ref(1);
const lessonStore = useLessonStore();
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
const loading = computed(() => lessonStore.loading);
const error = computed(() => lessonStore.error);
const pageTitle = computed(() =>
  role.value === "parent"
    ? `${parentLabel.value}'s Timetable`
    : role.value === "teacher"
      ? "My Lessons"
      : "All Lessons",
);
const parentLabel = computed(() => selectedStudentName.value || "My Child");
const emptyStateHeading = computed(() =>
  ["parent", "student"].includes(role.value)
    ? "No lessons yet"
    : "Nothing here yet!",
);
const emptyStateDescription = computed(() =>
  ["parent", "student"].includes(role.value)
    ? "Lessons will appear here once a timetable is available for the linked student."
    : "Add a lesson to get started.",
);

watch(currentPage, (newPage) => {
  if (shouldShowParentLinkEmptyState.value) return;
  lessonStore.fetchLessons({
    page: newPage,
    limit,
    studentId: selectedStudentId.value,
  });
});

watch(selectedStudentId, (studentId) => {
  if (!isParent.value || !studentId) return;
  currentPage.value = 1;
  lessonStore.fetchLessons({ page: 1, limit, studentId });
});

function handlePageChange(newPage) {
  currentPage.value = newPage;
}

onMounted(async () => {
  await fetchLinkedStudents();
  if (shouldShowParentLinkEmptyState.value) return;
  lessonStore.fetchLessons({
    page: currentPage.value,
    limit,
    studentId: selectedStudentId.value,
  });
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
