<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="container mx-auto m-1 mt-0 shadow-xl">
      <!-- Loading state -->
      <LoadingScreen v-if="loading" message="Loading Exam..." />

      <!-- Error state -->
      <ErrorScreen v-else-if="error" :message="error" />

      <!-- Timer Banner -->
      <div
        v-if="exam && isExamActive"
        class="bg-indigo-100 p-3 mb-4 rounded-lg shadow-sm"
      >
        <div class="flex justify-between items-center">
          <div class="text-indigo-800 font-medium flex items-center">
            <i class="fa-solid fa-hourglass-half mr-2 animate-pulse"></i>
            Time Remaining:
          </div>
          <div class="text-indigo-900 font-bold text-xl">
            {{ formatTimeRemaining(timeRemaining) }}
          </div>
        </div>
      </div>

      <!-- Exam Not Started Yet -->
      <div
        v-else-if="exam && !hasExamStarted"
        class="bg-amber-100 p-4 rounded-lg shadow-sm mb-4"
      >
        <div class="flex items-center text-amber-800">
          <i class="fa-solid fa-clock mr-2"></i>
          <span class="font-medium"
            >This exam has not started yet. It will begin at
            {{ formatTime(exam.startTime) }} on
            {{ formatDate(exam.date) }}.</span
          >
        </div>
      </div>

      <!-- Exam Ended -->
      <div
        v-else-if="exam && hasExamEnded"
        class="bg-gray-100 p-4 rounded-lg shadow-sm mb-4"
      >
        <div class="flex items-center text-gray-800">
          <i class="fa-solid fa-flag-checkered mr-2"></i>
          <span class="font-medium">This exam has ended.</span>
        </div>

        <!-- Show score if exam is completed -->
        <div
          v-if="examCompleted"
          class="mt-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
        >
          <h3 class="text-xl font-bold text-indigo-700 mb-2">Exam Results</h3>
          <div
            class="flex items-center justify-between bg-indigo-50 p-3 rounded-lg mb-3"
          >
            <span class="font-medium">Your Score:</span>
            <span class="text-xl font-bold text-indigo-700"
              >{{ score }} / {{ totalPossibleScore }}</span
            >
          </div>
          <div
            class="flex items-center justify-between bg-indigo-50 p-3 rounded-lg"
          >
            <span class="font-medium">Percentage:</span>
            <span
              class="text-xl font-bold"
              :class="scorePercentage >= 70 ? 'text-green-600' : 'text-red-600'"
              >{{ scorePercentage }}%</span
            >
          </div>
        </div>
      </div>

      <!-- Exam content -->
      <div
        v-if="exam"
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
              v-for="(question, index) in processedExamQuestions"
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
                    class="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer"
                    :class="{
                      'bg-white hover:bg-indigo-50 hover:border-indigo-200 border-gray-200':
                        userAnswers[index] !== option,
                      'bg-indigo-100 border-indigo-300':
                        userAnswers[index] === option,
                    }"
                    @click="selectAnswer(index, option)"
                  >
                    <div
                      class="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium"
                      :class="{
                        'bg-indigo-100 border border-indigo-200 text-indigo-700':
                          userAnswers[index] !== option,
                        'bg-indigo-600 text-white':
                          userAnswers[index] === option,
                      }"
                    >
                      {{ String.fromCharCode(65 + optIndex) }}
                    </div>
                    <span>{{ option }}</span>
                  </div>
                </div>
              </div>

              <!-- Text Answer for non-MCQ questions -->
              <div v-else class="mt-4">
                <h4 class="font-medium text-gray-700 flex items-center mb-2">
                  <i class="fa-solid fa-pen-to-square mr-2 text-indigo-500"></i>
                  Your Answer:
                </h4>
                <textarea
                  v-model="userAnswers[index]"
                  rows="3"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Type your answer here..."
                ></textarea>
              </div>

              <!-- Correct Answer (only visible to teachers and admins) -->
              <div
                v-if="
                  isTeacherOrAdmin && question.correctAnswer && !isExamActive
                "
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

          <!-- Submit button -->
          <div
            class="mt-8 flex justify-end"
            v-if="isExamActive && !examCompleted"
          >
            <button
              @click="submitExam"
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
              :disabled="!hasAnsweredAny"
              :class="{ 'opacity-50 cursor-not-allowed': !hasAnsweredAny }"
            >
              <i class="fa-solid fa-paper-plane mr-2"></i>
              Submit Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
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
const timeRemaining = ref(0);
const timerInterval = ref(null);
const userAnswers = ref({});
const examCompleted = ref(false);
const score = ref(0);
const totalPossibleScore = ref(0);
const scorePercentage = ref(0);

const isTeacherOrAdmin = computed(() => {
  const role = userStore.currentRole?.toLowerCase();
  return role === "teacher" || role === "admin" || role === "super_admin";
});

