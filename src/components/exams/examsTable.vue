<template>
  <div>
    <!-- Filters and search -->
    <div class="my-4 flex flex-col md:flex-row gap-4 justify-between">
      <div class="relative w-full md:w-64">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search exams..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <div class="absolute left-3 top-2.5 text-gray-400">
          <i class="fa-solid fa-search"></i>
        </div>
      </div>

      <div class="flex gap-2">
        <select
          v-model="sortBy"
          class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="date">Sort by Date</option>
          <option value="subject">Sort by Subject</option>
          <option value="class">Sort by Class</option>
          <option value="teacher">Sort by Teacher</option>
        </select>
      </div>
    </div>

    <!-- Exams cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
      <div
        v-for="item in filteredData"
        :key="item?.id"
        class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
      >
        <!-- Card header with subject color -->
        <div
          class="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white flex items-center justify-between"
        >
          <div class="">
            <h3 class="font-bold text-lg truncate capitalize">
              {{ item?.title }}
            </h3>
            <div class="flex items-center mt-1 text-indigo-100">
              <!-- <i class="fa-solid fa-chalkboard-user mr-2"></i> -->
              <i class="fa-solid fa-book mr-2"></i>
              <span>{{ item?.subject?.name }}</span>
            </div>
          </div>
          <!--  -->
          <div class="">
            <div class="mr-4 relative">
              <img
                v-if="item?.teacher?.image"
                :src="item?.teacher?.image"
                :alt="`${item?.teacher?.name} avatar`"
                class="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
              />

              <div
                v-else
                class="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm border-2 border-indigo-200 capitalize"
              >
                {{ item?.teacher?.name[0] }}{{ item?.teacher?.surname[0] }}
              </div>
            </div>
          </div>
        </div>

        <!-- Card content -->
        <div class="p-4 flex-1 flex flex-col">
          <div class="mb-3 text-sm text-gray-600 line-clamp-3">
            {{ item?.description || "No description provided" }}
          </div>

          <div class="flex items-center text-sm text-gray-500 mt-2">
            <i class="fa-solid fa-calendar mr-2"></i>
            <span>{{ formatDate(item?.date) }}</span>
          </div>

          <div class="flex items-center text-sm text-gray-500 mt-2">
            <i class="fa-solid fa-clock mr-2"></i>
            <span
              >{{ formatDate(item?.startTime) || "Time not specified" }} -
              {{ formatDate(item?.endTime) || "Time not specified" }}</span
            >
          </div>
          <div class="flex items-center text-sm text-gray-500 mt-2">
            <i class="fa-solid fa-question-circle mr-2"></i>
            <span>20 Questions</span>
            <!-- <span>{{ getQuestionCount(exam)  }} Questions</span> -->
          </div>
        </div>

        <!-- Card actions -->
        <div
          class="border-t border-gray-200 p-3 bg-gray-50 flex justify-between"
        >
          <button
            @click="viewExam(item.id)"
            class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
          >
            <i class="fa-solid fa-eye mr-1"></i> View
          </button>

          <div class="flex gap-2">
            <button
              @click="showEditModal(item.id, item.title, item, 'examList')"
              class="text-gray-600 hover:text-gray-800 text-sm flex items-center"
            >
              <i class="fa-solid fa-pen-to-square mr-1"></i> Edit
            </button>

            <button
              v-if="
                role.toLowerCase() === 'super_admin' ||
                role.toLowerCase() === 'admin' ||
                role.toLowerCase() === 'teacher'
              "
              @click="showDelModal(item.id, item.title, 'examList')"
              class="text-red-600 hover:text-red-800 text-sm flex items-center"
            >
              <i class="fa-solid fa-trash-can mr-1"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useModalStore } from "../../store/useModalStore";
import { useUserStore } from "../../store/userStore";
import { formatDate } from "../../utils/date.holidays";

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});

const router = useRouter();
const userStore = useUserStore();
const role = userStore.currentRole;
const modalStore = useModalStore();

const searchQuery = ref("");
const sortBy = ref("date");

// Filter and sort exams
const filteredData = computed(() => {
  let exams = [...(props.data || [])];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    exams = exams.filter(
      (exam) =>
        exam.subject?.toLowerCase().includes(query) ||
        exam.class?.toLowerCase().includes(query) ||
        exam.teacher?.toLowerCase().includes(query)
    );
  }

  // Apply sorting
  if (sortBy.value === "date") {
    exams.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy.value === "subject") {
    exams.sort((a, b) => a.subject?.localeCompare(b.subject));
  } else if (sortBy.value === "class") {
    exams.sort((a, b) => a.class?.localeCompare(b.class));
  } else if (sortBy.value === "teacher") {
    exams.sort((a, b) => a.teacher?.localeCompare(b.teacher));
  }

  return exams;
});

const viewExam = (examId) => {
  router.push(`/exams/${examId}`);
};

const showDelModal = (id, title, type) => {
  modalStore.deleteModal = true;
  modalStore.modalId = id;
  modalStore.modalTitle = title;
  modalStore.source = type;
};

const showEditModal = (id, title, data, type) => {
  modalStore.editModal = true;
  modalStore.modalId = id;
  modalStore.modalTitle = title;
  modalStore.data = data;
  modalStore.source = type;
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
