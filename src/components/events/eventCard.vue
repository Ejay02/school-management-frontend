<template>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="event in events"
      :key="event.id"
      class="relative bg-gray-200 cursor-pointer rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
    >
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center">
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                event.status === 'SCHEDULED'
                  ? 'bg-eduSky text-blue-800'
                  : event.status === 'CANCELLED'
                  ? 'bg-red-200 text-red-800'
                  : event.status === 'COMPLETED'
                  ? 'bg-green-200 text-green-800'
                  : '',
              ]"
            >
              <span
                v-if="!eventStore.isEventRead(event.id)"
                class="mr-2 inline-block w-2 h-2 bg-red-500 rounded-full"
              ></span>
              {{ event.status }}
            </span>

            <span
              v-if="eventStore.isNewEvent(event.id) && !eventStore.isEventRead(event.id)"
              class="ml-2 inline-block px-2 py-1 text-xs font-semibold text-orange-600 bg-orange-100 border border-orange-600 rounded"
            >
              NEW
            </span>
          </div>

          <div class="flex items-center">
            <span class="text-gray-600 text-xs uppercase font-semibold">{{
              formatEventType(event.type)
            }}</span>
          </div>
        </div>

        <h2 class="text-xl font-bold text-gray-800 mb-2">
          {{ event.title }}
        </h2>

        <div class="text-gray-600 mb-4">
          <p class="line-clamp-3">{{ event.description }}</p>
        </div>

        <div class="space-y-2">
          <div class="flex items-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5 mr-2 text-indigo-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z"
              />
            </svg>

            {{ formatEventDate(event.startTime) }} -
            {{ formatEventDate(event.endTime) }}
          </div>

          <div class="">
            <div class="flex items-center text-gray-600">
              <i class="fa-regular fa-clock w-5 h-5 mr-2 text-indigo-500"></i>

              {{ formatTime(event.startTime) }} -
              {{ formatTime(event.endTime) }}
            </div>
          </div>

          <div class="flex items-center text-gray-600">
            <svg
              class="w-5 h-5 mr-2 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>

            {{ event.location || "No location specified" }}
          </div>
        </div>

        <div class="mt-4 flex justify-between items-center">
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span class="text-sm text-gray-600">{{
              formatTargetRoles(event.targetRoles)
            }}</span>
          </div>

          <div class="flex justify-between">
            <router-link :to="`/event/${event.id}`">
              <button
                @click="handleMarkEventAsRead(event.id)"
                class="bg-eduSky text-indigo-600 hover:bg-eduSkyLight px-3 py-1 rounded-md text-sm transition duration-300"
              >
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </router-link>
            <!--  -->
            <div class="flex items-center gap-2" v-if="isCreator">
              <button
                @click="showDelModal(event.id, event.title, 'eventList')"
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "../../store/userStore";
import { useEventStore } from "../../store/eventStore";
import { useModalStore } from "../../store/useModalStore";
import { formatEventDate, formatTime } from "../../utils/date.holidays";
import { formatEventType, formatTargetRoles } from "../../utils/utility";

const props = defineProps({
  events: {
    type: Array,
    required: true,
  },
});

const userStore = useUserStore();
const modalStore = useModalStore();
const eventStore = useEventStore();

const isCreator = computed(
  () => props.events[0].creatorId === userStore.userInfo.id
);

const showDelModal = (id, title, type) => {
  modalStore.deleteModal = true;
  modalStore.modalId = id;
  modalStore.modalTitle = title;
  modalStore.source = type;
};

const handleMarkEventAsRead = async (eventId) => {
  await eventStore.markEventAsRead(eventId);
};
</script>
