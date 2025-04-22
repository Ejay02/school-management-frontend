<template>
  <table class="w-full mt-4 cursor-pointer">
    <thead>
      <tr class="text-left text-gray-500 text-sm">
        <th
          v-for="(column, index) in columns"
          :key="column?.header"
          :class="['flex-1', 'text-left', 'p-2', column?.class || '']"
        >
          <div class="flex">
            <div :class="{ 'ml-4': index === 0, 'ml-0': index !== 0 }">
              {{ column?.header }}
            </div>
          </div>
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
          <div class="flex">
            <div class="mr-2">
              <span class="flex gap-1">
                <div class="">
                  <span
                    v-if="!eventStore.isEventRead(item.id)"
                    class="mr-1 inline-block w-2 h-2 bg-red-500 rounded-full"
                  ></span>
                  <span v-else class="rounded-full mr-3 h-2 w-2"></span>
                </div>

                <!-- {{ item.status }} -->
                <div class="hidden md:table-cell">
                  <div class="" v-if="item.status === 'COMPLETED'">
                    <i
                      class="fa-regular fa-calendar-check mr-1 text-green-600"
                    ></i>
                  </div>
                  <div class="" v-if="item.status === 'SCHEDULED'">
                    <i class="fa-solid fa-calendar-day mr-1 text-blue-500"></i>
                  </div>
                  <div class="" v-if="item.status === 'CANCELLED'">
                    <i
                      class="fa-regular fa-calendar-xmark mr-1 text-red-500"
                    ></i>
                  </div>
                </div>
              </span>
            </div>
            <!--  -->
            <div class="flex">
              <div class="font-semibold">{{ item?.title }}</div>
              <span
                v-if="
                  eventStore.isNewEvent(item?.id) &&
                  !eventStore.isEventRead(item?.id)
                "
                class="ml-2 inline-block px-2 py-1 text-xs font-semibold text-orange-600 bg-orange-100 border border-orange-600 rounded"
              >
                New
              </span>
            </div>
          </div>
        </td>

        <td class="hidden md:table-cell">
          {{ item?.class }}
        </td>
        <td class="hidden md:table-cell">{{ item?.date }}</td>
        <td class="hidden md:table-cell">{{ item?.startTime }}</td>
        <td class="hidden md:table-cell">{{ item?.endTime }}</td>

        <td class="flex items-center justify-center gap-1">
          <!-- cancel -->
          <div class="">
            <button
              v-if="isCreator && item.status === 'SCHEDULED'"
              @click="handleCancelEvent(item.id, item.title)"
              class="group relative w-6 h-6 flex items-center justify-center rounded-full"
            >
              <i class="fa-solid fa-ban text-orange-600 text-xs"></i>
              <span
                class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              >
                Cancel Event
              </span>
            </button>
            <div v-else class="w-6 h-6"></div>
          </div>

          <!-- view -->
          <div class="">
            <router-link :to="`/event/${item.id}`">
              <button
                @click="handleMarkEventAsRead(item.id)"
                class="group relative text-indigo-600 hover:bg-eduSkyLight px-2 py-1 rounded-md text-sm transition duration-300"
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

          <!-- del -->
          <div class="flex items-center" v-if="isCreator">
            <button
              @click="showDelModal(item.id, item.title, 'eventList')"
              class=" group relative w-6 h-6 flex items-center justify-center rounded-full"
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
import { useEventStore } from "../../store/eventStore";
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
const eventStore = useEventStore();

const isCreator = computed(
  () => props.data[0].creatorId === userStore.userInfo.id
);

const handleMarkEventAsRead = async (eventId) => {
  await eventStore.markEventAsRead(eventId);
};

const showDelModal = (id, title, type) => {
  modalStore.deleteModal = true;
  modalStore.modalId = id;
  modalStore.modalTitle = title;
  modalStore.source = type;
};

const handleCancelEvent = (eventId, eventTitle) => {
  modalStore.cancelModal = true;
  modalStore.modalId = eventId;
  modalStore.modalTitle = eventTitle;
  modalStore.modalMessage = `Are you sure you want to cancel the event "${eventTitle}"?`;
  modalStore.confirmAction = "cancelEvent";
};
</script>

<style scoped></style>
