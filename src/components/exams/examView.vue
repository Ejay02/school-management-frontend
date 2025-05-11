<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="container mx-auto m-1 mt-0 shadow-xl">
      <!-- Loading state -->
      <LoadingScreen v-if="loading" message="Loading Exam..." />

      <!-- Error state -->
      <ErrorScreen v-else-if="error" :message="error" />

      <!-- Exam content -->
      <div
        v-else-if="exam"
        class="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer"
      >
        <!-- Exam header -->
        <div
          class="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-black opacity-10 pattern-dots"></div>
          <div class="flex items-start relative z-10">
            <button
              @click="$router.back()"
              class="bg-white/20 backdrop-blur-sm p-2.5 rounded-full text-white hover:bg-white/30 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 mr-4"
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div>
              <h1 class="text-3xl font-bold mb-2 tracking-tight capitalize">
                {{ exam.title }}
              </h1>
              <div class="flex flex-wrap items-center gap-4 text-indigo-100">
                <div class="flex items-center">
                  <i class="fa-solid fa-book mr-2"></i>
                  <span>{{ exam.subject?.name || "No Subject" }}</span>
                </div>
                <div class="flex items-center">
                  <i class="fa-solid fa-chalkboard-user mr-2"></i>
                  <span>{{ exam.class?.name || "No Class" }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Exam details -->
        <div class="p-6 border-b border-gray-100">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div
              class="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg"
            >
              <i class="fa-solid fa-calendar mr-2 text-indigo-500"></i>
              <span class="text-sm font-medium">
                {{ formatDate(exam.date) }}
              </span>
            </div>

            <div
              class="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg"
            >
              <i class="fa-solid fa-clock mr-2 text-indigo-500"></i>
              <span class="text-sm font-medium">
                {{ formatTime(exam.startTime) }} -
                {{ formatTime(exam.endTime) }}</span
              >
            </div>
            <div
              class="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg"
            >
              <i class="fa-solid fa-question-circle mr-2 text-indigo-500"></i>
              <span class="font-medium text-sm"
                >{{ examQuestions.length }} Question(s)</span
              >
            </div>
          </div>

          <div
            v-if="exam.description"
            class="mt-6 text-gray-700 bg-indigo-50 p-4 rounded-lg"
          >
            <h3
              class="font-semibold text-lg mb-2 text-indigo-700 flex items-center"
            >
              <i class="fa-solid fa-circle-info mr-2"></i> Description
            </h3>
            <p class="text-gray-700 font-serif">{{ exam.description }}</p>
          </div>

          <div
            v-if="exam.instructions"
            class="mt-4 text-gray-700 bg-amber-50 p-4 rounded-lg"
          >
            <h3
              class="font-semibold text-lg mb-2 text-amber-700 flex items-center"
            >
              <i class="fa-solid fa-list-check mr-2"></i> Instructions
            </h3>
            <p class="text-gray-700">{{ exam.instructions }}</p>
          </div>

          <div class="mt-6 flex items-center">
            <div class="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <div class="relative">
                <img
                  v-if="exam.teacher?.image"
                  :src="exam.teacher.image"
                  :alt="`${exam.teacher?.name} avatar`"
                  class="w-12 h-12 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
                />
                <div
                  v-else
                  class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white border-2 border-indigo-200 shadow-sm capitalize"
                >
                  {{ exam.teacher?.name?.[0] }}{{ exam.teacher?.surname?.[0] }}
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">Created by:</p>
                <p class="text-sm font-bold text-indigo-700 capitalize">
                  {{ exam.teacher?.name || "Unknown" }}
                  {{ exam.teacher?.surname || "" }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Questions section -->
        <div class="p-6">
          <h2
            class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 flex items-center"
          >
            <i class="fa-solid fa-clipboard-question mr-2 text-indigo-500"></i>
            Questions
          </h2>

          <div
            v-if="examQuestions.length === 0"
            class="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300"
          >
            <i
              class="fa-solid fa-file-circle-question text-4xl mb-3 text-gray-400"
            ></i>
            <p>No questions available for this exam.</p>
          </div>

          <div v-else class="space-y-8">
            <div
              v-for="(question, index) in examQuestions"
              :key="index"
              class="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div class="flex justify-between items-start mb-4">
                <h3
                  class="text-lg font-semibold text-gray-800 flex items-center"
                >
                  <span
                    class="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm"
                  >
                    {{ index + 1 }}
                  </span>
                  Question {{ index + 1 }}
                </h3>
                <div
                  class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                >
                  {{ question.type }} - {{ question.points }} points
                </div>
              </div>

              <div class="mb-4 bg-white p-4 rounded-lg border border-gray-100">
                <div class="prose max-w-none" v-html="question.content"></div>
              </div>

              <!-- MCQ Options -->
              <div v-if="question.type === 'MCQ'" class="mt-4 space-y-2">
                <h4 class="font-medium text-gray-700 flex items-center">
                  <i class="fa-solid fa-list-ul mr-2 text-indigo-500"></i>
                  Options:
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    v-for="(option, optIndex) in question.options"
                    :key="optIndex"
                    class="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 transition-colors duration-200"
                  >
                    <div
                      class="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-indigo-100 border border-indigo-200 text-xs font-medium text-indigo-700"
                    >
                      {{ String.fromCharCode(65 + optIndex) }}
                    </div>
                    <span>{{ option }}</span>
                  </div>
                </div>
              </div>

              <!-- Correct Answer (only visible to teachers and admins) -->
              <div
                v-if="isTeacherOrAdmin && question.correctAnswer"
                class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm"
              >
                <h4 class="font-medium text-green-700 flex items-center">
                  <i class="fa-solid fa-check-circle mr-2"></i> Correct Answer:
                </h4>
                <p
                  class="text-green-800 mt-2 bg-white p-2 rounded border border-green-100"
                >
                  {{ question.correctAnswer }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apolloClient } from "../../../apollo-client";
import { getExamById } from "../../graphql/queries";
import { useNotificationStore } from "../../store/notification";
import { useUserStore } from "../../store/userStore";
import { formatDate, formatTime } from "../../utils/date.holidays";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

const exam = ref(null);
const loading = ref(true);
const error = ref(null);
const examQuestions = ref([]);

const isTeacherOrAdmin = computed(() => {
  const role = userStore.currentRole?.toLowerCase();
  return role === "teacher" || role === "admin" || role === "super_admin";
});

onMounted(async () => {
  const examId = route.params.id;
  if (!examId) {
    error.value = "Exam ID is missing";
    loading.value = false;
    return;
  }

  try {
    const { data } = await apolloClient.query({
      query: getExamById,
      variables: { examId },
    });

    if (data && data.getExamById) {
      exam.value = data.getExamById;

      // Parse questions from content if available
      if (exam.value.content) {
        try {
          const parsedContent = JSON.parse(exam.value.content);
          examQuestions.value = parsedContent.questions || [];
        } catch (parseError) {
          console.error("Error parsing exam content:", parseError);
          examQuestions.value = [];
        }
      } else if (exam.value.questions && exam.value.questions.length > 0) {
        // Use questions array if available directly
        examQuestions.value = exam.value.questions;
      } else {
        examQuestions.value = [];
      }
    } else {
      error.value = "Exam not found";
    }
  } catch (err) {
    console.error("Error fetching exam:", err);
    error.value = "Failed to load exam details";
    notificationStore.addNotification({
      type: "error",
      message: "Failed to load exam details",
    });
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>
