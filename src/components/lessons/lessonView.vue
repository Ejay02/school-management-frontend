<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="w-full rounded-md shadow-lg border border-gray-200">
      <!-- Loading and error states -->
      <LoadingScreen v-if="loading" message="Loading lesson details..." />
      <ErrorScreen v-else-if="error" />

      <div v-else class="bg-white cursor-pointer">
        <!-- Lesson Header with gradient background -->
        <div
          class="rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 relative"
        >
          <!-- Back arrow button -->
          <button
            @click="goBack"
            class="absolute top-4 left-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-all animate-bounce-once"
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

          <h1 class="ml-8 text-2xl md:text-3xl font-bold mb-2">
            {{ lesson?.name }}
          </h1>

          <p class="ml-8 text-indigo-100 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.328.996.002 1.069c0 .54.384 1.006.914 1.096l3.487.594a1 1 0 01.171.035l4.473 1.535a1 1 0 001.294-.95V10.01c0-.363-.196-.696-.504-.874L10.394 2.08z"
              />
              <path
                d="M7.032 11.165a3 3 0 01.596-.541l4-1.714a1 1 0 01.788 0l7 3a1 1 0 010 1.84l-7 3a1 1 0 01-.788 0l-7-3a1 1 0 010-1.84l1.025-.439"
              />
            </svg>
            {{ lesson?.class?.name || "No class assigned" }}
          </p>
        </div>

        <!-- Lesson Content -->
        <div class="p-6">
          <!-- Time and Subject Cards -->
          <div class="grid md:grid-cols-2 gap-4 mb-8">
            <div
              class="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-lg shadow-sm border border-indigo-100 transition-all hover:shadow-md"
            >
              <h3 class="font-semibold text-indigo-800 mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                When
              </h3>
              <div class="ml-7 space-y-3">
                <p class="flex items-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-4 w-4 mr-2 text-indigo-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5"
                    />
                  </svg>
                  <span class="font-medium">{{ lesson?.day }}</span>
                </p>
                <p class="flex items-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-2 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span
                    >{{ formatTime(lesson?.startTime) }} -
                    {{ formatTime(lesson?.endTime) }}</span
                  >
                </p>
                <p
                  v-if="calculateDuration(lesson?.startTime, lesson?.endTime)"
                  class="flex items-center text-gray-700"
                >
                  <i
                    class="fa-regular fa-hourglass-half h-4 w-4 mr-2 text-indigo-500"
                  ></i>
                  <span>{{
                    calculateDuration(lesson?.startTime, lesson?.endTime)
                  }}</span>
                </p>
              </div>
            </div>

            <div
              class="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-lg shadow-sm border border-indigo-100 transition-all hover:shadow-md"
            >
              <h3 class="font-semibold text-indigo-800 mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Subject
              </h3>
              <div class="ml-7">
                <p class="text-gray-700 font-medium">
                  {{ lesson?.subject?.name || "No subject specified" }}
                </p>
                <p
                  v-if="lesson?.teacher"
                  class="mt-3 text-gray-600 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-2 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Teacher: {{ lesson?.teacher?.name }}
                  {{ lesson?.teacher?.surname }}
                </p>
              </div>
            </div>
          </div>

          <!-- Main Content Grid: 3 columns on large screens -->
          <div class="grid lg:grid-cols-3 gap-6">
            <!-- Description Section - spans 2 columns -->
            <div class="lg:col-span-2 mb-4">
              <h3
                class="font-semibold text-lg text-gray-800 mb-3 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Description
              </h3>
              <div
                class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all"
              >
                <p
                  class="text-gray-700 whitespace-pre-line leading-relaxed prose max-w-none font-serif text-lg"
                >
                  {{ lesson?.description || "No description provided." }}
                </p>
              </div>
            </div>

            <!-- Right sidebar with class info - spans 1 column -->
            <div class="space-y-6">
              <div>
                <h3
                  class="font-semibold text-lg text-gray-800 mb-3 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Class Information
                </h3>
                <div
                  class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all"
                >
                  <div class="space-y-3">
                    <p class="flex items-center text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-2 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span class="font-medium">
                        {{ lesson?.class?.students?.length || 0 }} students
                      </span>
                    </p>
                    <p
                      v-if="lesson?.class?.grade"
                      class="flex items-center text-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-2 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Grade: {{ lesson?.class?.grade }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Lesson Content Section -->
          <div class="mt-8">
            <h3
              class="font-semibold text-lg text-gray-800 mb-3 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Lesson Content
            </h3>
            <div
              class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <div
                class="prose max-w-none max-h-[500px] overflow-y-auto custom-scrollbar"
                v-html="lesson?.content || 'No content available.'"
              ></div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3 mt-10">
            <!-- v-if="isTeacher"
              -->
            <button
              @click="editLesson"
              class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all font-medium flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Lesson
            </button>
            <button
              @click="downloadLesson"
              class="flex-1 bg-white hover:bg-gray-50 text-indigo-600 py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all font-medium border border-indigo-200 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNavigation } from "../../composables/useNavigation";
import { useLessonStore } from "../../store/lessonStore";
import { useUserStore } from "../../store/userStore";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";

const route = useRoute();
const router = useRouter();
const lessonId = route.params.id;

const lessonStore = useLessonStore();
const userStore = useUserStore();
const { goBack } = useNavigation();

const lesson = computed(() => lessonStore.selectedLesson);
const loading = computed(() => lessonStore.loading);
const error = computed(() => lessonStore.error);

// Check if current user is a teacher (for edit permissions)
const isTeacher = computed(() => {
  return userStore.userInfo?.role === "TEACHER";
});

const formatTime = (timeString) => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const calculateDuration = (start, end) => {
  if (!start || !end) return "";

  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);

  let durationMinutes =
    endHours * 60 + endMinutes - (startHours * 60 + startMinutes);

  // Handle negative duration (if end time is earlier than start time)
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60; // Add a full day
  }

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours === 0) {
    return `${minutes} minutes`;
  } else if (minutes === 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else {
    return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
      minutes > 1 ? "s" : ""
    }`;
  }
};

const editLesson = () => {
  router.push(`/dashboard/lesson/edit/${lessonId}`);
};

const downloadLesson = () => {
  if (!lesson.value) return;

  // Create content for the download
  const lessonContent = `
# ${lesson.value.name}
## ${lesson.value.subject?.name || "No subject"}
${lesson.value.day} | ${formatTime(lesson.value.startTime)} - ${formatTime(
    lesson.value.endTime
  )}

### Description
${lesson.value.description || "No description provided."}

### Content
${
  lesson.value.content
    ? lesson.value.content.replace(/<[^>]*>/g, "")
    : "No content available."
}
  `.trim();

  // Create a blob and download link
  const blob = new Blob([lessonContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${lesson.value.name.replace(/\s+/g, "_")}.txt`;
  document.body.appendChild(a);
  a.click();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

onMounted(async () => {
  await lessonStore.fetchLessonById(lessonId);
});
</script>

<style scoped>
.animate-bounce-once {
  animation: bounce 1s ease-in-out 1;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #818cf8;
}
</style>
