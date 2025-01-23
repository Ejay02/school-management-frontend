<template>
  <div class="min-h-screen bg-gray-200 py-8">
    <div class="ml-8 mb-4">
      <router-link to="/" class="group">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="text-gray-600 h-6 w-6 cursor-pointer group-hover:animate-bounce"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
          />
        </svg>
      </router-link>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="rounded border border-gray-300 p-3 w-full">
        <div class="bg-eduPurpleLight rounded-lg shadow">
          <!-- Calendar Header with Filters -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0"
            >
              <!-- Month Navigation -->
              <div class="flex items-center space-x-4">
                <button
                  @click="previousMonth"
                  class="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg
                    class="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <h2 class="text-xl font-semibold text-gray-900">
                  {{ currentMonthName }} {{ currentYear }}
                </h2>
                <button
                  @click="nextMonth"
                  class="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg
                    class="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <div class="flex gap-4">
                <!-- Event Type Filters -->
                <div class="flex flex-wrap gap-2">
                  <template v-for="(color, type) in eventTypes" :key="type">
                    <button
                      @click="toggleEventType(type)"
                      class="px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1 ring-1 ring-inset"
                      :class="[
                        activeFilters.includes(type)
                          ? color.bg + ' ' + color.text + ' ' + color.ring
                          : 'bg-gray-100 text-gray-600',
                      ]"
                    >
                      <span>{{ type }}</span>
                      <span
                        class="w-2 h-2 rounded-full"
                        :class="color.dot"
                      ></span>
                    </button>
                  </template>
                </div>

                <!-- Export Button -->
                <button
                  @click="exportCalendar"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 hover:shadow-lg flex items-center gap-2"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Export
                </button>
              </div>
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="p-6">
            <!-- Weekday Headers -->
            <div class="grid grid-cols-7 gap-px mb-2">
              <template v-for="day in weekDays" :key="day">
                <div class="text-sm font-medium text-gray-500 text-center py-2">
                  {{ day }}
                </div>
              </template>
            </div>

            <!-- Calendar Days -->
            <div class="grid grid-cols-7 gap-px bg-gray-200">
              <template
                v-for="{ date, isCurrentMonth, events } in filteredCalendarDays"
                :key="date"
              >
                <div
                  :class="[
                    'min-h-32 bg-eduSkyLight p-2',
                    !isCurrentMonth && 'bg-gray-100',
                    isToday(date) && 'bg-eduYellowLight',
                  ]"
                >
                  <div class="flex justify-between">
                    <span
                      :class="[
                        'text-sm',
                        !isCurrentMonth && 'text-gray-400',
                        isToday(date) && 'font-bold text-blue-600',
                      ]"
                    >
                      {{ date.getDate() }}
                    </span>
                  </div>
                  <!-- Events -->
                  <div class="mt-2 space-y-1">
                    <template
                      v-for="event in filterEventsByType(events)"
                      :key="event.id"
                    >
                      <div
                        class="px-2 py-1 text-xs rounded-md truncate cursor-pointer"
                        :class="[
                          eventTypes[event.type].bg +
                            ' ' +
                            eventTypes[event.type].text,
                          event.endDate &&
                            'border-l-4 border-' +
                              eventTypes[event.type].border,
                        ]"
                        @click="selectedEvent = event"
                      >
                        {{ event.title }}
                        <!-- <span v-if="event.endDate" class="text-xs opacity-75">
                          ({{ getDurationDays(event) }} days)
                        </span> -->
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Event Details Modal -->
      <div
        v-if="selectedEvent"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div class="bg-eduYellowLight rounded-lg p-6 w-full max-w-md">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold text-gray-600">
              {{ selectedEvent.title }}
            </h3>
            <button
              @click="selectedEvent = null"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="space-y-3">
            <p class="text-sm text-gray-500">
              <span class="font-medium text-gray-600">Date:</span>
              {{ formatDate(selectedEvent.date) }}
            </p>
            <p class="text-sm text-gray-500">
              <span class="font-medium text-gray-600">Type:</span>
              {{ selectedEvent.type }}
            </p>
            <p class="text-sm text-gray-500">
              <span class="font-medium text-gray-600">Description:</span><br />
              {{ selectedEvent.description }}
            </p>
            <p v-if="selectedEvent.location" class="text-sm text-gray-500">
              <span class="font-medium text-gray-600">Location:</span><br />
              {{ selectedEvent.location }}
            </p>
          </div>
          <div class="mt-6 flex justify-end">
            <button
              @click="addToCalendar(selectedEvent)"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 hover:shadow-lg"
            >
              Add to My Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { fetchCountry, fetchHolidays } from "../../utils/date.holidays";

