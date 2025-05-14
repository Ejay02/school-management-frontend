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
            <div class="font-semibold">{{ item?.name }}</div>
            <div class="text-xs text-gray-500">{{ item?.class?.name }}</div>
          </div>
        </td>

        <td class="hidden md:table-cell">
          <template v-if="item?.teachers && item.teachers.length">
            <span
              v-for="(teacher, idx) in item.teachers"
              :key="teacher.id"
              class="teacher-tag capitalize"
            >
              {{ teacher.name }} {{ teacher?.surname
              }}<span v-if="idx < item.teachers.length - 1">, </span>
            </span>
          </template>
          <template v-else>
            <span>N/A</span>
          </template>
        </td>

        <!-- <td class="hidden md:table-cell">{{ item?.teachers.join(", ") }}</td> -->

        <td>
          <div
            class="flex items-center gap-2"
            v-if="
              role.toLowerCase() === 'teacher' ||
              role.toLowerCase() === 'admin' ||
              role.toLowerCase() === 'super_admin'
            "
          >
            <div
              class="group relative"
              @click="showEditModal(item.id, item.name, item, 'subjectList')"
            >
              <button
                class="w-6 h-6 flex items-center justify-center rounded-full"
              >
                <i class="fa-solid fa-pen-to-square text-xs text-gray-500"></i>
                <span
                  class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                >
                  Edit
                </span>
              </button>
            </div>

            <button
              @click="showDelModal(item.id, item.name, 'subjectList')"
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
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useModalStore } from "../../store/useModalStore";
import { useUserStore } from "../../store/userStore";

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

const userStore = useUserStore();

const role = userStore.currentRole;

const modalStore = useModalStore();

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

<style scoped></style>
