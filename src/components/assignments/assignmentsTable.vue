<template>
  <table class="w-full mt-4 cursor-pointer">
    <thead>
      <tr class="text-left text-gray-500 text-sm">
        <th
          v-for="column in columns"
          :key="column?.header"
          :class="['flex-1', 'text-left', 'p-2', column?.class || '']"
        >
          {{ column?.header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in data"
        :key="item?.id"
        class="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-eduSkyLight"
      >
        <td class="flex items-center gap-4 p-2">
          <div class="flex flex-col">
            <div class="font-semibold">{{ item?.subject?.name }}</div>
          </div>
        </td>

        <td class="hidden md:table-cell">{{ item?.class?.name }}</td>
        <td class="hidden md:table-cell">
          {{ item?.teacher?.name }} {{ item?.teacher?.surname }}
        </td>
        <td class="hidden md:table-cell">{{ formatDate(item?.dueDate) }}</td>

        <td class="">
          <div class="flex">
            <router-link :to="`/assignment/${item?.id}`" class="group relative">
              <button
                class="group relative text-indigo-600 hover:bg-eduSkyLight px-3 py-1 rounded-md text-sm transition duration-300"
              >
                <i class="fa-solid fa-arrow-right"></i>
              </button>
              <span
                class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex"
              >
                View
              </span>
            </router-link>
            <div
              class="flex items-center gap-2"
              v-if="role.toLowerCase() === 'teacher'"
            >
              <!-- edit -->
              <div
                class="group relative"
                @click="
                  showEditModal(item.id, item.title, item, 'assignmentList')
                "
              >
                <button
                  class="w-6 h-6 flex items-center justify-center rounded-full"
                >
                  <i
                    class="fa-solid fa-pen-to-square text-xs text-gray-500"
                  ></i>
                  <span
                    class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  >
                    Edit
                  </span>
                </button>
              </div>
              <!-- del -->
              <button
                @click="showDelModal(item?.id, item?.title, 'assignmentList')"
                class="group relative w-6 h-6 flex items-center justify-center rounded-full"
              >
                <i class="fa-solid fa-trash-can text-red-600 text-xs"></i>
                <span
                  class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                >
                  Delete
                </span>
              </button>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
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

const showDelModal = (id, title, type) => {
  modalStore.deleteModal = true;
  modalStore.modalId = id;
  modalStore.modalTitle = title;
  modalStore.source = type;
};

const showEditModal = (id) => {
  router.push(`dashboard/assignment/${id}/edit`);
};
</script>

<style scoped></style>