// State
const currentDate = ref(new Date());
const selectedEvent = ref(null);
const activeFilters = ref(["Open Days", "Exams", "Events", "Holidays"]);

// Constants
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const eventTypes = {
  "Open Days": {
    bg: "bg-blue-100",
    text: "text-blue-800",
    dot: "bg-blue-500",
    ring: "ring-blue-700/10",
  },
  Exams: {
    bg: "bg-red-100",
    text: "text-red-800",
    dot: "bg-red-500",
    ring: "ring-red-600/10",
  },
  Events: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    dot: "bg-purple-500",
    ring: "ring-purple-700/10",
  },
  Holidays: {
    bg: "bg-green-100",
    text: "text-green-800",
    dot: "bg-green-500",
    ring: "ring-green-600/20",
  },
};

const initCalendar = async () => {
  try {
    const countryCode = await fetchCountry();
    await fetchHolidays(countryCode);
  } catch (error) {
    console.error("Error initializing calendar:", error);
  }
};

initCalendar();

// Sample public events
const events = ref([
  // Multi-day events
  {
    id: 4,
    title: "Mid-Term Exams",
    date: "2025-01-28",
    endDate: "2025-02-03",
    type: "Exams",
    description: "Mid-term examinations for all grades",
    location: "All Classrooms",
  },
  {
    id: 5,
    title: "School Open Day",
    date: "2025-01-28",
    endDate: "2025-01-30",
    type: "Open Days",
    description: "Annual school open day for prospective students and parents",
    location: "Main Hall",
  },

  {
    id: 6,
    title: "Spring Break",
    date: "2025-03-15",
    endDate: "2025-03-23",
    type: "Holidays",
    description: "Spring Break Holiday",
  },
]);

const currentMonthName = computed(() => {
  return currentDate.value.toLocaleString("default", { month: "long" });
});

const currentYear = computed(() => {
  return currentDate.value.getFullYear();
});

const filteredCalendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];

  // Previous month days
  const prevMonthDays = firstDay.getDay();
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push({
      date,
      isCurrentMonth: false,
      events: getEventsForDate(date),
    });
  }

  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({
      date,
      isCurrentMonth: true,
      events: getEventsForDate(date),
    });
  }

  // Next month days
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date,
      isCurrentMonth: false,
      events: getEventsForDate(date),
    });
  }

  return days;
});

const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const toggleEventType = (type) => {
  const index = activeFilters.value.indexOf(type);
  if (index === -1) {
    activeFilters.value.push(type);
  } else {
    activeFilters.value.splice(index, 1);
  }
};

const filterEventsByType = (events) => {
  return events.filter((event) => activeFilters.value.includes(event.type));
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const addToCalendar = (event) => {
  // Implement integration with personal calendar
  console.log("Adding to personal calendar:", event);
};

const getDurationDays = (event) => {
  if (!event.endDate) return 1;
  const start = new Date(event.date);
  const end = new Date(event.endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
};

const exportCalendar = () => {
  const calendar = events.value.map((event) => {
    const startDate = new Date(event.date);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;

    return {
      Subject: event.title,
      "Start Date": startDate.toLocaleDateString(),
      "End Date": endDate.toLocaleDateString(),
      Description: event.description,
      Location: event.location || "",
      Type: event.type,
    };
  });

  // Convert to CSV
  const headers = Object.keys(calendar[0]);
  const csvContent = [
    headers.join(","),
    ...calendar.map((row) =>
      headers.map((header) => `"${row[header]}"`).join(",")
    ),
  ].join("\n");

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `calendar_export_${
    new Date().toISOString().split("T")[0]
  }.csv`;
  link.click();
};

const getEventsForDate = (date) => {
  return events.value.filter(
    (event) =>
      new Date(event.date).toDateString() === date.toDateString() ||
      (event.endDate &&
        date >= new Date(event.date) &&
        date <= new Date(event.endDate))
  );
};

onMounted(async () => {
  try {
    const countryCode = await fetchCountry();
    const fetchedHolidays = await fetchHolidays(countryCode);
    events.value.push(...fetchedHolidays); // Update events ref with fetched holidays
  } catch (error) {
    console.error("Error fetching holidays:", error);
  }
});
</script>
