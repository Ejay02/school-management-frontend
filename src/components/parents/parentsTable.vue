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
          <div class="">
            <img
              v-if="item?.photo"
              :src="item?.photo"
              alt="user"
              class="w-10 h-10 rounded-full mr-3 xl:block object-cover"
            />
            <div
              v-else
              class="w-10 h-10 rounded-full mr-3 bg-eduPurple flex items-center justify-center font-bold"
            >
              {{ item?.name[0].toUpperCase()
              }}{{ item?.surname[0].toUpperCase() }}
            </div>
          </div>

          <div class="flex flex-col">
            <div class="font-semibold capitalize">
              {{ item?.name }} {{ item?.surname }}
            </div>
            <div class="text-xs text-gray-400">{{ item?.email }}</div>
          </div>
        </td>

        <td class="hidden md:table-cell capitalize">
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(student, index) in item?.students"
              :key="index"
              class="px-2 py-1 bg-gray-200 rounded text-xs"
            >
              {{ student }}
            </span>
          </div>
        </td>

        <!-- <td class="hidden md:table-cell capitalize">{{ item?.students.join(", ") }}</td> -->

        <td class="hidden md:table-cell">{{ item?.phone }}</td>
        <td class="hidden md:table-cell">{{ item?.address }}</td>
        <td>
          <div class="flex items-center gap-2">
            <!-- <div
              class="group relative"
              @click="showEditModal(item.id, item.title, item, 'parentList')"
            >
              <button
                class="w-6 h-6 flex items-center justify-center rounded-full bg-eduSky"
              >
                <i class="fa-solid fa-pen-to-square text-xs text-gray-500"></i>
                <span
                  class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                >
                  Edit
                </span>
              </button>
            </div> -->
            <div class="p-2"></div>

            <button
              v-if="role.toLowerCase() === 'super_admin'"
              @click="showDelModal(item.id, item.name, 'parentList')"
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
