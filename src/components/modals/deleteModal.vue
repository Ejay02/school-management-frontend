<template>
  <transition name="fade">
    <div
      v-if="isModalVisible"
      class="fixed top-0 left-0 w-full h-full bg-gray-900/80 flex justify-center items-center z-50"
      @click.self="handleCancel"
      :key="isModalVisible"
    >
      <div
        class="bg-white p-6 rounded-md w-[450px] h-auto min-h-[180px] mt-4 shadow-md"
      >
        <!--  -->

        <div class="flex items-center">
          <!-- Icon (using an inline SVG for the exclamation triangle) -->
          <svg
            class="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01m-6.938 4h13.856c1.054 0 1.918-.816 1.995-1.855L21 4.145A1.993 1.993 0 0019.057 3H4.943A1.993 1.993 0 003 4.145l-.005 13.999C2.075 19.184 2.94 20 3.994 20z"
            />
          </svg>
          <h3 class="ml-2 text-lg font-medium text-gray-900">
            Delete Confirmation
          </h3>
        </div>

        <div class="mt-4">
          <p class="text-gray-600 text-sm">
            Are you sure you want to delete
            <b class="capitalize">{{ title }}</b> ? This action cannot be
            undone.
          </p>
        </div>
        <div class="mt-8 flex justify-end gap-3">
          <button
            class="bg-white border border-gray-300 text-gray-600 py-2 px-5 rounded-md cursor-pointer"
            @click="handleCancel"
          >
            Cancel
          </button>
          <button
            class="bg-red-500 text-white py-2 px-5 rounded-md cursor-pointer"
            @click="handleDelete"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useModalStore } from "@/store/useModalStore";
import { ref, watch } from "vue";
import { apolloClient } from "../../../apollo-client";
import { deleteClass, deleteLesson, deleteSubject } from "../../graphql/mutations";
import { useClassStore } from "../../store/classStore";
import { useLessonStore } from "../../store/lessonStore";
import { useNotificationStore } from "../../store/notification";
import { useSubjectStore } from "../../store/subjectStore";

const modalStore = useModalStore();
const classStore = useClassStore();
const subjectStore = useSubjectStore();
const lessonStore = useLessonStore();

const notificationStore = useNotificationStore();

const isModalVisible = ref(modalStore.deleteModal);

const title = ref(modalStore.modalTitle);
const source = ref(modalStore.source);

watch(
  () => modalStore.deleteModal,
  (newVal) => {
    isModalVisible.value = newVal;
  },
  { immediate: true }
);

watch(
  () => modalStore.modalTitle,
  (newVal) => {
    title.value = newVal;
  }
);

watch(
  () => modalStore.source,
  (newVal) => {
    source.value = newVal;
  }
);

const handleCancel = () => {
  modalStore.deleteModal = false;
  modalStore.modalId = null;
};

const handleDelete = async () => {
  try {
    if (source.value === "teacherList") {
      console.log("hello from teachers");
    } else if (source.value === "parentList") {
      console.log("hello from parents");
    } else if (source.value === "studentList") {
      console.log("hello from students");
    } else if (source.value === "classList") {
      await apolloClient.mutate({
        mutation: deleteClass,
        variables: {
          classId: modalStore.modalId,
        },
      });
      await classStore.refreshClasses();

      notificationStore.addNotification({
        type: "success",
        message: "Class deleted successfully",
      });
    } else if (source.value === "subjectList") {
      await apolloClient.mutate({
        mutation: deleteSubject,
        variables: {
          subjectId: modalStore.modalId,
        },
      });

      await subjectStore.refreshSubjects();

      notificationStore.addNotification({
        type: "success",
        message: "Subject deleted successfully",
      });
    } else if (source.value === "lessonList") {
      await apolloClient.mutate({
        mutation: deleteLesson,
        variables: {
          lessonId: modalStore.modalId,
        },
      });

      await lessonStore.refreshLessons();
      notificationStore.addNotification({
        type: "success",
        message: "Lesson deleted successfully",
      });
    } else if (source.value === "examList") {
      console.log("hello from exams");
    } else if (source.value === "assignmentList") {
      console.log("hello from assignments");
    } else if (source.value === "resultList") {
      console.log("hello from results");
    } else if (source.value === "eventList") {
      console.log("hello from events");
    } else if (source.value === "announcementList") {
      console.log("hello from announcements");
    }
    modalStore.deleteModal = false;
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Error deleting ${title.value}: ${error.message}`,
    });
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
