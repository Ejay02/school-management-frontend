<template>
  <div class="p-4 bg-white mt-1 mb-2 rounded-lg shadow-lg cursor-pointer">
    <VCalendar
      :color="selectedColor"
      :attributes="attrs"
      expanded
      transparent
      borderless
    />

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-lg font-semibold">Events</h1>
      <div class="">
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
      <div
        class="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-eduSky even:border-t-eduPurple hover:bg-gray-100"
        v-for="event in todos"
        :key="event.id"
      >
        <div class="flex items-center justify-between mb-2">
          <h1 class="font-semibold text-gray-600 capitalize">
            {{ event.title }}
          </h1>
          <span class="text-gray-300 xs text-sm"
            >{{ event.startTime }} - {{ event.endTime }}</span
          >
        </div>

        <div class="justify-between flex mt-2">
          <span class="truncate text-gray-400 text-sm">{{
            event.description
          }}</span>
          <span
            class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
            :class="{
              'text-green-700 bg-green-50 ring-green-600/20':
                event.status === 'completed',
              'bg-yellow-50 text-yellow-800 ring-yellow-600/20':
                event.status === 'scheduled',
              'bg-red-50 text-red-700 ring-red-600/10':
                event.status === 'cancelled',
            }"
          >
            {{ event.status }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { fetchCountry, fetchHolidays } from "../../utils/date.holidays";

// const isDark = ref(false);

const selectedColor = ref("purple");
const holidays = ref([]);

const todos = ref([
  {
    id: 1,
    title: "learn",
    description: "DSA practice.",
    status: "completed",
    startTime: "11:11AM",
    endTime: "12:12PM",
    dates: { repeat: { weekdays: 5 } }, // Every Friday
    color: "red",
  },
  {
    id: 2,
    title: "cook",
    description: "Cook friedrice",
    status: "cancelled",
    dates: Date.now(), //Should be selected date so a vmodel
    // dates: { repeat: { weekdays: 1 } },
    color: "pink",
    startTime: "16:00PM",
    endTime: "20:00PM",
  },
  {
    id: 3,
    title: "school",
    description: "Submit thesis",
    status: "scheduled",
    dates: "2024, 11, 20", //Should be selected date so a vmodel
    // dates: { repeat: { weekdays: 1 } },
    color: "blue",
    startTime: "14:00PM",
    endTime: "15:00PM",
  },
]);

onMounted(async () => {
  const countryCode = await fetchCountry();
  const fetchedHolidays = await fetchHolidays(countryCode);
  holidays.value = fetchedHolidays; // Update holidays ref
});

// CalendarComponent.vue
const attrs = computed(() => [
  // Attributes for todos
  ...todos.value.map((todo) => ({
    dates: todo.dates,
    dot: {
      color: todo.color,
      ...(todo.isComplete && { class: "opacity-50" }),
    },
    popover: {
      label: todo.description,
    },
  })),
  // Attributes for holidays
  ...holidays.value.map((holiday) => ({
    dates: holiday.date,
    dot: {
      color: "green", // or any other color you prefer
    },
    popover: {
      label: holiday.title,
    },
  })),
]);

// const attrs = computed(() => [
//   // Attributes for todos
//   ...todos.value.map((todo) => ({
//     dates: todo.dates,
//     dot: {
//       color: todo.color,
//       ...(todo.isComplete && { class: "opacity-50" }),
//     },
//     popover: {
//       label: todo.description,
//     },
//   })),
// ]);
</script>

<style scoped>
.vc-container .vc-weekday-1,
.vc-container .vc-weekday-7 {
  color: #6366f1;
}
</style>
