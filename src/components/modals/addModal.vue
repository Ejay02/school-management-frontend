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
          Add {{ source }}
        </h3>
      </div>

      <div class="p-6 space-y-4 cursor-pointer">
        <!-- teacher list -->
        <template v-if="source === 'teachers'">
          <div class="flex gap-2">
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
                >Email</label
              >
              <input
                v-model="email"
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
              v-model="photo"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subjects</label
            >
            <input
              v-model="subjects"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div class="flex gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Classes</label
              >
              <input
                v-model="classes"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Phone</label
              >
              <input
                v-model="phone"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Address</label
          >
          <input
            v-model="address"
            class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </template>

        <!-- student List -->
        <template v-if="source === 'students'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Name</label
            >
            <input
              v-model="name"
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
                v-model="classes"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 mb-1 capitalize"
                >grade</label
              >
              <input
                v-model="grade"
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
                v-model="phone"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Student Id</label
              >
              <input
                v-model="studentId"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Address</label
          >
          <input
            v-model="address"
            class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </template>

        <!-- parent list -->
        <template v-if="source === 'parents'">
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
              >Email</label
            >
            <input
              v-model="email"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Student Name</label
            >
            <input
              v-model="student"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Phone</label
            >
            <input
              v-model="phone"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Address</label
          >
          <input
            v-model="address"
            class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </template>

        <!-- subject list -->
        <template v-else-if="source === 'subjects'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject Name</label
            >
            <input
              v-model="name"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Teachers</label
            >
            <input
              v-model="teachers"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </template>

        <!-- class list -->
        <template v-else-if="source === 'classes'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class Name</label
            >
            <input
              v-model="name"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div class="flex gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Capacity</label
              >
              <input
                v-model="capacity"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Grade</label
              >
              <input
                v-model="grade"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Supervisor</label
            >
            <input
              v-model="supervisor"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </template>

        <!-- lesson -->
        <template v-else-if="source === 'lessons'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject</label
            >
            <input
              v-model="subject"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class</label
            >
            <input
              v-model="classes"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Teacher</label
            >
            <input
              v-model="teacher"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </template>

        <!-- exam -->
        <template v-else-if="source === 'exams'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject</label
            >
            <input
              v-model="subject"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class</label
            >
            <input
              v-model="classes"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Teacher</label
            >
            <input
              v-model="teacher"
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
              v-model="date"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </template>

        <!-- assignment -->
        <template v-else-if="source === 'assignments'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject</label
            >
            <input
              v-model="subject"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class</label
            >
            <input
              v-model="classes"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Teacher</label
            >
            <input
              v-model="teacher"
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
              v-model="dueDate"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </template>

        <!-- result -->
        <template v-else-if="source === 'results'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Subject</label
            >
            <input
              v-model="subject"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Student</label
            >
            <input
              v-model="student"
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
                v-model="score"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Class</label
              >
              <input
                v-model="classes"
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
              v-model="teacher"
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
              v-model="date"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </template>

        <!-- event -->
        <template v-else-if="source === 'events'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Title</label
            >
            <input
              type="text"
              v-model="title"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class</label
            >
            <input
              v-model="classes"
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
              v-model="date"
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
                v-model="startTime"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >End Time</label
              >
              <input
                type="datetime"
                v-model="endTime"
                class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </template>

        <!-- announcement -->
        <template v-else-if="source === 'announcements'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Title</label
            >
            <input
              type="text"
              v-model="title"
              class="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Class</label
            >
            <input
              v-model="classes"
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
              v-model="date"
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
            @click="handleAdd"
          >
            {{ handleAdd ? "Add" : "Adding ..." }}
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
const isModalVisible = ref(modalStore.addModal);

const title = ref("");
const teacher = ref("");
const teachers = ref([]);
const studentId = ref("");
const grade = ref("");
const capacity = ref("");
const supervisor = ref("");
const name = ref("");
const email = ref("");
const photo = ref("");
const score = ref("");
const subject = ref("");
const subjects = ref([]);
const classes = ref([]);
const phone = ref("");
const student = ref("");
const address = ref("");
const date = ref("");
const dueDate = ref("");

const startTime = ref("");
const endTime = ref("");
const source = ref(modalStore.source);

// Watchers to sync with modal store
watch(
  () => modalStore.addModal,
  (newVal) => {
    isModalVisible.value = newVal;
  },
  { immediate: true }
);

watch(
  () => modalStore.source,
  (newVal) => {
    source.value = newVal;
  }
);

const handleCancel = () => {
  modalStore.addModal = false;
  modalStore.modalId = null;
};

const handleAdd = async () => {
  try {
    if (source.value === "teachers") {
      console.log("hello from teachers");
    } else if (source.value === "students") {
      console.log("hello from students");
    } else if (source.value === "parents") {
      console.log("hello from parents");
    } else if (source.value === "subjects") {
      console.log("hello from subjects");
    } else if (source.value === "classes") {
      console.log("hello from classes");
    } else if (source.value === "lessons") {
      console.log("hello from lessons");
    } else if (source.value === "exams") {
      console.log("hello from exams");
    } else if (source.value === "assignments") {
      console.log("hello from assignments");
    } else if (source.value === "results") {
      console.log("hello from results");
    } else if (source.value === "events") {
      console.log("hello from events");
    } else if (source.value === "announcements") {
      console.log("hello from announcements");
    }
    modalStore.addModal = false;
  } catch (error) {
    console.error(error);
  }
};
</script>
