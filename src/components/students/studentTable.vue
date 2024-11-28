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
        class="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-eduPurpleLight"
      >
        <td class="flex items-center gap-4 p-2">
          <img
            :src="item?.photo"
            alt="user"
            class="w-10 h-10 rounded-full mr-3 xl:block object-cover"
          />

          <div class="flex flex-col">
            <div class="font-semibold">{{ item?.name }}</div>
            <div class="text-xs text-gray-400">{{ item?.class }}</div>
          </div>
        </td>
        <td class="hidden md:table-cell">{{ item?.studentId }}</td>
        <td class="hidden md:table-cell">{{ item?.grade }}</td>

        <td class="hidden md:table-cell">{{ item?.phone }}</td>
        <td class="hidden md:table-cell">{{ item?.address }}</td>
        <td>
          <div class="flex items-center gap-2">
            <router-link :to="`/list/students/${item?.id}`">
              <button
                class="w-6 h-6 flex items-center justify-center rounded-full bg-eduSky"
              >
                <img src="/view.png" alt="view" class="h-3 w-3" />
              </button>
            </router-link>

            <button
              v-if="role == 'admin'"
              @click="showDelModal(item.id, item.name, 'studentList')"
              class="w-6 h-6 flex items-center justify-center rounded-full bg-eduPurple"
            >
              <img src="/delete.png" alt="delete" class="h-3 w-3" />
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useUserStore } from "../../store/userStore";
import { useModalStore } from "../../store/useModalStore";

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
</script>

<style scoped></style>
