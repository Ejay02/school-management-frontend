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
            <span class="flex">
              <div class="">
                <span
                  v-if="!eventStore.isEventRead(event.id)"
                  class="mr-2 inline-block w-2 h-2 bg-red-500 rounded-full"
                ></span>
              </div>
              <!-- {{ event.status }} -->
              <div class="">
                <div class="" v-if="event.status === 'COMPLETED'">
                  <i
                    class="fa-regular fa-calendar-check mr-1 text-green-600"
                  ></i>
                </div>
                <div class="" v-if="event.status === 'SCHEDULED'">
                  <i class="fa-solid fa-calendar-day mr-1 text-blue-500"></i>
                </div>
                <div class="" v-if="event.status === 'CANCELLED'">
                  <i class="fa-regular fa-calendar-xmark mr-1 text-red-700"></i>
                </div>
              </div>
              <!--  -->
            </span>

            <span
              v-if="
                eventStore.isNewEvent(event?.id) &&
                !eventStore.isEventRead(event?.id)
              "
              class="ml-2 inline-block px-2 py-1 text-xs font-semibold text-orange-600 bg-orange-100 border border-orange-600 rounded"
            >
              NEW
            </span>

            <span
              v-if="eventStore.isEventNow(event)"
              class="ml-2 inline-block px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 border border-green-600 rounded animate-pulse"
            >
              NOW
            </span>
          </div>

          <div class="flex items-center">
            <span class="text-gray-600 text-xs uppercase font-semibold">{{
              formatEventType(event.type)
            }}</span>
          </div>
        </div>

        <h2 class="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {{ event.title }}
        </h2>

        <div class="text-gray-500 mb-4">
          <p class="line-clamp-2 prose max-w-none font-serif text-lg">
            {{ event.description }}
          </p>
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
            <div v-if="event.targetRoles.length > 0" class="flex">
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

            <p v-else class="text-gray-700 flex items-center">
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
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                />
              </svg>
              Open to everyone
            </p>
          </div>

          <div class="flex justify-between">
            <router-link :to="`/event/${event.id}`">
              <button
                @click="handleMarkEventAsRead(event.id)"
                class="group relative text-indigo-600 hover:bg-eduSkyLight px-3 py-1 rounded-md text-sm transition duration-300"
              >
                <i class="fa-solid fa-arrow-right"></i>
                <span
                  class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                >
                  View
                </span>
              </button>
            </router-link>
            <!--  -->
            <div class="flex items-center gap-2" v-if="isCreator">
              <!-- Cancel -->
              <button
                @click="handleCancelEvent(event.id, event.title)"
                class="group relative w-6 h-6 flex items-center justify-center rounded-full"
                v-if="event.status === 'SCHEDULED'"
              >
                <i class="fa-solid fa-ban text-orange-600 text-xs"></i>
                <span
                  class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                >
                  Cancel Event
                </span>
              </button>

              <button
                @click="showDelModal(event.id, event.title, 'eventList')"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useEventStore } from "../../store/eventStore";
import { useModalStore } from "../../store/useModalStore";
import { useUserStore } from "../../store/userStore";
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

const handleCancelEvent = (eventId, eventTitle) => {
  modalStore.cancelModal = true;
  modalStore.modalId = eventId;
  modalStore.modalTitle = eventTitle;
  modalStore.modalMessage = `Are you sure you want to cancel the event "${eventTitle}"?`;
  modalStore.confirmAction = "cancelEvent";
};
</script>
