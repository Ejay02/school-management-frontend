<template>
  <div class="container mx-auto rounded border border-gray-300 p-2 w-full">
    <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-md">
      <div
        class="flex gap-2 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors text-white p-6 rounded-t-lg relative"
      >
        <div class="absolute inset-0 pattern-dots opacity-10"></div>
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
          {{ isEditing ? "Edit Assignment" : "Create New Assignment" }}
        </h1>
      </div>

      <div class="p-6">
        <div class="flex flex-col lg:flex-row gap-6">
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
                class="cursor-pointer mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                :options="
                  filteredSubjects.map((subject) => ({
                    value: subject.id,
                    label: subject.name,
                  }))
                "
                placeholder="Select a subject"
                :disabled="!selectedClass"
              />

              <CustomDropdown
                class="w-1/2"
                v-model="selectedLesson"
                label="Select Lesson <span class='text-red-500'>*</span>"
                :options="
                  filteredLessons.map((lesson) => ({
                    value: lesson.id,
                    label: lesson.name,
                  }))
                "
                placeholder="Select a lesson"
                :disabled="!selectedSubject"
              />
            </div>

            <!-- Dates -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label
                  for="startDate"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Start Date <span class="text-red-500">*</span></label
                >
                <input
                  type="date"
                  v-model="startDate"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  for="dueDate"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Due Date <span class="text-red-500">*</span></label
                >
                <input
                  type="date"
                  v-model="dueDate"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <!-- Description -->
            <div>
              <label
                for="description"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Description <span class="text-red-500">*</span></label
              >
              <QuillEditor
                v-model:content="description"
                contentType="html"
                theme="snow"
                toolbar="essential"
                class="h-24 cursor-pointer"
              />
            </div>

            <!-- Instructions -->
            <div>
              <label
                for="instructions"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Instructions <span class="text-red-500">*</span></label
              >
              <QuillEditor
                v-model:content="instructions"
                contentType="html"
                theme="snow"
                toolbar="essential"
                class="h-24 cursor-pointer"
              />
            </div>

            <!-- Questions Section -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium">
                Questions <span class="text-red-500">*</span>
              </h3>

              <!-- Default Question -->
              <div class="p-6 rounded-md space-y-4 bg-gray-50">
                <div class="flex justify-between items-center">
                  <select
                    v-model="questions[0].type"
                    class="border rounded-md p-2 cursor-pointer border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                  >
                    <option
                      v-for="type in questionTypes"
                      :key="type"
                      :value="type"
                    >
                      {{ type }}
                    </option>
                  </select>
                </div>

                <div class="space-y-4">
                  <div>
                    <label
                      for="quill"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Question Text <span class="text-red-500">*</span></label
                    >
                    <QuillEditor
                      v-model:content="questions[0].content"
                      contentType="html"
                      theme="snow"
                      toolbar="essential"
                      class="h-24 cursor-pointer"
                    />
                  </div>

                  <div class="flex items-center gap-4">
                    <div>
                      <label
                        for="questionPoints"
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Question Points <span class="text-red-500">*</span>
                        <span class="text-xs text-gray-500">(min: 5)</span>
                      </label>
                      <input
                        v-model="questions[0].points"
                        type="number"
                        min="5"
                        class="w-32 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none rounded-md p-2 cursor-pointer"
                      />
                    </div>
                  </div>

                  <!-- MCQ Options -->
                  <div v-if="questions[0].type === 'MCQ'" class="space-y-2">
                    <div
                      v-for="(option, oIndex) in questions[0].options"
                      :key="oIndex"
                      class="flex gap-2"
                    >
                      <input
                        v-model="questions[0].options[oIndex]"
                        placeholder="Option text"
                        class="flex-1 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none rounded-md p-2 cursor-pointer"
                      />
                      <button
                        @click="removeOption(0, oIndex)"
                        class="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <button
                      @click="addOption(0)"
                      class="text-indigo-500 hover:text-indigo-700"
                    >
                      Add Option
                    </button>
                  </div>

                  <!-- Correct Answer -->
                  <div>
                    <label
                      for="correctAnswer"
                      class="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Correct Answer <span class="text-red-500">*</span>
                      <span class="text-xs text-gray-500 ml-1"
                        >(Only visible to teachers)</span
                      >
                    </label>
                    <input
                      v-model="questions[0].correctAnswer"
                      placeholder="Correct answer"
                      class="w-full border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none rounded-md p-2 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <!-- Additional Questions -->
              <div
                v-for="(question, qIndex) in additionalQuestions"
                :key="qIndex"
                class="border p-6 rounded-md space-y-4 bg-gray-50"
              >
                <!-- Question header with remove button -->
                <div class="flex justify-between items-center">
                  <select
                    v-model="question.type"
                    class="border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none rounded-md p-2 cursor-pointer"
                  >
                    <option
                      v-for="type in questionTypes"
                      :key="type"
                      :value="type"
                      class="cursor-pointer"
                    >
                      {{ type }}
                    </option>
                  </select>
                  <button
                    @click="removeQuestion(qIndex)"
                    class="text-red-500 hover:text-red-700"
                  >
                    Remove Question
                  </button>
                </div>

                <!-- Question content -->
                <div class="space-y-4">
                  <div>
                    <label
                      for="quill"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Question Text <span class="text-red-500">*</span></label
                    >
                    <QuillEditor
                      v-model:content="question.content"
                      contentType="html"
                      theme="snow"
                      toolbar="essential"
                      class="h-24 cursor-pointer"
                    />
                  </div>

                  <div class="flex items-center gap-4">
                    <div>
                      <label
                        for="questionPoints"
                        class="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Question Points <span class="text-red-500">*</span>
                        <span class="text-xs text-gray-500">(min: 5)</span>
                      </label>
                      <input
                        v-model="question.points"
                        type="number"
                        min="5"
                        class="w-32 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none rounded-md p-2 cursor-pointer"
                      />
                    </div>
                  </div>

                  <!-- MCQ Options -->
                  <div v-if="question.type === 'MCQ'" class="space-y-2">
                    <div
                      v-for="(option, oIndex) in question.options"
                      :key="oIndex"
                      class="flex gap-2"
                    >
                      <input
                        v-model="question.options[oIndex]"
                        placeholder="Option text"
                        class="flex-1 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none rounded-md p-2 cursor-pointer"
                      />
                      <button
                        @click="removeOption(qIndex + 1, oIndex)"
                        class="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <button
                      @click="addOption(qIndex + 1)"
                      class="text-indigo-500 hover:text-indigo-700"
                    >
                      Add Option
                    </button>
                  </div>

                  <!-- Correct Answer -->
                  <div>
                    <label
                      for="correctAnswer"
                      class="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Correct Answer <span class="text-red-500">*</span>
                      <span class="text-xs text-gray-500 ml-1"
                        >(Only visible to teachers)</span
                      >
                    </label>
                    <input
                      v-model="question.correctAnswer"
                      placeholder="Correct answer"
                      class="w-full border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none rounded-md p-2 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <!-- Add More Questions Button -->
              <div class="flex justify-center">
                <button
                  @click="addQuestion"
                  class="px-6 py-3 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center gap-2 text-white"
                >
                  <span class="text-xl">+</span> Add More Questions
                </button>
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
            {{ isEditing ? "Update" : "Create" }} Assignment
          </button>
        </div>
        <div
          v-if="!isTeacher && !isAssignedTeacher"
          class="text-red-500 text-sm text-end"
        >
          ** You can only create assignments for classes/subjects/lessons you're
          assigned to.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apolloClient } from "../../../apollo-client";
