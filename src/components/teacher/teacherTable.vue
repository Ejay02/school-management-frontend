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
              {{ item?.name[0]?.toUpperCase() || "N"
              }}{{ item?.surname[0].toUpperCase() || "A" }}
            </div>
          </div>

          <div class="flex flex-col">
            <div class="font-semibold capitalize">
              {{ item?.name }} {{ item?.surname }}
            </div>
            <div class="text-xs text-gray-400">{{ item?.email }}</div>
          </div>
        </td>
        <!-- <td class="hidden md:table-cell">
          {{ item?.teacherId?.slice(0, 8) }} ...
        </td> -->
        <td class="hidden md:table-cell">
          <span
            class="copy-id relative cursor-pointer"
            @click="copyId(item.teacherId)"
          >
            {{ item?.teacherId?.slice(0, 8) }}...
            <span
              class="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 transition-opacity duration-300 pointer-events-none"
            >
              Copy to clipboard
            </span>
          </span>
        </td>

        <td class="hidden md:table-cell">
          {{ item?.subjects.join(", ") || "N/A" }}
        </td>
        <td class="hidden md:table-cell">
          {{ item?.classes.join(", ") || "N/A" }}
        </td>
        <td class="hidden md:table-cell">{{ item?.phone || "N/A" }}</td>
        <td class="hidden md:table-cell capitalize">
          {{ item?.address || "N/A" }}
        </td>
        <td>
          <div
            class="flex items-center gap-2 relative"
            v-if="
              role.toLowerCase() === 'super_admin' ||
              role.toLowerCase() === 'admin'
            "
          >
            <router-link :to="`/teacher/${item?.id}`" class="group relative">
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

            <!-- admin shouldnt updateother  user deets just assign classes etc -->
             <!--  -->
            <!-- <div
              class="group relative"
              @click="showEditModal(item.id, item.title, item, 'teacherList')"
            >
              <button
                class="w-6 h-6 flex items-center justify-center rounded-full bg-eduYellow"
              >
                <i class="fa-solid fa-pen-to-square text-xs text-gray-500"></i>
              </button>
              <span
                class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              >
                Edit
              </span>
            </div> -->

            <button
              v-if="role.toLowerCase() === 'super_admin'"
              @click="showDelModal(item.id, item.name, 'teacherList')"
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
import { useNotificationStore } from "../../store/notification";
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
const modalStore = useModalStore();
const notificationStore = useNotificationStore();

const role = userStore.currentRole;

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

const copyId = (id) => {
  if (!id) return;
  navigator.clipboard
    .writeText(id)
    .then(() => {
      notificationStore.addNotification({
        type: "success",
        message: `Teacher Id copied to clipboard!`,
      });
    })
    .catch((err) => {
      notificationStore.addNotification({
        type: "error",
        message: `Error copying to clipboard - ${err.message}`,
      });
    });
};

// const showAddModal = (id, title, type) => {
//   modalStore.addModal = true;
//   modalStore.modalId = id;
//   modalStore.modalTitle = title;
//   modalStore.source = type;
// };
</script>

<style scoped>
.copy-id:hover .tooltip {
  opacity: 1;
}
</style>
