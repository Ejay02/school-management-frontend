<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <!-- top -->
      <div class="border-b p-4 flex items-center justify-between">
        <!-- View toggle buttons -->
        <fieldset class="inline-flex rounded-md shadow-sm justify-end">
          <legend class="sr-only">View mode selection</legend>
          <button
            @click="viewMode = 'cards'"
            :class="[
              'px-1 py-1 text-sm font-medium rounded-l-lg border border-r-0',
              viewMode === 'cards'
                ? ' bg-gradient-to-r from-indigo-600 to-purple-600  text-white border-eduPurple'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300',
            ]"
          >
            <i class="fas fa-th-large mr-1"></i> Cards
          </button>
          <button
            @click="viewMode = 'list'"
            :class="[
              'px-1 py-0 text-sm font-medium rounded-r-lg border',
              viewMode === 'list'
                ? ' bg-gradient-to-r from-indigo-600 to-purple-600  text-white border-eduPurple'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300',
            ]"
          >
            <i class="fas fa-list mr-1"></i> List
          </button>
        </fieldset>

        <TopList :txt="' '" />
      </div>

      <!-- Loading and error states -->
      <div class="container mx-auto px-4 py-8">
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
        <EventCard
          v-else-if="viewMode === 'cards'"
          :events="eventStore.events"
        />

        <!-- List View -->
        <div v-else-if="viewMode === 'list'" class="mt-4">
          <EventsTable :columns="columns" :data="formattedEvents" />
        </div>
      </div>

      <!-- pagination -->
      <Pagination />
    </div>
  </div>
</template>

<script setup>
import { socket } from "../../socket/socket";
import TopList from "../lists/topList.vue";
import Pagination from "../pagination.vue";
import EventCard from "./eventCard.vue";
import EventsTable from "./eventsTable.vue";

import { computed, onMounted, onUnmounted, ref } from "vue";
import { useStorageSync } from "../../composables/useStorageSync";
import { useEventStore } from "../../store/eventStore";
import { useUserStore } from "../../store/userStore";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";

const eventStore = useEventStore();
const userStore = useUserStore();

// Default view mode - could be set based on user role
const viewMode = ref(
  userStore.currentRole === "ADMIN" || userStore.currentRole === "TEACHER"
    ? "list"
    : "cards"
);

// Table columns configuration
const columns = [
  {
    header: " Title",
    accessor: "title",
  },
  {
    header: "Class",
    accessor: "class",
    class: "hidden md:table-cell",
  },
  {
    header: "Date",
    accessor: "date",
    class: "hidden md:table-cell",
  },
  {
    header: "Start Time",
    accessor: "startTime",
    class: "hidden md:table-cell",
  },
  {
    header: "End Time",
    accessor: "endTime",
    class: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

// Format events for table view
const formattedEvents = computed(() => {
  return eventStore.events.map((event) => ({
    id: event.id,
    title: event.title,
    class: event.class?.name || "N/A",
    date: formatDateShort(event.startTime),
    startTime: formatTimeOnly(event.startTime),
    endTime: formatTimeOnly(event.endTime),
    status: event.status,
    creatorId: event?.creatorId,
  }));
});

// Utility functions for the list view
const formatDateShort = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTimeOnly = (dateString) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(async () => {
  await eventStore.fetchEvents();

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

useStorageSync("readEvents", (newReadEvents) => {
  eventStore.readEvents = newReadEvents || [];
});
</script>
