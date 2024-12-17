<template>
  <div
    v-if="isModalVisible"
    class="fixed top-0 left-0 w-full h-full bg-gray-900/80 flex justify-center items-center z-50"
    @click.self="handleCancel"
    :key="isModalVisible"
  >
    <div
      class="bg-white cursor-pointer rounded-md w-96 h-auto mt-4 shadow-md overflow-auto"
    >
      <div class="bg-eduPurple text-white p-4">
        <h3 class="text-xl font-medium capitalize items-center text-center">
          Edit {{ formatSourceTitle(source) }}
        </h3>
      </div>

      <div class="p-6 space-y-4 cursor-pointer">
        <!-- teacher list -->
        <template v-if="source === 'teacherList'">
          <div class="flex gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Name</label
              >
              <input
                v-model="data.name"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Email</label
              >
              <input
                v-model="data.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Photo</label
            >
            <input
              v-model="data.photo"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subjects</label
            >
            <input
              v-model="data.subjects"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div class="flex gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Classes</label
              >
              <input
                v-model="data.classes"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Phone</label
              >
              <input
                v-model="data.phone"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Address</label
          >
          <input
            v-model="data.address"
            class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </template>

        <!-- teacher card -->
        <template v-if="source === 'teacherCard'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Name</label
            >

            <input
              v-model="name"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Photo</label
            >
            <input
              v-model="data.photo"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Description</label
            >
            <input
              v-model="data.description"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div class="flex gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Email</label
              >
              <input
                v-model="transformedData.email"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Birthday</label
              >
              <input
                v-model="transformedData.date"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div class="flex gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Blood Group</label
              >
              <input
                v-model="transformedData.bloodgroup"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Phone</label
              >
              <input
                v-model="transformedData.phone"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </template>

        <!-- student List -->
        <template v-if="source === 'studentList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Name</label
            >
            <input
              v-model="data.name"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div class="flex gap-2">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 mb-1 capitalize"
                >class</label
              >
              <input
                v-model="data.class"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 mb-1 capitalize"
                >grade</label
              >
              <input
                v-model="data.grade"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div class="flex gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Phone</label
              >
              <input
                v-model="data.phone"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Student Id</label
              >
              <input
                v-model="data.studentId"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Address</label
          >
          <input
            v-model="data.address"
            class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </template>

        <!-- parent list -->
        <template v-if="source === 'parentList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Name</label
            >
            <input
              v-model="data.name"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Email</label
            >
            <input
              v-model="data.email"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Student Name</label
            >
            <input
              v-model="data.students"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Phone</label
            >
            <input
              v-model="data.phone"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Address</label
          >
          <input
            v-model="data.address"
            class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </template>

        <!-- subject list -->
        <template v-else-if="source === 'subjectList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject Name</label
            >
            <input
              v-model="data.name"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Teachers</label
            >
            <input
              v-model="data.teachers"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </template>

        <!-- class list -->
        <template v-else-if="source === 'classList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class Name</label
            >
            <input
              v-model="data.name"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div class="flex gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Capacity</label
              >
              <input
                v-model="data.capacity"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Grade</label
              >
              <input
                v-model="data.grade"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Supervisor</label
            >
            <input
              v-model="data.supervisor"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </template>

        <!-- lesson -->
        <template v-else-if="source === 'lessonList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject</label
            >
            <input
              v-model="data.subject"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class</label
            >
            <input
              v-model="data.class"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Teacher</label
            >
            <input
              v-model="data.teacher"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </template>

        <!-- exam -->
        <template v-else-if="source === 'examList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject</label
            >
            <input
              v-model="data.subject"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class</label
            >
            <input
              v-model="data.class"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Teacher</label
            >
            <input
              v-model="data.teacher"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Date</label
            >
            <input
              type="date"
              v-model="data.date"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </template>

        <!-- assignment -->
        <template v-else-if="source === 'assignmentList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject</label
            >
            <input
              v-model="data.subject"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class</label
            >
            <input
              v-model="data.class"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Teacher</label
            >
            <input
              v-model="data.teacher"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Due Date</label
            >
            <input
              type="date"
              v-model="data.dueDate"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </template>

        <!-- result -->
        <template v-else-if="source === 'resultList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject</label
            >
            <input
              v-model="data.subject"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Student</label
            >
            <input
              v-model="data.student"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div class="flex gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Score</label
              >
              <input
                v-model="data.score"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Class</label
              >
              <input
                v-model="data.class"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Teacher</label
            >
            <input
              v-model="data.teacher"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Date</label
            >
            <input
              type="date"
              v-model="data.date"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </template>

        <!-- event -->
        <template v-else-if="source === 'eventList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Title</label
            >
            <input
              type="text"
              v-model="data.title"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class</label
            >
            <input
              v-model="data.class"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Date</label
            >
            <input
              type="date"
              v-model="data.date"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div class="flex gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Start Time</label
              >
              <input
                type="datetime"
                v-model="data.startTime"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >End Time</label
              >
              <input
                type="datetime"
                v-model="data.endTime"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </template>

        <!-- announcement -->
        <template v-else-if="source === 'announcementList'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Title</label
            >
            <input
              type="text"
              v-model="data.title"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class</label
            >
            <input
              v-model="data.class"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Date</label
            >
            <input
              type="date"
              v-model="data.date"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </template>

        <!-- buttons -->
        <div class="flex justify-end gap-2 mt-4">
          <button
            class="bg-white border border-gray-300 cursor-pointer text-gray-600 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            @click="handleCancel"
          >
            Cancel
          </button>
          <button
            class="hover:bg-purple-400 text-white py-2 px-4 rounded-md bg-purple-500 transition-colors"
            @click="handleEdit"
          >
            {{ handleEdit ? "Edit" : "Editing ..." }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useModalStore } from "@/store/useModalStore";

