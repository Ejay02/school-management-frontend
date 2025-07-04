<template>
  <div>
    <!-- Exams cards -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6 cursor-pointer"
    >
      <div
        v-for="item in filteredData"
        :key="item?.id"
        class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
      >
        <!-- Card header with subject color -->
        <div
          class="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white flex items-center justify-between relative"
        >
          <div class="absolute inset-0 pattern-dots opacity-10"></div>
          <div class="relative z-10">
            <h3 class="font-bold text-lg truncate capitalize">
              {{ item?.title }}
            </h3>
            <div class="flex items-center mt-1 text-indigo-100">
              <i class="fa-solid fa-book mr-2"></i>
              <span>{{ item?.subject?.name }}</span>
            </div>
          </div>
          <!--  -->
          <div class="relative z-10">
            <div class="mr-4 relative">
              <img
                v-if="item?.teacher?.image"
                :src="item?.teacher?.image"
                :alt="`${item?.teacher?.name} avatar`"
                class="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
              />

              <div
                v-else
                class="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm border-2 border-indigo-200 capitalize"
              >
                {{ item?.teacher?.name[0] }}{{ item?.teacher?.surname[0] }}
              </div>
            </div>
          </div>
        </div>

        <!-- Card content -->
        <div class="p-4 flex-1 flex flex-col">
          <div class="mb-3 text-sm text-gray-600 line-clamp-3 font-serif h-14">
            {{ item?.description || "No description provided" }}
          </div>

          <div class="flex items-center text-sm text-gray-500 mt-2">
            <i class="fa-solid fa-calendar mr-2"></i>
            <span>{{ formatDate(item?.date) }}</span>
          </div>

          <div class="flex items-center text-sm text-gray-500 mt-2">
            <i class="fa-solid fa-clock mr-2"></i>
            <span
              >{{ formatTime(item?.startTime) || "Time not specified" }} -
              {{ formatTime(item?.endTime) || "Time not specified" }}</span
            >
          </div>

          <div class="flex items-center text-sm text-gray-500 mt-2">
            <i class="fa-solid fa-question-circle mr-2"></i>

            <span>{{ getQuestionCount(item) }} Question(s)</span>
          </div>
        </div>

        <!-- Card actions -->
        <div
          class="border-t border-gray-200 p-3 bg-gray-50 flex justify-between"
        >
          <button
            @click="viewExam(item.id)"
            class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
            :class="{
              'opacity-50 cursor-not-allowed':
                getExamStatus(item) !== 'active' && !isCreator(item.id),
            }"
            :disabled="getExamStatus(item) !== 'active' && !isCreator(item.id)"
          >
            <i
              v-if="getExamStatus(item) === 'completed'"
              class="fa-solid fa-user-check mr-1"
            ></i>
            <i v-else class="fa-solid fa-eye mr-1"></i>
            {{
              isCreator(item.id)
                ? "View"
                : getExamStatus(item) === "completed"
                ? "Completed"
                : role === "student"
                ? `Start Exam `
                : "View"
            }}
          </button>

          <div class="flex gap-2">
            <button
              v-if="role.toLowerCase() === 'teacher'"
              @click="showEditModal(item.id, item.title, item, 'examList')"
              class="text-gray-600 hover:text-gray-800 text-sm flex items-center"
            >
              <i class="fa-solid fa-pen-to-square mr-1"></i> Edit
            </button>

            <button
              v-if="role.toLowerCase() === 'teacher'"
              @click="showDelModal(item.id, item.title, 'examList')"
              class="text-red-600 hover:text-red-800 text-sm flex items-center"
            >
              <i class="fa-solid fa-trash-can mr-1"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useExamStore } from "../../store/examStore";
import { useNotificationStore } from "../../store/notification";
import { useModalStore } from "../../store/useModalStore";
import { useUserStore } from "../../store/userStore";
import { formatDate, formatTime } from "../../utils/date.holidays";

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});

const router = useRouter();
const userStore = useUserStore();
const modalStore = useModalStore();
const examStore = useExamStore();
const notificationStore = useNotificationStore();

const role = userStore.currentRole;
const userId = userStore.userInfo?.id;

const teacherId = (examId) => {
  const exam = props.data.find((e) => e.id === examId);
  return exam?.teacher?.id;
};

const isCreator = (examId) => teacherId(examId) === userId;

const getExamStatus = (exam) => {
  const now = new Date();

  // Use the full ISO strings directly since they already include date and time
  const startDateTime = new Date(exam.startTime);
  const endDateTime = new Date(exam.endTime);

  if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
    console.error("Invalid date format:", {
      date: exam.date,
      startTime: exam.startTime,
      endTime: exam.endTime,
    });
    return "active"; // Default to active if we can't determine
  }

  if (now < startDateTime) return "upcoming";
  if (now > endDateTime) return "completed";
  return "active";
};

// Filter and sort exams
const filteredData = computed(() => {
  let exams = [...(props.data || [])];

  return exams;
});

const viewExam = async (examId) => {
  // If user is a student and exam is active, start the exam session
  if (
    role.toLowerCase() === "student" &&
    getExamStatus(props.data.find((e) => e.id === examId)) === "active"
  ) {
    try {
      await examStore.startExamSession(examId, userId);
      notificationStore.addNotification({
        type: "success",
        message: "Exam started successfully!",
      });
    } catch (error) {
      notificationStore.addNotification({
        type: "error",
        message: "Failed to start exam: " + (error.message || "Unknown error"),
      });
      return;
    }
  }
  router.push(`/exams/${examId}`);
};

const showDelModal = (id, title, type) => {
  modalStore.deleteModal = true;
  modalStore.modalId = id;
  modalStore.modalTitle = title;
  modalStore.source = type;
};

const showEditModal = (id) => {
  router.push(`dashboard/exam/${id}/edit`);
};

const getQuestionCount = (item) => {
  if (item?.content) {
    const parsedContent = JSON.parse(item.content);
    return parsedContent.questions?.length || 0;
  }
  return 0;
};
</script>

<style scoped></style>
