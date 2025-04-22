<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <!-- top -->
      <div class="border-b p-4 flex items-center justify-between">
        <!-- View toggle buttons -->
        <div
          class="relative inline-flex w-48 h-12 bg-white rounded-full shadow-md overflow-hidden"
        >
          <!-- Hidden legend for accessibility -->
          <legend class="sr-only">View mode selection</legend>

          <!-- Container for the toggle options -->
          <div
            class="flex w-full h-full items-center justify-between relative z-10"
          >
            <!-- Cards Option -->
            <button
              @click="viewMode = 'cards'"
              class="flex-1 h-full flex items-center justify-center text-sm font-medium transition-colors duration-300"
              :class="viewMode === 'cards' ? 'text-white' : 'text-gray-700'"
            >
              <i class="fas fa-th-large mr-1"></i> Cards
            </button>

            <!-- List Option -->
            <button
              @click="viewMode = 'list'"
              class="flex-1 h-full flex items-center justify-center text-sm font-medium transition-colors duration-300"
              :class="viewMode === 'list' ? 'text-white' : 'text-gray-700'"
            >
              <i class="fas fa-list mr-1"></i> List
            </button>
          </div>

          <!-- Sliding background for active state -->
          <div
            class="absolute top-1 left-1 w-1/2 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full transition-transform duration-300 ease-in-out"
            :class="
              viewMode === 'cards'
                ? 'translate-x-0'
                : 'translate-x-[calc(100%-0.5rem)]'
            "
          ></div>
        </div>
        <!--  -->

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
      <Pagination
        :currentPage="currentPage"
        :hasMore="eventStore?.hasMore"
        :totalPages="eventStore.totalPages"
        @update:page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { socket } from "../../socket/socket";
import TopList from "../lists/topList.vue";
import Pagination from "../pagination.vue";
import EventCard from "./eventCard.vue";
import EventsTable from "./eventsTable.vue";

import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useStorageSync } from "../../composables/useStorageSync";
import { useEventStore } from "../../store/eventStore";
import { useUserStore } from "../../store/userStore";
import EmptyState from "../emptyState.vue";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";

const limit = 10;
const currentPage = ref(1);

const eventStore = useEventStore();
const userStore = useUserStore();

useStorageSync("readEvents", (newReadEvents) => {
  eventStore.readEvents = newReadEvents || [];
});

function handlePageChange(newPage) {
  currentPage.value = newPage;
}


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
    header: "",
    accessor: "",
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

watch(currentPage, (newPage) => {
  eventStore.fetchEvents({ page: newPage, limit });
});

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
      // Update both the events and allEvents arrays
      eventStore.events = eventStore.events.filter(
        (event) => event.id !== data.eventId
      );

      eventStore.allEvents = eventStore.allEvents.filter(
        (event) => event.id !== data.eventId
      );
      // Update total count and pages
      eventStore.totalCount = eventStore.allEvents.length;
      eventStore.totalPages = Math.ceil(eventStore.totalCount / limit);
    }
  });

  socket.on("eventUpdated", (data) => {
    if (data && data.event) {
      // Force a complete refresh of the events data
      eventStore.allEvents = [];

      // This will trigger a complete refetch from the API
      eventStore.fetchEvents({ page: currentPage.value, limit });
    }
  });
});

onUnmounted(() => {
  // Cleanup to prevent memory leaks
  socket.off("eventCreated");
  socket.off("deleteEvent");
  socket.off("eventUpdated");
});
</script>