import { createAssignment } from "../../graphql/mutations";
import { getAssignmentById } from "../../graphql/queries";
import { useClassStore } from "../../store/classStore";
import { useNotificationStore } from "../../store/notification";
import { useSubjectStore } from "../../store/subjectStore";
import CustomDropdown from "../dropdowns/customDropdown.vue";
import Dropdown from "../dropdowns/dropdown.vue";

import { useTeacherAccessCheck } from "../../composables/useTeacherAccessCheck";
import { useLessonStore } from "../../store/lessonStore";
import { useUserStore } from "../../store/userStore";
import { questionTypes } from "../../utils/utility";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const classStore = useClassStore();
const subjectStore = useSubjectStore();
const lessonStore = useLessonStore();
const notificationStore = useNotificationStore();

const { isTeacher, isAssignedToSelection } = useTeacherAccessCheck();

const title = ref("");
const description = ref("");
const instructions = ref("");
const startDate = ref("");
const dueDate = ref("");
const selectedClass = ref("");
const selectedSubject = ref("");
const selectedLesson = ref("");

const isAssignedTeacher = computed(() =>
  isAssignedToSelection(
    selectedClass.value,
    selectedSubject.value,
    selectedLesson.value
  )
);

const classOptions = computed(() => {
  return classStore.getClassNames?.map((classItem) => classItem.name) || [];
});

const filteredLessons = computed(() => {
  if (!selectedSubject.value) return [];
  const subject = subjectStore.subjects.find(
    (s) => s.id === selectedSubject.value
  );
  return subject?.lessons || [];
});

