<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="container mx-auto m-1 mt-0 shadow-xl">
      <!-- Loading state -->
      <LoadingScreen v-if="loading" message="Loading Assignment..." />

      <!-- Error state -->
      <ErrorScreen v-else-if="error" :message="error" />

      <div v-else-if="assignment" class="bg-white rounded-lg overflow-hidden">
        <!-- Assignment Header with gradient background -->
        <div
          class="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 relative text-white"
        >
          <div class="absolute inset-0 pattern-dots opacity-10"></div>

          <div class="flex gap-4 items-start">
            <div class="">
              <button
                @click="$router.back()"
                class="bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-all animate-bounce-once"
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
            </div>
            <div class="">
              <div>
                <h1 class="text-2xl font-bold mb-2">{{ assignment.title }}</h1>
                <div class="flex items-center space-x-4 text-sm">
                  <div class="flex items-center">
                    <i class="fa-solid fa-chalkboard-user mr-1"></i>
                    <span
                      >{{ assignment.teacher?.name }}
                      {{ assignment.teacher?.surname }}</span
                    >
                  </div>
                  <div class="flex items-center">
                    <i class="fa-solid fa-users mr-1"></i>
                    <span>{{ assignment.class?.name }}</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fa-solid fa-book mr-1"></i>
                    <span>{{ assignment.subject?.name }}</span>
                  </div>
                </div>
              </div>

              <!-- date div -->
              <div class="mt-4 flex flex-wrap gap-3">
                <div
                  class="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center"
                >
                  <i class="fa-solid fa-calendar-day mr-1"></i>
                  <span>Start: {{ formatDate(assignment.startDate) }}</span>
                </div>
                <div
                  class="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center"
                >
                  <i class="fa-solid fa-calendar-check mr-1"></i>
                  <span>Due: {{ formatDate(assignment.dueDate) }}</span>
                </div>
                <div
                  v-if="assignment.lesson"
                  class="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center"
                >
                  <i class="fa-solid fa-book-open mr-1"></i>
                  <span>Lesson: {{ assignment.lesson.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Assignment Content -->
        <div class="p-6">
          <div class="mt-6 text-gray-700 bg-indigo-50 p-4 rounded-lg">
            <h3
            class="font-semibold text-lg mb-2 text-indigo-700 flex items-center"
          >
            <i class="fa-solid fa-circle-info mr-2"></i> Description
          </h3>
            <div class="prose max-w-none" v-html="assignment.description"></div>
          </div>

          <div class="mb-8 mt-4 text-gray-700 bg-amber-50 p-4 rounded-lg">
            <h3
              class="font-semibold text-lg mb-2 text-amber-700 flex items-center"
            >
              <i class="fa-solid fa-list-check mr-2"></i> Instructions
            </h3>
            <div
              class="prose max-w-none"
              v-html="assignment.instructions"
            ></div>
          </div>

          <!-- Questions Section -->
          <div>
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Questions</h2>
            <div v-if="questions.length" class="space-y-6">
              <div
                v-for="(question, index) in questions"
                :key="index"
                class="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div class="flex justify-between items-start mb-3">
                  <h3 class="font-medium text-gray-800">
                    Question {{ index + 1 }}
                  </h3>
                  <div
                    class="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs"
                  >
                    {{ question.type }} ({{ question.points }} points)
                  </div>
                </div>
                <div class="mb-4 prose" v-html="question.content"></div>

                <!-- Multiple Choice Options -->
                <div v-if="question.type === 'MCQ'" class="space-y-2">
                  <div
                    v-for="(option, optIndex) in question.options"
                    :key="optIndex"
                    class="flex items-center p-3 rounded-md border border-gray-200 bg-white cursor-pointer"
                    :class="{
                      'border-indigo-500 bg-indigo-50': selectedAnswers[index] === optIndex,
                      'border-green-500 bg-green-50': isSubmitted && isCorrect(index, optIndex),
                      'border-red-500 bg-red-50': isSubmitted && selectedAnswers[index] === optIndex && !isCorrect(index, optIndex)
                    }"
                    @click="selectAnswer(index, optIndex)"
                  >
                    <div
                      class="w-6 h-6 flex items-center justify-center mr-3 rounded-full border border-gray-300 text-xs"
                      :class="{
                        'bg-indigo-500 text-white border-indigo-500': selectedAnswers[index] === optIndex,
                        'bg-green-500 text-white border-green-500': isSubmitted && isCorrect(index, optIndex),
                        'bg-red-500 text-white border-red-500': isSubmitted && selectedAnswers[index] === optIndex && !isCorrect(index, optIndex)
                      }"
                    >
                      {{ String.fromCharCode(65 + optIndex) }}
                    </div>
                    <div>{{ option }}</div>
                  </div>
                </div>

                <!-- True/False Options -->
                <div
                  v-else-if="question.type === 'True/False'"
                  class="space-y-2"
                >
                  <div
                    class="flex items-center p-3 rounded-md border border-gray-200 bg-white cursor-pointer"
                    :class="{
                      'border-indigo-500 bg-indigo-50': selectedAnswers[index] === 0,
                      'border-green-500 bg-green-50': isSubmitted && isCorrect(index, 0),
                      'border-red-500 bg-red-50': isSubmitted && selectedAnswers[index] === 0 && !isCorrect(index, 0)
                    }"
                    @click="selectAnswer(index, 0)"
                  >
                    <div
                      class="w-6 h-6 flex items-center justify-center mr-3 rounded-full border border-gray-300 text-xs"
                      :class="{
                        'bg-indigo-500 text-white border-indigo-500': selectedAnswers[index] === 0,
                        'bg-green-500 text-white border-green-500': isSubmitted && isCorrect(index, 0),
                        'bg-red-500 text-white border-red-500': isSubmitted && selectedAnswers[index] === 0 && !isCorrect(index, 0)
                      }"
                    >
                      T
                    </div>
                    <div>True</div>
                  </div>
                  <div
                    class="flex items-center p-3 rounded-md border border-gray-200 bg-white cursor-pointer"
                    :class="{
                      'border-indigo-500 bg-indigo-50': selectedAnswers[index] === 1,
                      'border-green-500 bg-green-50': isSubmitted && isCorrect(index, 1),
                      'border-red-500 bg-red-50': isSubmitted && selectedAnswers[index] === 1 && !isCorrect(index, 1)
                    }"
                    @click="selectAnswer(index, 1)"
                  >
                    <div
                      class="w-6 h-6 flex items-center justify-center mr-3 rounded-full border border-gray-300 text-xs"
                      :class="{
                        'bg-indigo-500 text-white border-indigo-500': selectedAnswers[index] === 1,
                        'bg-green-500 text-white border-green-500': isSubmitted && isCorrect(index, 1),
                        'bg-red-500 text-white border-red-500': isSubmitted && selectedAnswers[index] === 1 && !isCorrect(index, 1)
                      }"
                    >
                      F
                    </div>
                    <div>False</div>
                  </div>
                </div>

                <!-- Short Answer -->
                <div
                  v-else-if="question.type === 'Short Answer'"
                  class="p-3 rounded-md border border-gray-200 bg-white"
                >
                  <input 
                    type="text" 
                    v-model="selectedAnswers[index]" 
                    class="w-full p-2 border border-gray-300 rounded"
                    :class="{
                      'border-green-500 bg-green-50': isSubmitted && isCorrect(index, selectedAnswers[index]),
                      'border-red-500 bg-red-50': isSubmitted && !isCorrect(index, selectedAnswers[index])
                    }"
                    placeholder="Your answer"
                  />
                </div>

                <!-- Essay -->
                <div
                  v-else-if="question.type === 'Essay'"
                  class="p-3 rounded-md border border-gray-200 bg-white"
                >
                  <textarea 
                    v-model="selectedAnswers[index]" 
                    class="w-full p-2 border border-gray-300 rounded min-h-[100px]"
                    placeholder="Your essay response"
                  ></textarea>
                </div>
              </div>
            </div>
            <div v-else class="text-center p-8 text-gray-500">
              No questions available for this assignment.
            </div>
            
            <!-- Submit Button -->
            <div class="mt-6 flex justify-end" v-if="questions.length">
              <button 
                @click="submitAnswers" 
                class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                :disabled="isSubmitted"
                :class="{'opacity-50 cursor-not-allowed': isSubmitted}"
              >
                {{ isSubmitted ? 'Submitted' : 'Submit Answers' }}
              </button>
            </div>
            
            <!-- Results Summary -->
            <div v-if="isSubmitted && questions.length" class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 class="text-lg font-semibold text-gray-700 mb-2">Results</h3>
              <div class="flex items-center justify-between">
                <div class="text-gray-600">Score: {{ score }} / {{ totalPossibleScore }}</div>
                <div class="text-gray-600">Percentage: {{ scorePercentage }}%</div>
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
import { useRoute } from "vue-router";
import { apolloClient } from "../../../apollo-client";
import { getAssignmentById } from "../../graphql/queries";
import { formatDate } from "../../utils/date.holidays";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";

