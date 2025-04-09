<template>
  <div class="container mx-auto rounded border border-gray-300 p-2 w-full">
    <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-md">
      <div
        class="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors text-white p-6 rounded-t-lg"
      >
        <h1 class="text-2xl font-bold">
          {{ isEditing ? "Edit Exam" : "Create New Exam" }}
        </h1>
      </div>

      <div class="p-6">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Left Column - Main Form -->
          <div class="flex-1 space-y-6">
            <!-- Title -->
            <div>
              <label
                for="title"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Title</label
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
                label="Select Class"
                :options="classOptions"
                emptyLabel="Select a class"
              />
              <CustomDropdown
                class="w-1/2"
                v-model="selectedSubject"
                label="Select Subject"
                :options="
                  filteredSubjects.map((subject) => ({
                    value: subject.id,
                    label: subject.name,
                  }))
                "
                placeholder="Select a subject"
                :disabled="!selectedClass"
              />
            </div>

            <!-- Date and Time -->
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label
                  for="date"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Date</label
                >
                <input
                  type="date"
                  v-model="date"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  for="startTime"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Start Time</label
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
                  >End Time</label
                >
                <input
                  type="time"
                  v-model="endTime"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <!-- Questions Section -->
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium">Questions</h3>
              </div>

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
                      for="questionText"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Question Text</label
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
                        Question Points
                        <span class="text-xs text-gray-500">(min: 5)</span>
                      </label>
                      <input
                        v-model="questions[0].points"
                        type="number"
                        min="5"
                        placeholder="Points"
                        class="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none w-32 border rounded-md p-2 cursor-pointer"
                      />
                    </div>
                  </div>

                  <!-- MCQ Options for default question -->
                  <div v-if="questions[0].type === 'MCQ'" class="space-y-2">
                    <div
                      v-for="(option, oIndex) in questions[0].options"
                      :key="oIndex"
                      class="flex gap-2"
                    >
                      <!-- border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none -->
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
                      >Correct Answer
                      <span class="text-xs text-gray-500 ml-1"
                        >(Only visible to teachers)</span
                      ></label
                    >
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
                <!-- Question header -->
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
                      for="questionText"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Question Text</label
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
                        Question Points
                        <span class="text-xs text-gray-500">(min: 5)</span>
                      </label>
                      <input
                        v-model="question.points"
                        type="number"
                        min="5"
                        placeholder="Points"
                        class="w-32 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none rounded-md p-2 cursor-pointer"
                      />
                    </div>
                  </div>

                  <!-- MCQ Options -->
                  <!-- In the additional questions section -->
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
                      >Correct Answer
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
            {{ isEditing ? "Update" : "Create" }} Exam
          </button>
        </div>
        <div
          v-if="!isTeacher && !isAssignedTeacher"
          class="text-red-500 text-sm text-end"
        >
          ** You can only create exams for classes/subjects you're assigned to.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apolloClient } from "../../../apollo-client";
import { createExam, updateExam } from "../../graphql/mutations";
import { getExamById } from "../../graphql/queries";
import { useClassStore } from "../../store/classStore";
import { useNotificationStore } from "../../store/notification";
import { useSubjectStore } from "../../store/subjectStore";
import { questionTypes } from "../../utils/utility";
import CustomDropdown from "../dropdowns/customDropdown.vue";
import Dropdown from "../dropdowns/dropdown.vue";
import { useUserStore } from "../../store/userStore";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const classStore = useClassStore();
const subjectStore = useSubjectStore();
const notificationStore = useNotificationStore();

const title = ref("");
const description = ref("");
const instructions = ref("");
const questions = ref([
  {
    type: "MCQ",
    content: "",
    options: [""],
    correctAnswer: "",
    points: 1,
  },
]);
const additionalQuestions = computed(() => questions.value.slice(1));
const selectedClass = ref("");

const selectedSubject = ref("");
const date = ref("");
const startTime = ref("");
const endTime = ref("");

const classOptions = computed(() => {
  return classStore.getClassNames?.map((classItem) => classItem.name) || [];
});

const isEditing = computed(() => route.params.id !== undefined);

const filteredSubjects = computed(() => {
  if (!selectedClass.value) return [];

  // Find the selected class object
  const classObj = classStore.allClasses.find(
    (c) => c.name === selectedClass.value
  );

  // Return the subjects from the selected class if available
  return classObj?.subjects || [];
});

const userId = userStore.userInfo?.id;

const isTeacher = userStore.userInfo?.role === "TEACHER";
console.log("isTeacher:", isTeacher);

const isAssignedTeacher = computed(() => {
  if (!isTeacher) return false;

  // Get selected class and subject
  const classObj = classStore.allClasses.find(
    (c) => c.name === selectedClass.value
  );
  const subject = subjectStore.subjects.find(
    (s) => s.id === selectedSubject.value
  );

  // Check if teacher is supervisor of class
  const isClassSupervisor = classObj?.supervisorId === userId;

  // Check if teacher is assigned to subject
  const isSubjectTeacher = subject?.teachers?.some((t) => t.id === userId);

  return isClassSupervisor || isSubjectTeacher;
});

const isFormValid = computed(() => {
  // Basic form validation
  const basicFieldsValid =
    title.value &&
    selectedClass.value &&
    selectedSubject.value &&
    date.value &&
    startTime.value &&
    endTime.value;

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
        hasContent && hasPoints && hasValidOptions && question.correctAnswer
      );
    }

    // Other question types
    return hasContent && hasPoints && question.correctAnswer;
  });

  return basicFieldsValid && questionsValid && isAssignedTeacher.value;
});

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

const getClassIdByName = (className) => {
  const classItem = classStore.getClassNames.find((c) => c.name === className);
  return classItem ? classItem.id : null;
};

const handleSubmit = async () => {
  try {
    const examData = {
      title: title.value,
      description: description.value,
      instructions: instructions.value,
      content: JSON.stringify({
        questions: questions.value,
      }),
      date: date.value,
      startTime: startTime.value,
      endTime: endTime.value,
      classId: getClassIdByName(selectedClass.value),
      subjectId: selectedSubject.value,
    };

    if (isEditing.value) {
      await apolloClient.mutate({
        mutation: updateExam,
        variables: {
          id: route.params.id,
          input: examData,
        },
      });
      notificationStore.addNotification({
        type: "success",
        message: "Exam updated successfully!",
      });
    } else {
      await apolloClient.mutate({
        mutation: createExam,
        variables: {
          input: examData,
        },
      });
      notificationStore.addNotification({
        type: "success",
        message: "Exam created successfully!",
      });
    }

    router.push("/exams");
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: "Failed to save exam: " + error.message,
    });
  }
};

// Load exam data if editing
onMounted(async () => {
  if (!classStore.classes.length) {
    await classStore.fetchClasses();
  }
  if (!subjectStore.subjects.length) {
    await subjectStore.fetchSubjects();
  }
  if (isEditing.value) {
    try {
      const { data } = await apolloClient.query({
        query: getExamById,
        variables: { id: route.params.id },
      });

      const exam = data.exam;
      title.value = exam.title;
      description.value = exam.description;
      instructions.value = exam.instructions;
      questions.value = JSON.parse(exam.content).questions;
      selectedClass.value = classStore.getClassNameById(exam.classId);
      selectedSubject.value = exam.subjectId;
      date.value = exam.date;
      startTime.value = exam.startTime;
      endTime.value = exam.endTime;
    } catch (error) {
      notificationStore.addNotification({
        type: "error",
        message: "Failed to load exam",
      });
    }
  }
});
</script>

<style scoped>
/* Added styles for Quill editor responsiveness */
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
