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
      <img src="/moreDark.png" alt="more icon" class="h-5 w-5" />
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
            class="items-end text-[10px] rounded-full p-2 cursor-pointer"
            :class="
              event.isComplete
                ? 'bg-green-300 text-green-500 '
                : 'bg-eduYellow text-yellow-500'
            "
          >
            {{ event.isComplete ? "complete" : "pending" }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";

// const isDark = ref(false);

const selectedColor = ref("purple");

const todos = ref([
  {
    id: 1,
    title: "learn",
    description: "DSA practice.",
    isComplete: false,
    startTime: "11:11AM",
    endTime: "12:12PM",
    dates: { repeat: { weekdays: 5 } }, // Every Friday
    color: "red",
  },
  {
    id: 2,
    title: "cook",
    description: "Cook friedrice",
    isComplete: false,
    dates: Date.now(), //Should be selected date so a vmodel
    // dates: { repeat: { weekdays: 1 } },
    color: "green",
    startTime: "16:00PM",
    endTime: "20:00PM",
  },
  {
    id: 3,
    title: "school",
    description: "Submit thesis",
    isComplete: true,
    dates: "2024, 11, 20", //Should be selected date so a vmodel
    // dates: { repeat: { weekdays: 1 } },
    color: "blue",
    startTime: "14:00PM",
    endTime: "15:00PM",
  },
]);

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
]);

// const attrs = ref([
//   {
//     key: "today",
//     // highlight: true,
//     dot: true,
//     dates: new Date(),
//     // dates: { start: startDate, end: new Date(2024, 10, 24) },
//     // dates: { start: new Date(2019, 3, 15), end: new Date(2019, 3, 19) },
//   },
// ]);
</script>

<style scoped>
.vc-container .vc-weekday-1,
.vc-container .vc-weekday-7 {
  color: #6366f1;
}
</style>