const route = useRoute();
const assignment = ref(null);
const loading = ref(true);
const error = ref(null);
const selectedAnswers = ref({});
const isSubmitted = ref(false);
const score = ref(0);

// Computed property to extract questions from assignment content
const questions = computed(() => {
  if (!assignment.value) return [];

  // Try to get questions from the questions array first
  if (assignment.value.questions && assignment.value.questions.length > 0) {
    return assignment.value.questions;
  }

  // If no questions in the array, try to parse from content
  try {
    const content = JSON.parse(assignment.value.content);
    return content.questions || [];
  } catch (e) {
    return [];
  }
});

// Computed property for total possible score
const totalPossibleScore = computed(() => {
  return questions.value.reduce((total, question) => total + (question.points || 1), 0);
});

// Computed property for score percentage
const scorePercentage = computed(() => {
  if (totalPossibleScore.value === 0) return 0;
  return Math.round((score.value / totalPossibleScore.value) * 100);
});

// Function to select an answer
const selectAnswer = (questionIndex, answerIndex) => {
  if (isSubmitted.value) return; // Prevent changing answers after submission
  selectedAnswers.value[questionIndex] = answerIndex;
};

// Function to check if an answer is correct
const isCorrect = (questionIndex, answerIndex) => {
  const question = questions.value[questionIndex];
  if (!question) return false;
  
  // For MCQ and True/False
  if (question.type === 'MCQ' || question.type === 'True/False') {
    return question.correctAnswer === answerIndex;
  }
  
  // For Short Answer - case insensitive comparison
  if (question.type === 'Short Answer') {
    return String(answerIndex).toLowerCase() === String(question.correctAnswer).toLowerCase();
  }
  
  // For Essay - always return true as it requires manual grading
  if (question.type === 'Essay') {
    return true;
  }
  
  return false;
};

