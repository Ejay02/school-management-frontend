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

    <div class="flex justify-between items-center mb-6">
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
      <ListSkeleton v-if="eventStore.loading" v-for="i in 3" :key="`skeleton-${i}`" />

      <ErrorScreen v-else-if="eventStore.error" />

      <!-- Empty state -->
      <EmptyState
        v-else-if="!eventStore.events.length"
        icon="fa-solid fa-calendar-days"
        heading="No Event Found"
        description="There are currently no events scheduled."
      />

      <!-- Card View -->

      <div
        class="cursor-pointer p-5 odd:bg-eduSkyLight even:bg-eduPurpleLight hover:bg-gray-100 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition-all"
        v-for="event in latestEvents"
        :key="event.id"
        :class="{
          'border-l-4 border-l-indigo-500': !eventStore.isEventRead(event.id),
        }"
      >
        <router-link
          :to="`/event/${event.id}`"
          @click="handleMarkEventAsRead(event.id)"
          class="block"
        >
          <!-- {{ event }} -->
          <div class="flex items-center justify-between">
            <h1
              class="font-medium text-gray-600 capitalize line-clamp-1 text-sm"
            >
              {{ event.title }}
            </h1>
            <div class="mb-4">
              <div class="text-gray-600 text-[10px] ml-4">
                {{ formatDate(event?.startTime) }}
              </div>
            </div>
          </div>

          <div class="justify-between flex">
            <span class="line-clamp-2 text-gray-400 text-sm flex-1">
              {{ event.description }}
            </span>

            <div class="flex gap-2 items-start">
              <!-- Add NOW indicator -->
              <span
                v-if="isEventNow(event)"
                class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap self-start text-[10px] text-green-700 bg-green-50 ring-green-600/20 animate-pulse"
              >
                NOW
              </span>

              <span
                class="inline-flex items-center rounded-md whitespace-nowrap self-start text-md ml-2"
              >
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
                    <i
                      class="fa-regular fa-calendar-xmark mr-1 text-red-500"
                    ></i>
                  </div>
                </div>
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useStorageSync } from "../../composables/useStorageSync";

import { socket } from "../../socket/socket";
import { useEventStore } from "../../store/eventStore";
import {
  fetchCountry,
  fetchHolidays,
  formatDate,
} from "../../utils/date.holidays";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import ListSkeleton from "../skeletonLoaders/listSkeleton.vue";


const eventStore = useEventStore();

const selectedColor = ref("purple");
const holidays = ref([]);

const currentMonth = ref({
  start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
});

const latestEvents = computed(() => {
  const now = new Date();

  return [...eventStore.events]
    .sort((a, b) => {
      const aStart = new Date(a.startTime);
      const bStart = new Date(b.startTime);
      const aEnd = new Date(a.endTime);
      const bEnd = new Date(b.endTime);

      // Check if events are currently happening
      const aIsNow = now >= aStart && now <= aEnd;
      const bIsNow = now >= bStart && now <= bEnd;

      if (aIsNow && !bIsNow) return -1; // a is happening now, show first
      if (!aIsNow && bIsNow) return 1; // b is happening now, show first

      // If neither is happening now, sort by closest upcoming
      if (aStart > now && bStart > now) {
        return aStart - bStart; // Show soonest upcoming first
      }

      // If one is past and one is upcoming, show upcoming first
      if (aStart > now) return -1;
      if (bStart > now) return 1;

      // If both are past, show most recent first
      return bEnd - aEnd;
    })
    .slice(0, 3); // Keep only first 3 events
});

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

  socket.on("eventUpdated", (data) => {
    if (data && data.event && data.event.id) {
      // Find and update the event in the store
      const index = eventStore.events.findIndex(
        (event) => event.id === data.event.id
      );
      if (index !== -1) {
        eventStore.events[index] = data.event;
      }
    }
  });
});

onUnmounted(() => {
  // Cleanup to prevent memory leaks
  socket.off("eventCreated");
  socket.off("deleteEvent");
  socket.off("eventUpdated");
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

// Add this helper function
const isEventNow = (event) => {
  const now = new Date();
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  return now >= startTime && now <= endTime;
};
</script>

<style scoped>
.vc-container .vc-weekday-1,
.vc-container .vc-weekday-7 {
  color: #6366f1;
}
</style>
