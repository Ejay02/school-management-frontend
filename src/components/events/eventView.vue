<template>
  <div class="rounded border border-gray-300 p-2 w-full">
    <div class="w-full rounded-md shadow-lg border border-gray-200">
      <!-- Loading and error states -->
      <LoadingScreen v-if="loading" message="Loading event details..." />
      <ErrorScreen v-else-if="error" />

      <div v-else class="bg-white cursor-pointer">
        <!-- Event Header with gradient background -->
        <div
          class="rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 relative"
        >
        <div class="absolute inset-0 pattern-dots opacity-10"></div>
          <!-- Back arrow button -->
          <button
            @click="router.push('/events')"
            class="absolute top-4 left-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-all animate-bounce-once"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          <div class="ml-8 flex justify-between items-center mb-3">
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-bold shadow-sm',
                event?.status === 'SCHEDULED'
                  ? 'bg-blue-100 text-blue-800'
                  : event?.status === 'CANCELLED'
                  ? 'bg-red-100 text-red-800'
                  : event?.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-800'
                  : '',
              ]"
            >
              {{ event?.status }}
            </span>
            <span
              class="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold"
            >
              {{ event?.type }}
            </span>
          </div>

          <h1 class="ml-8 text-2xl md:text-3xl font-bold mb-2">
            {{ event?.title }}
          </h1>

          <p class="ml-8 text-indigo-100 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.328.996.002 1.069c0 .54.384 1.006.914 1.096l3.487.594a1 1 0 01.171.035l4.473 1.535a1 1 0 001.294-.95V10.01c0-.363-.196-.696-.504-.874L10.394 2.08z"
              />
              <path
                d="M7.032 11.165a3 3 0 01.596-.541l4-1.714a1 1 0 01.788 0l7 3a1 1 0 010 1.84l-7 3a1 1 0 01-.788 0l-7-3a1 1 0 010-1.84l1.025-.439"
              />
            </svg>
            {{ event?.class?.name || "No class assigned" }}
          </p>
        </div>

        <!-- Event Content -->
        <div class="p-6">
          <!-- Time and Location Cards -->
          <div class="grid md:grid-cols-2 gap-4 mb-8">
            <div
              class="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-lg shadow-sm border border-indigo-100 transition-all hover:shadow-md"
            >
              <h3 class="font-semibold text-indigo-800 mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                When
              </h3>
              <div class="ml-7 space-y-3">
                <p class="flex items-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-4 w-4 mr-2 text-indigo-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z"
                    />
                  </svg>

                  <span class="font-medium">{{
                    formatEventDate(event?.startTime)
                  }}</span>
                </p>
                <p class="flex items-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-2 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span
                    >{{ formatTime(event?.startTime) }} -
                    {{ formatTime(event?.endTime) }}</span
                  >
                </p>
                <p
                  v-if="calculateDuration(event?.startTime, event?.endTime)"
                  class="flex items-center text-gray-700"
                >
                  <i
                    class="fa-regular fa-hourglass-half h-4 w-4 mr-2 text-indigo-500"
                  ></i>
                  <span>{{
                    calculateDuration(event?.startTime, event?.endTime)
                  }}</span>
                </p>
              </div>
            </div>

            <div
              class="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-lg shadow-sm border border-indigo-100 transition-all hover:shadow-md"
            >
              <h3 class="font-semibold text-indigo-800 mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Where
              </h3>
              <div class="ml-7">
                <p class="text-gray-700">
                  {{ event?.location || "No location specified" }}
                </p>
                <button
                  v-if="event?.location"
                  class="mt-3 text-indigo-600 hover:text-indigo-800 text-sm flex items-center bg-white px-3 py-1 rounded-full shadow-sm hover:shadow transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  Get directions
                </button>
              </div>
            </div>
          </div>

          <!-- Main Content Grid: 3 columns on large screens -->
          <div class="grid lg:grid-cols-3 gap-6">
            <!-- Description Section - spans 2 columns -->
            <div class="lg:col-span-2 mb-4">
              <h3
                class="font-semibold text-lg text-gray-800 mb-3 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Description
              </h3>
              <div
                class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all h-full"
              >
                <p
                  class="text-gray-700 whitespace-pre-line leading-relaxed prose max-w-none font-serif text-lg"
                >
                  {{ event?.description || "No description provided." }}
                </p>
              </div>
            </div>

            <!-- Right sidebar with organizer & participants - spans 1 column -->
            <div class="space-y-6 mt-6">
              <!-- Organizer -->
              <div>
                <h3
                  class="font-semibold text-lg text-gray-800 mb-3 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Organizer
                </h3>
                <div
                  class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all"
                >
                  <div class="flex items-center">
                    <div class="mr-4 relative">
                      <img
                        v-if="creator?.image"
                        :src="creator?.image"
                        :alt="`${creator?.username}`"
                        class="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
                      />

                      <div
                        v-else
                        class="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm border-2 border-indigo-200"
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
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      <p class="font-medium text-gray-800 capitalize text-lg">
                        {{ creator?.username }}
                      </p>
                      <span
                        class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-700/10 ring-inset mt-1"
                      >
                        {{ creatorRole }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Participants Section -->
              <div>
                <h3
                  class="font-semibold text-lg text-gray-800 mb-3 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  For
                </h3>
                <div
                  class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all"
                >
                  <p
                   v-if="event?.targetRoles && event?.targetRoles.length !== 4"
                    class="flex items-center text-gray-700"
                  >
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
                    
                    {{ formatTargetRoles(event?.targetRoles) }}
                  </p>
                  
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
                  <!--  -->

                  <div class="mt-5">
                    <p class="text-gray-700 mb-3 flex items-center">
                      <svg
                      v-if="!event?.targetRoles && !event?.targetRoles.length < 4"
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>

                      <span class="font-medium">
                        <template v-if="event?.class">
                          {{ event?.class?.students.length }} attendees
                        </template>
                        <template v-else-if="!event?.targetRoles && !event?.targetRoles.length < 4"> Whole school event </template>
                      </span>
                    </p>

                    <!--  -->
                    <div class="flex flex-wrap gap-2">
                      <div
                        v-for="(attendee, index) in event?.class?.students"
                        :key="index"
                        class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full h-10 w-10 flex items-center justify-center border border-indigo-200 shadow-sm"
                      >
                        <span
                          class="text-sm font-medium text-indigo-700 capitalize"
                        >
                          {{ attendee?.name[0] }}{{ attendee?.surname[0] }}
                        </span>
                      </div>

                      <div
                        v-if="event?.class?.students.length > 5"
                        class="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full h-10 w-10 flex items-center justify-center shadow-sm"
                      >
                        <span class="text-sm font-medium text-indigo-700">
                          +{{ event?.class?.students.length - 5 }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3 mt-10">
            <button
              v-if="isCreator"
              @click="editEvent"
              class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all font-medium flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Event
            </button>
            <button
              class="flex-1 bg-white hover:bg-gray-50 text-indigo-600 py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all font-medium border border-indigo-200 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share Event
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from "vue-router";
import ErrorScreen from "../errorScreen.vue";
import LoadingScreen from "../loadingScreen.vue";

import { useApolloClient } from "@vue/apollo-composable";
import { useNavigation } from "../../composables/useNavigation";
import { useEventStore } from "../../store/eventStore";
import { useUserStore } from "../../store/userStore";
import { formatEventDate, formatTime } from "../../utils/date.holidays";
import { formatTargetRoles } from "../../utils/utility";
import { socket } from "../../socket/socket";

const route = useRoute();
const router = useRouter();
const eventId = route.params.id;

const eventStore = useEventStore();
const userStore = useUserStore();

const { goBack } = useNavigation();

const { client } = useApolloClient();
const creator = ref(null);

const loading = computed(() => eventStore.loading);
const error = computed(() => eventStore.error);

const event = computed(() => eventStore.selectedEvent);

const creatorId = computed(() => event.value?.creatorId);

const isCreator = computed(() => creatorId.value === userStore.userInfo.id);

const creatorRole = computed(() => {
  if (!creator.value) return "";
  return (
    creator.value.adminRole ||
    creator.value.studentRole ||
    creator.value.parentRole ||
    creator.value.teacherRole ||
    ""
  );
});

const calculateDuration = (start, end) => {
  if (!start || !end) return "";

  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = endDate - startDate;

  // Convert to hours and minutes
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0) {
    return `${minutes} minutes`;
  } else if (minutes === 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else {
    return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
      minutes > 1 ? "s" : ""
    }`;
  }
};

const fetchCreator = async () => {
  if (creatorId.value) {
    try {
      const userData = await userStore.findUserById(creatorId.value, client);
      creator.value = userData;
    } catch (error) {
      console.error("Failed to fetch creator:", error);
    }
  }
};

const editEvent = () => {
  router.push(`/events/edit/${eventId}`);
};

// Watch for changes in creatorId (in case event loading happens after component mount)
watch(creatorId, (newVal) => {
  if (newVal) {
    fetchCreator();
  }
});

onMounted(() => {
  eventStore.fetchEventById(eventId);

  if (event.value?.creatorId) {
    fetchCreator();
  }
});

onMounted(() => {
  eventStore.fetchEventById(eventId);

  if (event.value?.creatorId) {
    fetchCreator();
  }

  // Add socket listener for event updates
  socket.on("eventUpdated", (data) => {
    if (data && data.event && data.event.id === eventId) {
      eventStore.fetchEventById(eventId); // Refresh the current event
    }
  });
});

onUnmounted(() => {
  // Clean up socket listener
  socket.off("eventUpdated");
});


</script>
