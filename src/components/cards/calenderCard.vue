<template>
  <div class="p-4 bg-white mt-1 mb-2 rounded-lg shadow-lg cursor-pointer">
    <VCalendar
      :color="selectedColor"
      :attributes="attrs"
      :initial-page="currentMonth"
      expanded
      transparent
      borderless
    />

    <div class="flex justify-between items-center mb-6 mt-10">
      <h1 class="text-lg font-semibold">Events</h1>
      <div
        class="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
          />
        </svg>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <LoadingScreen v-if="eventStore.loading" message="Loading Events..." />
      <ErrorScreen v-else-if="eventStore.error" />

      <!-- Empty state -->
      <EmptyState
        v-else-if="!eventStore.events.length"
        icon="fa-solid fa-calendar-days"
        heading="No Events Found"
        description="There are currently no events scheduled."
      />

      <!-- Card View -->

      <div
        class="cursor-pointer p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-eduSky even:border-t-eduPurple hover:bg-gray-100"
        v-for="event in latestEvents"
        :key="event.id"
      >
        <router-link
          :to="`/event/${event.id}`"
          @click="handleMarkEventAsRead(event.id)"
        >
          <!-- {{ event }} -->
          <div class="flex items-center justify-between mb-2">
            <h1 class="font-semibold text-gray-600 capitalize">
              {{ event.title }}
            </h1>
            <div class="mb-4">
              <div class="text-gray-400 text-xs ml-4">
                {{ formatTime(event.startTime) }} -
                {{ formatTime(event.endTime) }}
              </div>
            </div>
          </div>

          <div class="justify-between flex mt-2">
            <span class="line-clamp-2 text-gray-400 text-sm flex-1">
              {{ event.description }}
            </span>

            <span
              class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap self-start"
              :class="{
                'text-green-700 bg-green-50 ring-green-600/20':
                  event.status === 'completed',
                'bg-yellow-50 text-yellow-800 ring-yellow-600/20':
                  event.status === 'scheduled',
                'bg-red-50 text-red-700 ring-red-600/10':
                  event.status === 'cancelled',
              }"
            >
              <span
                v-if="!eventStore.isEventRead(event.id)"
                class="mr-2 inline-block w-2 h-2 bg-red-500 rounded-full"
              ></span>
              {{ event.status }}</span
            >

            <span
              v-if="
                eventStore.isNewEvent(event.id) &&
                !eventStore.isEventRead(event.id)
              "
              class="ml-2 inline-block px-2 py-1 text-xs font-semibold text-orange-600 bg-orange-100 border border-orange-600 rounded"
            >
              NEW
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  fetchCountry,
  fetchHolidays,
  formatTime,
} from "../../utils/date.holidays";
import socket from "../../socket/socket";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";
import { useEventStore } from "../../store/eventStore";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useStorageSync } from "../../composables/useStorageSync";

const eventStore = useEventStore();

const selectedColor = ref("purple");
const holidays = ref([]);

const currentMonth = ref({
  start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
});

const latestEvents = computed(() => [...eventStore.events].slice(0, 3));

onMounted(async () => {
  await eventStore.fetchEvents();

  const countryCode = await fetchCountry();
  const fetchedHolidays = await fetchHolidays(countryCode);
  holidays.value = fetchedHolidays;

  // Setup socket listener for new events
  socket.on("eventCreated", (data) => {
    if (data && data.event && data.event.id) {
      // Add the new event to the store
      eventStore.addNewEvent(data.event);
    }
  });

  socket.on("deleteEvent", (data) => {
    if (data && data.eventId) {
      // Update the store by removing the deleted event
      eventStore.events = eventStore.events.filter(
        (event) => event.id !== data.eventId
      );
    }
  });
});

onUnmounted(() => {
  // Cleanup to prevent memory leaks
  socket.off("eventCreated");
  socket.off("deleteEvent");
});

const attrs = computed(() => {
  const today = new Date().toISOString().split("T")[0];

  const eventAttrs = eventStore.events.map((event) => ({
    dates: [event.startTime.split("T")[0]],
    dot: { color: event.color || "blue" },
    popover: { label: event.title },
  }));

  const holidayAttrs = holidays.value.map((holiday) => ({
    dates: [holiday.date],
    dot: { color: "green" },
    popover: { label: holiday.title },
  }));

  const todayAttr = {
    dates: [today],
    highlight: {
      color: "purple", // Customize the highlight color
      fillMode: "light", // Options: solid, light, outline, transparent
    },
    popover: { label: "Today" },
  };

  return [...eventAttrs, ...holidayAttrs, todayAttr];
});

const handleMarkEventAsRead = async (eventId) => {
  await eventStore.markEventAsRead(eventId);
};

useStorageSync("readEvents", (newReadEvents) => {
  eventStore.readEvents = newReadEvents || [];
});
</script>

<style scoped>
.vc-container .vc-weekday-1,
.vc-container .vc-weekday-7 {
  color: #6366f1;
}
</style>