const isTeacherForSubject = () => {
  if (!selectedSubject.value || !userId) return false;

  // Instead of relying on the store's subject data, use the subject data from the class
  // which contains the necessary teacher information
  const classObj = classStore.allClasses.find(
    (c) => c.name === selectedClass.value
  );
  const subject = classObj?.subjects?.find(
    (s) => s.id === selectedSubject.value
  );

  // If we're the supervisor of the class, we can create exams for any subject
  if (classObj?.supervisor?.id === userId) return true;

  // Check if the subject exists in the selected class
  return !!subject;
};

const isAssignedTeacher = computed(() => {
  if (!isTeacher) return false;
  return isTeacherForSubject();
});

// Compute if exam has started based on current time and exam start time
const hasExamStarted = computed(() => {
  if (!exam.value || !exam.value.startTime) return false;
  const now = new Date();
  const startTime = new Date(exam.value.startTime);
  return now >= startTime;
});

// Compute if exam has ended based on current time and exam end time
const hasExamEnded = computed(() => {
  if (!exam.value || !exam.value.endTime) return false;
  const now = new Date();
  const endTime = new Date(exam.value.endTime);
  return now >= endTime;
});

// Compute if exam is currently active (started but not ended)
const isExamActive = computed(() => {
  return hasExamStarted.value && !hasExamEnded.value;
});

// Check if user has answered any questions
const hasAnsweredAny = computed(() => {
  return Object.values(userAnswers.value).some(
    (answer) => answer !== undefined && answer !== ""
  );
});

// Process exam questions to remove correct answers from non-admin/teacher view
// or when exam is active (even for teachers/admins)
const processedExamQuestions = computed(() => {
  if (!examQuestions.value) return [];

  // If user is not teacher/admin or exam is active, remove correct answers
  if (!isTeacherOrAdmin.value || isExamActive.value) {
    return examQuestions.value.map((question) => {
      const { correctAnswer, ...rest } = question;
      return rest;
    });
  }

  // Otherwise return questions with answers (for teachers/admins after exam)
  return examQuestions.value;
});

// Format remaining time as MM:SS
const formatTimeRemaining = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

// Select an answer for a question
const selectAnswer = (questionIndex, option) => {
  userAnswers.value[questionIndex] = option;
};

// Calculate score based on user answers
const calculateScore = () => {
  let userScore = 0;
  let possibleScore = 0;

  examQuestions.value.forEach((question, index) => {
    // Add points to possible score
    possibleScore += question.points || 1;

    // Check if answer is correct
    if (userAnswers.value[index] && question.correctAnswer) {
      if (userAnswers.value[index] === question.correctAnswer) {
        userScore += question.points || 1;
      }
    }
  });

  score.value = userScore;
  totalPossibleScore.value = possibleScore;
  scorePercentage.value = Math.round((userScore / possibleScore) * 100) || 0;

  // Log the score for debugging
  console.log(
    "Exam completed with score:",
    userScore,
    "/",
    possibleScore,
    "(",
    scorePercentage.value,
    "%)"
  );

  // Here you would typically send the score to your backend
  // saveExamResult(exam.value.id, userScore, possibleScore, userAnswers.value);
};

// Submit the exam
const submitExam = () => {
  examCompleted.value = true;
  calculateScore();

  notificationStore.addNotification({
    type: "success",
    message: "Exam submitted successfully!",
  });
};

// Start the timer
const startTimer = () => {
  if (!exam.value || !exam.value.endTime) return;

  // Calculate initial time remaining
  const now = new Date();
  const endTime = new Date(exam.value.endTime);
  const initialTimeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));

  timeRemaining.value = initialTimeRemaining;

  // Set up interval to update timer every second
  timerInterval.value = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      // Time's up - auto submit
      clearInterval(timerInterval.value);
      if (!examCompleted.value) {
        submitExam();
        notificationStore.addNotification({
          type: "info",
          message: "Time's up! Your exam has been automatically submitted.",
        });
      }
    }
  }, 1000);
};

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

      // Initialize userAnswers object
      examQuestions.value.forEach((_, index) => {
        userAnswers.value[index] = "";
      });

      // Start timer if exam is active
      if (isExamActive.value) {
        startTimer();
      }

      // If exam has ended, check if we have saved answers/score
      if (hasExamEnded.value) {
        // Here you would typically fetch saved results if they exist
        // const savedResults = await fetchExamResults(exam.value.id);
        // if (savedResults) {
        //   examCompleted.value = true;
        //   score.value = savedResults.score;
        //   totalPossibleScore.value = savedResults.totalPossible;
        //   scorePercentage.value = savedResults.percentage;
        // }
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

// Clean up timer when component is unmounted
onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
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
