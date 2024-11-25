<template>
  <div class=" gap-4 flex-col xl:flex-row w-full mt-4">
    <div class="">
      <div class="w-full xl:w-2/3">
        <div class="h-full bg-white p-4 rounded-md w-full">
          <h1 class="text-xl font-semibold mb-6">Schedule(4A)</h1>
          <div class="fc-custom-theme">
            <FullCalendar ref="calendarRef" :options="calendarOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "./event-utils";

const currentEvents = ref([]);

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],

  headerToolbar: {
    left: "prev,next",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
  },
  initialView: "dayGridMonth",
  initialEvents: INITIAL_EVENTS,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents,
  events: [
    { title: "Study", date: "2024-11-24" },
    { title: "Exams", date: "2024-11-25" },
    { title: "Conference", start: "2024-11-04", end: "2024-11-14" },
  ],
});

function handleDateSelect(selectInfo) {
  let title = prompt("Please enter a new title for your event");
  let calendarApi = selectInfo.view.calendar;

  calendarApi.unselect();

  if (title) {
    calendarApi.addEvent({
      id: createEventId(),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
    });
  }
}

function handleEventClick(clickInfo) {
  if (
    confirm(
      `Are you sure you want to delete the event '${clickInfo.event.title}'`
    )
  ) {
    clickInfo.event.remove();
  }
}

function handleEvents(events) {
  currentEvents.value = events;
}
</script>

<style>
.fc-custom-theme {
  --fc-button-bg-color: #6366f1;
  --fc-button-border-color: transparent;
  --fc-button-hover-bg-color: #4c1d95;
  --fc-button-hover-border-color: transparent;
  --fc-button-active-bg-color: #5b21b6;
  --fc-button-active-border-color: transparent;
  --fc-today-bg-color: #eef2ff;
  --fc-border-color: #e5e7eb;
}

/* Target all buttons including the top navigation */
.fc-custom-theme .fc-button,
.fc-custom-theme .fc-button-primary {
  border: none !important;
  border-color: transparent !important;
  background-color: var(--fc-button-bg-color) !important;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  font-weight: 500;
}

/* Target active state */
.fc-custom-theme .fc-button-active,
.fc-custom-theme .fc-button-primary.fc-button-active {
  background-color: #4c1d95 !important;
  border: none !important;
  box-shadow: none !important;
}

/* Target hover state */
.fc-custom-theme .fc-button:hover,
.fc-custom-theme .fc-button-primary:hover {
  background-color: #4c1d95 !important;
  border: none !important;
  box-shadow: none !important;
}

/* Target focus state */
.fc-custom-theme .fc-button:focus,
.fc-custom-theme .fc-button-primary:focus {
  outline: none;
  border: none !important;
}

.fc-custom-theme .fc-toolbar-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.fc-custom-theme .fc-day-today {
  background-color: #eef2ff !important;
}

.fc-custom-theme .fc-button-group {
  gap: 0.5rem;
}

/* Additional specific targeting for button group buttons */
.fc-custom-theme .fc-button-group .fc-button {
  border: none !important;
  background-color: var(--fc-button-bg-color) !important;
}

.fc-custom-theme .fc-button-group .fc-button-active {
  background-color: #4c1d95 !important;
}

.fc-custom-theme .fc-view {
  border-color: #e5e7eb;
}
</style>
