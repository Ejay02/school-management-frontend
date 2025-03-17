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
            <div class="font-semibold">{{ item?.title }}</div>
          </div>
        </td>

        <td class="">
          <span
            :class="[
              'px-2 py-1 rounded-full text-xs font-semibold',
              item.status === 'SCHEDULED'
                ? 'bg-eduSky text-blue-800'
                : item.status === 'CANCELLED'
                ? 'bg-red-200 text-red-800'
                : item.status === 'COMPLETED'
                ? 'bg-green-200 text-green-800'
                : '',
            ]"
          >
            <span
              v-if="!eventStore.isEventRead(item.id)"
              class="mr-1 inline-block w-2 h-2 bg-red-500 rounded-full"
            ></span>
            <span v-else class="rounded-full mr-3 h-2 w-2"></span>

            {{ item.status }}
          </span>
          <span
            v-if="eventStore.isNewEvent(item.id)"
            class="ml-2 inline-block px-2 py-1 text-xs font-semibold text-orange-600 bg-orange-100 border border-orange-600 rounded"
          >
            New
          </span>
        </td>

        <td class="hidden md:table-cell">
          {{ item?.class }}
        </td>
        <td class="hidden md:table-cell">{{ item?.date }}</td>
        <td class="hidden md:table-cell">{{ item?.startTime }}</td>
        <td class="hidden md:table-cell">{{ item?.endTime }}</td>

        <td class="flex gap-3">
          <div class="hidden md:table-cell">
            <router-link :to="`/event/${item.id}`">
              <button
                @click="handleMarkEventAsRead(item.id)"
                class="bg-eduSky group relative text-indigo-600 hover:bg-eduSkyLight px-2 py-1 rounded-md text-sm transition duration-300"
              >
                <i class="fa-solid fa-arrow-right"></i>
                <span
                  class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                >
                  View
                </span>
              </button>
            </router-link>
          </div>

          <div class="flex items-center" v-if="isCreator">
            <button
              @click="showDelModal(item.id, item.title, 'eventList')"
              class="ml-2 group relative w-6 h-6 flex items-center justify-center rounded-full bg-eduPurple"
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
import { computed } from "vue";
import { useUserStore } from "../../store/userStore";
import { useEventStore } from "../../store/eventStore";
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
const eventStore = useEventStore();

// const role = userStore.currentRole;

const isCreator = computed(
  () => props.data[0].creatorId === userStore.userInfo.id
);

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

const handleMarkEventAsRead = async (eventId) => {
  await eventStore.markEventAsRead(eventId);
};
</script>

<style scoped></style>
