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
            class="bg-white border border-gray-300 text-gray-600 py-2 px-5 rounded-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            @click="handleCancel"
            :disabled="isLoading"
          >
            Cancel
          </button>
          <button
            class="bg-red-500 text-white py-2 px-5 rounded-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            @click="handleDelete"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">OK</span>
            <div v-else class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Deleting...
            </div>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useModalStore } from "@/store/useModalStore";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { apolloClient } from "../../../apollo-client";
import {
  deleteAssignment,
  deleteClass,
  deleteEvent,
  deleteExam,
  deleteFeeStructure,
  deleteLesson,
  deleteSubject,
  globalAnnouncementDelete,
  personalAnnouncementDelete,
} from "../../graphql/mutations";
import { useClassStore } from "../../store/classStore";
import { useEventStore } from "../../store/eventStore";
import { useLessonStore } from "../../store/lessonStore";
import { useNotificationStore } from "../../store/notification";
import { useSubjectStore } from "../../store/subjectStore";

import { useFeeStructureStore } from "../../store/feeStructureStore";
import { useUserStore } from "../../store/userStore";
import { useExamStore } from "../../store/examStore";

const examStore = useExamStore();
const userStore = useUserStore();
const modalStore = useModalStore();
const classStore = useClassStore();
const eventStore = useEventStore();
const lessonStore = useLessonStore();
const subjectStore = useSubjectStore();
const feeStructureStore = useFeeStructureStore();
const notificationStore = useNotificationStore();

const router = useRouter();


const isModalVisible = ref(modalStore.deleteModal);

const title = ref(modalStore.modalTitle);
const source = ref(modalStore.source);

const isLoading = ref(false);

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
  if (isLoading.value) return;
  modalStore.deleteModal = false;
  modalStore.modalId = null;
};

const handleDelete = async () => {
  try {
    isLoading.value = true;

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
      await apolloClient.mutate({
        mutation: deleteExam,
        variables: {
          examId: modalStore.modalId,
        },
      });
      await examStore.refreshExams();

      notificationStore.addNotification({
        type: "success",
        message: "Exam deleted successfully",
      });
    } else if (source.value === "assignmentList") {
      await apolloClient.mutate({
        mutation: deleteAssignment,
        variables: {
          assignmentId: modalStore.modalId,
        },
      });
      await assignmentStore.refreshExams();

      notificationStore.addNotification({
        type: "success",
        message: "Exam deleted successfully",
      });
    } else if (source.value === "resultList") {
      console.log("hello from results");
    } else if (source.value === "eventList") {
      await apolloClient.mutate({
        mutation: deleteEvent,
        variables: {
          eventId: modalStore.modalId,
        },
      });

      await eventStore.fetchEvents();

      notificationStore.addNotification({
        type: "success",
        message: "Event deleted successfully",
      });

      // If we're on the event view page, redirect to events list
      if (router.currentRoute.value.name === "EventView") {
        router.push("/events");
      }
    } else if (source.value === "announcementList") {
      const announcement = modalStore.data;
      const currentUserId = userStore.userInfo?.id;
      const userRole = userStore.userInfo?.role?.toLowerCase();

      // Check if user is creator or admin (can perform global delete)
      const isCreator = announcement.creatorId === currentUserId;
      const isAdmin = userRole === "admin" || userRole === "super_admin";

      if (isCreator || isAdmin) {
        // Global delete - removes for everyone
        await apolloClient.mutate({
          mutation: globalAnnouncementDelete,
          variables: {
            announcementId: modalStore.modalId,
          },
        });
        notificationStore.addNotification({
          type: "success",
          message: "Announcement deleted for everyone",
        });
      } else {
        // Personal delete - removes only for current user
        await apolloClient.mutate({
          mutation: personalAnnouncementDelete,
          variables: {
            announcementId: modalStore.modalId,
          },
        });
        notificationStore.addNotification({
          type: "success",
          message: "Announcement removed from your inbox",
        });
      }
    } else if (source.value === "feeStructure") {
      await apolloClient.mutate({
        mutation: deleteFeeStructure,
        variables: {
          feeStructureId: modalStore.modalId,
        },
      });

      await feeStructureStore.refreshFeeStructures();
      notificationStore.addNotification({
        type: "success",
        message: "Fee structure deleted successfully",
      });
    }
    modalStore.deleteModal = false;
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: `Error deleting ${title.value}: ${error.message}`,
    });
  } finally {
    isLoading.value = false;
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
