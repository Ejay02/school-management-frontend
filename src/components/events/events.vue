<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="bg-white p-4 rounded-md flex-1 m-1 mt-0 shadow-xl">
      <!-- top -->
      <div class="border-b p-4 flex justify-between items-center">
        <TopList :txt="'All Events'" />

        <!-- View toggle buttons -->
        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button
            @click="viewMode = 'cards'"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-l-lg border border-r-0',
              viewMode === 'cards'
                ? 'bg-eduPurple text-white border-eduPurple'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300',
            ]"
          >
            <i class="fas fa-th-large mr-2"></i> Cards
          </button>
          <button
            @click="viewMode = 'list'"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-r-lg border',
              viewMode === 'list'
                ? 'bg-eduPurple text-white border-eduPurple'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300',
            ]"
          >
            <i class="fas fa-list mr-2"></i> List
          </button>
        </div>
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
import { ref, computed, onMounted } from "vue";
import TopList from "../lists/topList.vue";
import Pagination from "../pagination.vue";
import EventsTable from "./eventsTable.vue";

import { useEventStore } from "../../store/eventStore";
import { useUserStore } from "../../store/userStore";
import ErrorScreen from "../errorScreen.vue";
import EmptyState from "../emptyState.vue";
import LoadingScreen from "../loadingScreen.vue";
import EventCard from "./eventCard.vue";

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
    header: "Title",
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
  }));
});

// Fetch events on component mount
onMounted(async () => {
  await eventStore.fetchEvents();
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
</script>

<style scoped></style>
