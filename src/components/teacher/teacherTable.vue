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
        <td class="flex items-center gap-2 p-2">
          <div class="">
            <img
              v-if="item?.photo"
              :src="item?.photo"
              alt="user"
              class="w-10 h-10 rounded-full xl:block object-cover"
            />
            <div
              v-else
              class="w-10 h-10 rounded-full bg-eduPurple flex items-center justify-center font-bold"
            >
              {{ getInitials(item?.name, item?.surname) }}
            </div>
          </div>

          <div class="flex flex-col">
            <div class="font-semibold capitalize">
              {{ formatPersonName(item?.name, item?.surname) }}
            </div>
            <div class="text-xs text-gray-400">
              {{ formatDisplayValue(item?.institutionalEmail || item?.email) }}
            </div>
            <div class="mt-1">
              <span
                class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                :class="
                  item?.isActive === false
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-green-100 text-green-700'
                "
              >
                {{ item?.isActive === false ? "Suspended" : "Active" }}
              </span>
            </div>
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
            {{ formatDisplayValue(item?.teacherId?.slice(0, 8))
            }}<template v-if="item?.teacherId">...</template>
            <span
              class="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 transition-opacity duration-300 pointer-events-none"
            >
              Copy to clipboard
            </span>
          </span>
        </td>

        <td class="hidden md:table-cell">
          {{ formatListDisplay(item?.subjects) }}
        </td>
        <td class="hidden md:table-cell">
          {{ formatListDisplay(item?.classes) }}
        </td>
        <td class="hidden md:table-cell">
          {{ formatDisplayValue(item?.phone) }}
        </td>
        <td class="hidden md:table-cell capitalize">
          {{ formatDisplayValue(item?.address) }}
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

            <button
              @click="toggleActiveStatus(item)"
              class="group relative inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
              :class="
                item?.isActive === false
                  ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              "
              :disabled="statusLoadingId === item.id"
            >
              {{ item?.isActive === false ? "Activate" : "Suspend" }}
            </button>

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
import { ref } from "vue";
import {
  formatDisplayValue,
  formatListDisplay,
  formatPersonName,
  getInitials,
} from "../../utils/displayValue";
import { useNotificationStore } from "../../store/notification";
import { useModalStore } from "../../store/useModalStore";
import { useUserStore } from "../../store/userStore";
import { apolloClient } from "../../../apollo-client";
import { setUserActiveStatus } from "../../graphql/mutations";
import { extractGraphQLErrorMessage } from "../../utils/graphqlError";

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
const statusLoadingId = ref("");

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

const toggleActiveStatus = async (item) => {
  if (!item?.id) return;
  const currentRole = String(role || "").toLowerCase();
  if (currentRole !== "super_admin" && currentRole !== "admin") return;

  statusLoadingId.value = item.id;
  try {
    const nextIsActive = item.isActive === false;
    const { data } = await apolloClient.mutate({
      mutation: setUserActiveStatus,
      variables: { targetId: item.id, isActive: nextIsActive },
    });

    const updated = data?.setUserActiveStatus;
    if (updated && typeof updated.isActive !== "undefined") {
      item.isActive = Boolean(updated.isActive);
      item.deactivatedAt = updated.deactivatedAt || null;
    } else {
      item.isActive = nextIsActive;
      item.deactivatedAt = nextIsActive ? null : new Date().toISOString();
    }

    notificationStore.addNotification({
      type: "success",
      message: nextIsActive ? "Teacher reactivated" : "Teacher suspended",
    });
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: extractGraphQLErrorMessage(error, "Unable to update status"),
    });
  } finally {
    statusLoadingId.value = "";
  }
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
