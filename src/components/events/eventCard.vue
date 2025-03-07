<template>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="event in events"
      :key="event.id"
      class="bg-gray-200 cursor-pointer rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
    >
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
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
            {{ event.status }}
          </span>
          <span class="text-gray-600 text-xs uppercase font-semibold">{{
            formatEventType(event.type)
          }}</span>
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>

            {{ formatDate(event.startTime) }} - {{ formatDate(event.endTime) }}
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
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span class="text-sm text-gray-600">{{
              formatTargetRoles(event.targetRoles)
            }}</span>
          </div>
          <button
            class="bg-eduSky text-indigo-600 hover:bg-eduSkyLight px-3 py-1 rounded-md text-sm transition duration-300"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  events: {
    type: Array,
    required: true,
  },
});

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatEventType = (type) => {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const formatTargetRoles = (roles) => {
  return roles
    .map((role) => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase())
    .join(", ");
};
</script>
