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
            <div class="font-semibold">{{ item?.subject }}</div>
          </div>
        </td>

        <td class="hidden md:table-cell">{{ item?.student }}</td>
        <td class="hidden md:table-cell">{{ item?.score }}</td>
        <td class="hidden md:table-cell">{{ item?.teacher }}</td>
        <td class="hidden md:table-cell">{{ item?.class }}</td>
        <td class="hidden md:table-cell">{{ item?.date }}</td>

        <td>
          <div class="flex items-center gap-2">
            <div
              class="group relative"
              @click="showEditModal(item.id, item.title, item, 'resultList')"
            >
              <button
                class="w-6 h-6 flex items-center justify-center rounded-full bg-eduSky"
              >
                <img src="/edit.png" alt="view" class="h-3 w-3" />
              </button>
              <span
                class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              >
                Edit
              </span>
            </div>

            <button
              v-if="role == 'admin'"
              @click="showDelModal(item.id, item.subject, 'resultList')"
              class="group relative w-6 h-6 flex items-center justify-center rounded-full bg-eduPurple"
            >
              <img src="/delete.png" alt="delete" class="h-3 w-3" />
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
