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
                    class="flex items-center p-3 rounded-md border border-gray-200 bg-white"
                  >
                    <div
                      class="w-6 h-6 flex items-center justify-center mr-3 rounded-full border border-gray-300 text-xs"
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
                    class="flex items-center p-3 rounded-md border border-gray-200 bg-white"
                  >
                    <div
                      class="w-6 h-6 flex items-center justify-center mr-3 rounded-full border border-gray-300 text-xs"
                    >
                      T
                    </div>
                    <div>True</div>
                  </div>
                  <div
                    class="flex items-center p-3 rounded-md border border-gray-200 bg-white"
                  >
                    <div
                      class="w-6 h-6 flex items-center justify-center mr-3 rounded-full border border-gray-300 text-xs"
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
                  <div class="text-gray-500 italic">
                    Short answer response required
                  </div>
                </div>

                <!-- Essay -->
                <div
                  v-else-if="question.type === 'Essay'"
                  class="p-3 rounded-md border border-gray-200 bg-white"
                >
                  <div class="text-gray-500 italic">
                    Essay response required
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center p-8 text-gray-500">
              No questions available for this assignment.
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
</style>