const filteredSubjects = computed(() => {
  if (!selectedClass.value) return [];
  const classObj = classStore.allClasses.find(
    (c) => c.name === selectedClass.value
  );
  return classObj?.subjects || [];
});

const questions = ref([
  {
    type: "MCQ",
    content: "",
    options: [""],
    correctAnswer: "",
    points: 5,
  },
]);

const additionalQuestions = computed(() => questions.value.slice(1));

const addQuestion = () => {
  questions.value.push({
    type: "MCQ",
    content: "",
    options: [""],
    correctAnswer: "",
    points: 5,
  });
};

const removeQuestion = (index) => {
  questions.value.splice(index + 1, 1);
};

const addOption = (questionIndex) => {
  questions.value[questionIndex].options.push("");
};

const removeOption = (questionIndex, optionIndex) => {
  questions.value[questionIndex].options.splice(optionIndex, 1);
};

const isEditing = computed(() => route.params.id !== undefined);

const isFormValid = computed(() => {
  // Basic form validation
  const basicFieldsValid =
    title.value.trim() &&
    selectedClass.value &&
    selectedSubject.value &&
    selectedLesson.value &&
    startDate.value &&
    dueDate.value;

  // Question validation
  const questionsValid = questions.value.every((question) => {
    const hasContent = question.content?.trim().length > 0;
    const hasPoints = question.points >= 5;

    // MCQ specific validation
    if (question.type === "MCQ") {
      const hasValidOptions =
        question.options.length >= 2 &&
        question.options.every((opt) => opt.trim().length > 0);
      return (
        hasContent &&
        hasPoints &&
        hasValidOptions &&
        question.correctAnswer.trim()
      );
    }

    // Other question types
    return hasContent && hasPoints && question.correctAnswer.trim();
  });

  return basicFieldsValid && questionsValid && isAssignedTeacher.value;
});

const getClassIdByName = (className) => {
  const classItem = classStore.getClassNames.find((c) => c.name === className);
  return classItem ? classItem.id : null;
};

const handleSubmit = async () => {
  try {
    const assignmentData = {
      title: title.value,
      description: description.value,
      instructions: instructions.value,
      startDate: new Date(startDate.value).toISOString(),
      dueDate: new Date(dueDate.value).toISOString(),
      content: JSON.stringify({
        questions: questions.value,
      }),
      classId: getClassIdByName(selectedClass.value),
      subjectId: selectedSubject.value,
      lessonId: selectedLesson.value,
      questions: questions.value.map((q) => ({
        questionType: q.type,
        content: q.content,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: q.points,
      })),
    };

    await apolloClient.mutate({
      mutation: createAssignment,
      variables: {
        createAssignmentInput: assignmentData,
      },
    });

    notificationStore.addNotification({
      type: "success",
      message: "Assignment created successfully!",
    });

    router.push("/assignments");
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: "Failed to save assignment: " + error.message,
    });
  }
};

// Reset lesson when class changes
watch(selectedSubject, () => {
  selectedLesson.value = "";
});

onMounted(async () => {
  if (!classStore.classes.length) await classStore.fetchClasses();
  if (!subjectStore.subjects.length) await subjectStore.fetchSubjects();
  if (!lessonStore.lessons.length) lessonStore.fetchLessons();

  if (isEditing.value) {
    const { data } = await apolloClient.query({
      query: getAssignmentById,
      variables: { assignmentId: route.params.id },
      fetchPolicy: "network-only",
    });

    const assignment = data.getAssignmentById;
    title.value = assignment.title;
    description.value = assignment.description;
    instructions.value = assignment.instructions;
    questions.value = JSON.parse(assignment.content).questions;
    startDate.value = assignment.startDate.split("T")[0];
    dueDate.value = assignment.dueDate.split("T")[0];

    // Find and set the class by name instead of ID
    if (assignment.class && assignment.class.name) {
      selectedClass.value = assignment.class.name;
    }

    // Wait for subjects to load based on selected class
    await nextTick();

    // Find and set the subject
    if (assignment.subject && assignment.subject.id) {
      selectedSubject.value = assignment.subject.id;
    }

    // Wait for lessons to load based on selected subject
    await nextTick();

    // Find and set the lesson
    if (assignment.lesson && assignment.lesson.id) {
      selectedLesson.value = assignment.lesson.id;
    }
  }
});
</script>

<style scoped>
.ql-editor {
  min-height: 120px;
  max-height: 300px;
  overflow-y: auto;
}

.ql-toolbar.ql-snow {
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}

.ql-container.ql-snow {
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

@media (max-width: 1024px) {
  .ql-editor {
    min-height: 100px;
  }
}
</style>
