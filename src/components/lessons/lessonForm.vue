<template>
  <div class="container mx-auto rounded border border-gray-300 p-2 w-full">
    <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-md">
      <div
        class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-t-lg relative"
      >
      <div class="absolute inset-0 pattern-dots opacity-10"></div>
        <div class="flex gap-2">
          <button
            @click="$router.back()"
            class="top-4 left-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-all animate-bounce-once"
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

          <h1 class="text-2xl font-bold">
            {{ isEditing ? "Edit Lesson" : "Create New Lesson" }}
          </h1>
        </div>
      </div>

      <div class="p-6">
        <div class="flex flex-col lg:flex-row gap-6 mb-14">
          <!-- Left Column - Basic Info -->
          <div class="flex-1 space-y-6">
            <!-- Title -->
            <div>
              <label
                for="title"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Title <span class="text-red-500">*</span></label
              >
              <input
                v-model="title"
                type="text"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <!-- Class and Subject Selection -->
            <div class="flex gap-4">
              <Dropdown
                class="w-1/2"
                v-model="selectedClass"
                label="Select Class <span class='text-red-500'>*</span>"
                :options="classOptions"
                emptyLabel="Select a class"
              />
              <CustomDropdown
                class="w-1/2"
                v-model="selectedSubject"
                label="Select Subject <span class='text-red-500'>*</span>"
                :options="filteredSubjects"
                placeholder="Select a subject"
                :disabled="!selectedClass"
              />
            </div>

            <!-- Day and Time -->
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label
                  for="day"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Day <span class="text-red-500">*</span></label
                >
                <select
                  v-model="day"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>
              <div>
                <label
                  for="startTime"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Start Time <span class="text-red-500">*</span></label
                >
                <input
                  type="time"
                  v-model="startTime"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  for="endTime"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >End Time <span class="text-red-500">*</span></label
                >
                <input
                  type="time"
                  v-model="endTime"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <!-- Right Column - Content -->
          <div class="flex-1 space-y-6">
            <!-- Description -->
            <div>
              <label
                for="description"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Description <span class="text-red-500">*</span></label
              >
              <textarea
                v-model="description"
                rows="2"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              ></textarea>
            </div>

            <!-- Content -->
            <div class="h-[200px]">
              <label
                for="quill"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Content <span class="text-red-500">*</span></label
              >
              <div class="h-[calc(100%-28px)]">
                <QuillEditor
                  v-model:content="content"
                  contentType="html"
                  theme="snow"
                  toolbar="essential"
                  class="cursor-pointer"
                  placeholder="Enter your lesson content here..."
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4 mt-6 border-t pt-6">
          <button
            @click="$router.back()"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="handleSubmit"
            class="px-4 py-2 rounded-md transition-colors duration-200"
            :class="{
              'bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:bg-indigo-600':
                isFormValid,
              'bg-gray-300 text-gray-500 cursor-not-allowed': !isFormValid,
            }"
            :disabled="!isFormValid"
          >
            {{ isEditing ? "Update" : "Create" }} Lesson
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import { computed, nextTick, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apolloClient } from "../../../apollo-client";
import { createLesson, editLesson } from "../../graphql/mutations";
import { getLessonById } from "../../graphql/queries";
import { useClassStore } from "../../store/classStore";
import { useLessonStore } from "../../store/lessonStore";
import { useNotificationStore } from "../../store/notification";
import { useSubjectStore } from "../../store/subjectStore";
import CustomDropdown from "../dropdowns/customDropdown.vue";
import Dropdown from "../dropdowns/dropdown.vue";

const route = useRoute();
const router = useRouter();
const classStore = useClassStore();
const lessonStore = useLessonStore();
const subjectStore = useSubjectStore();
const notificationStore = useNotificationStore();

// Form fields
const title = ref("");
const description = ref("");
const content = ref("");
const selectedClass = ref("");
const selectedSubject = ref("");
const day = ref("Monday");
const startTime = ref("");
const endTime = ref("");

const isEditing = computed(() => route.params.id !== undefined);

const classOptions = computed(() => {
  return classStore.getClassNames?.map((classItem) => classItem.name) || [];
});

const filteredSubjects = computed(() => {
  if (!selectedClass.value) return [];
  const classObj = classStore.allClasses.find(
    (c) => c.name === selectedClass.value
  );
  return (
    classObj?.subjects?.map((subject) => ({
      value: subject.id,
      label: subject.name,
    })) || []
  );
});

const isFormValid = computed(() => {
  return (
    title.value &&
    selectedClass.value &&
    selectedSubject.value &&
    day.value &&
    startTime.value &&
    endTime.value
  );
});

const getClassIdByName = (className) => {
  const classItem = classStore.getClassNames.find((c) => c.name === className);
  return classItem ? classItem.id : null;
};

const handleSubmit = async () => {
  try {
    const formattedContent = content.value || "";
    const formattedDescription = description.value || "";

    const lessonData = {
      name: title.value,
      description: formattedDescription,
      content: formattedContent,
      day: day.value,
      startTime: startTime.value,
      endTime: endTime.value,
    };

    if (isEditing.value) {
      await apolloClient.mutate({
        mutation: editLesson,
        variables: {
          lessonId: route.params.id,
          editLessonInput: lessonData,
        },
      });
      await lessonStore.refreshLessons();
      notificationStore.addNotification({
        type: "success",
        message: "Lesson updated successfully!",
      });
    } else {
      await apolloClient.mutate({
        mutation: createLesson,
        variables: {
          classId: getClassIdByName(selectedClass.value),
          subjectId: selectedSubject.value,
          createLessonInput: lessonData,
        },
      });
      await lessonStore.refreshLessons();
      notificationStore.addNotification({
        type: "success",
        message: "Lesson created successfully!",
      });
    }

    router.push("/lessons");
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: "Failed to save lesson: " + error.message,
    });
  }
};

// Load lesson data if editing
onMounted(async () => {
  if (!classStore.classes.length) {
    await classStore.fetchClasses();
  }
  if (!subjectStore.subjects.length) {
    await subjectStore.fetchSubjects();
  }
  if (isEditing.value) {
    const { data } = await apolloClient.query({
      query: getLessonById,
      variables: { id: route.params.id },
    });

    const lesson = data.getLessonById;
    title.value = lesson.name;
    description.value = lesson.description;
    content.value = lesson.content;
    day.value = lesson.day;
    startTime.value = lesson.startTime;
    endTime.value = lesson.endTime;

    if (lesson.class && lesson.class.name) {
      selectedClass.value = lesson.class.name;
    }
    // Wait for the next tick to ensure filteredSubjects is updated
    await nextTick();

    // Set subject ID directly from the response
    if (lesson.subject && lesson.subject.id) {
      selectedSubject.value = lesson.subject.id;
    }
  }
});
</script>
