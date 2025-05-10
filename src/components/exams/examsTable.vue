<template>
  <div>
    <!-- Exams cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6 cursor-pointer">
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

            <span>{{ getQuestionCount(item) }} Question(s)</span>
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
import { computed } from "vue";
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

// Filter and sort exams
const filteredData = computed(() => {
  let exams = [...(props.data || [])];

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

const getQuestionCount = (item) => {
  try {
    if (item?.content) {
      const parsedContent = JSON.parse(item.content);
      return parsedContent.questions?.length || 0;
    }
    return 0;
  } catch (error) {
    console.error("Error parsing exam content:", error);
    return 0;
  }
};
</script>

<style scoped>

</style>