// Function to submit answers
const submitAnswers = () => {
  isSubmitted.value = true;
  let currentScore = 0;
  
  // Calculate score
  questions.value.forEach((question, index) => {
    if (selectedAnswers.value[index] !== undefined) {
      if (isCorrect(index, selectedAnswers.value[index])) {
        currentScore += question.points || 1;
      }
    }
  });
  
  score.value = currentScore;
};

// Fetch assignment data
const fetchAssignment = async () => {
  loading.value = true;
  error.value = null;

  try {
    const { data } = await apolloClient.query({
      query: getAssignmentById,
      variables: { assignmentId: route.params.id },
      fetchPolicy: "network-only",
    });

    assignment.value = data.getAssignmentById;
  } catch (err) {
    console.error("Error fetching assignment:", err);
    error.value = err.message || "Failed to load assignment";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAssignment();
});
</script>

<style scoped>
.pattern-dots {
  background-image: radial-gradient(currentColor 1px, transparent 1px);
  background-size: 8px 8px;
}

/* Add responsive adjustments */
@media (max-width: 640px) {
  .flex-wrap {
    justify-content: center;
  }
}

/* Add animation for selection */
.cursor-pointer {
  transition: all 0.2s ease-in-out;
}

.cursor-pointer:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Animation for the submit button */
@keyframes bounce-once {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-bounce-once {
  animation: bounce-once 0.5s ease-in-out;
}
</style>