const modalStore = useModalStore();
const isModalVisible = ref(modalStore.editModal);

const title = ref(modalStore.modalTitle);
const source = ref(modalStore.source);
const data = ref(modalStore.data);

const transformedData = ref({});

// watch(
//   data,
//   (newValue) => {
//     const transformed = {};
//     newValue.forEach((item) => {
//       transformed[item.label.toLowerCase().replace(/\s+/g, "")] = item.value;
//     });
//     transformedData.value = transformed;
//   },
//   { immediate: true }
// );

// Watchers to sync with modal store
watch(
  () => modalStore.editModal,
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

watch(
  () => modalStore.data,
  (newVal) => {
    data.value = newVal;
  }
);

// Helper function to format source title
const formatSourceTitle = (src) => {
  // Remove 'List' and capitalize first letter
  return src.replace("List", "").charAt(0).toUpperCase() + src.slice(1, -4);
};

const handleCancel = () => {
  modalStore.editModal = false;
  modalStore.modalId = null;
};

const handleEdit = async () => {
  try {
    if (source.value === "teacherList") {
      console.log("hello from teachers");
    } else if (source.value === "teacherCard") {
      console.log("hello from teacherCard");
    } else if (source.value === "studentList") {
      console.log("hello from students");
    } else if (source.value === "parentList") {
      console.log("hello from parents");
    } else if (source.value === "subjectList") {
      console.log("hello from subjects");
    } else if (source.value === "classList") {
      console.log("hello from classes");
    } else if (source.value === "lessonList") {
      console.log("hello from lessons");
    } else if (source.value === "examList") {
      console.log("hello from exams");
    } else if (source.value === "assignmentList") {
      console.log("hello from assignments");
    } else if (source.value === "resultList") {
      console.log("hello from results");
    } else if (source.value === "eventList") {
      console.log("hello from events");
    } else if (source.value === "announcementList") {
      console.log("hello from announcements");
    }
    modalStore.editModal = false;
  } catch (error) {
    console.error(error);
  }
};
</script>
