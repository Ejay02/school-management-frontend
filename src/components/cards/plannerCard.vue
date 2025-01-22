<template>
  <div v-if="holidaysFetched" class="fc-custom-theme w-full">
    <div class="w-full overflow-x-auto">
      <div class="calendar-container">
        <FullCalendar
          ref="calendarRef"
          :options="calendarOptions"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { fetchCountry, fetchHolidays } from "../../utils/date.holidays.js";
import { INITIAL_EVENTS, createEventId } from "../../utils/event-utils.js";

const currentEvents = ref([]);
const calendarRef = ref(null);
const holidaysFetched = ref(false);

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
  dayMaxEventRows: 3,
  moreLinkClick: "popover",
  views: {
    dayGrid: {
      dayMaxEventRows: 3,
    },
    // Add responsive views for smaller screens
    timeGridWeek: {
      type: "timeGrid",
      duration: { days: 7 },
      buttonText: "week",
    },
    timeGridDay: {
      type: "timeGrid",
      duration: { days: 1 },
      buttonText: "day",
    },
    listWeek: {
      type: "list",
      duration: { days: 7 },
      buttonText: "list",
    },
  },

  weekends: true,
  dateClick: function (info) {
    const calendarApi = info.view.calendar;
    calendarApi.changeView("timeGridDay", info.dateStr);
  },
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents,

  events: [
    {
      title: "Study",
      start: "2024-11-24",
      end: "2024-11-28",
      display: "block",
      backgroundColor: "#CFCEFF",
      borderColor: "#CFCEFF",
    },
    {
      title: "Meeting",
      start: "2024-11-25T10:30:00",
      display: "dot",
      backgroundColor: "#FAE27C",
      borderColor: "#FAE27C",
    },
    {
      title: "Lunch",
      start: "2024-11-25T12:00:00",
      backgroundColor: "#CFCEFF",
      borderColor: "#CFCEFF",
    },
    {
      title: "Conference",
      start: "2024-11-04",
      end: "2024-11-14",
      display: "block",
      backgroundColor: "#FAE27C",
    },

    {
      title: "Meeting",
      start: "2024-11-25T10:30:00",
      backgroundColor: "#CFCEFF",
      borderColor: "#CFCEFF",
    },
    {
      title: "Lunch",
      start: "2024-11-28T12:00:00",
      backgroundColor: "#FAE27C",
      borderColor: "#FAE27C",
    },
    {
      title: "Meeting",
      start: "2024-11-25T14:30:00",
      backgroundColor: "#CFCEFF",
      borderColor: "#CFCEFF",
    },
    {
      title: "Happy Hour",
      start: "2024-11-25T17:30:00",
      backgroundColor: "#FAE27C",
      borderColor: "#FAE27C",
    },
    {
      title: "Dinner",
      start: "2024-11-25T20:00:00",
      backgroundColor: "#CFCEFF",
      borderColor: "#CFCEFF",
    },
  ],

  eventTimeFormat: {
    hour: "numeric",
    minute: "2-digit",
    meridiem: "short",
    omitZeroMinute: false,
  },
});

onMounted(async () => {
  try {
    const countryCode = await fetchCountry();
    const holidays = await fetchHolidays(countryCode);
    holidays.forEach((holiday) => {
      holiday.classNames = ["bg-green-300", "ring-green-600/20"]; // Add holiday styles
    });
    calendarOptions.value.events = [...INITIAL_EVENTS, ...holidays];
    holidaysFetched.value = true;
  } catch (error) {
    console.error("Error fetching holidays:", error);
  }
});

// #TODO move to modal
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

//#TODO move to a modal
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
.calendar-container {
  width: 100%;
  min-height: 600px;
  height: calc(100vh - 200px);
  max-height: 800px;
}

.fc-custom-theme {
  --fc-button-bg-color: #c3ebfa;
  --fc-button-border-color: none !important;
  --fc-button-hover-bg-color: none !important;
  --fc-button-hover-border-color: none !important;
  --fc-button-active-bg-color: #cfceff;
  --fc-button-active-border-color: none !important;
  --fc-today-bg-color: #ffeef3;
  --fc-border-color: #e5e7eb;
  --fc-list-event-hover-bg-color: transparent;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .fc-header-toolbar {
    flex-direction: column;
    gap: 1rem;
  }

  .fc-toolbar-chunk {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .fc-button-group {
    flex-wrap: wrap;
    justify-content: center;
  }

  .fc-toolbar-title {
    font-size: 1rem !important;
    text-align: center;
  }

  .fc-view {
    padding: 0.5rem;
  }

  .fc-daygrid-day-number {
    padding: 0.25rem !important;
  }
}

/* Small screen optimizations */
@media (max-width: 640px) {
  .fc-header-toolbar {
    padding: 0.5rem;
  }

  .fc-button {
    padding: 0.3rem 0.6rem !important;
    font-size: 0.75rem !important;
  }

  .fc-daygrid-day-events {
    margin: 0 !important;
  }

  .fc-event {
    margin: 1px 0 !important;
    padding: 2px 4px !important;
  }
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
  outline: none !important;
}

/* Remove hover effects */
.fc-custom-theme .fc-button:hover,
.fc-custom-theme .fc-button-primary:hover,
.fc-custom-theme .fc-button:focus,
.fc-custom-theme .fc-button-primary:focus,
.fc-custom-theme .fc-button:active,
.fc-custom-theme .fc-button-primary:active,
.fc-custom-theme .fc-button:focus-visible,
.fc-custom-theme .fc-button-primary:focus-visible {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

/* Remove list hover background */
.fc-custom-theme .fc-list-event:hover td {
  background-color: transparent !important;
}

/* Active button state */
.fc-custom-theme .fc-button-active,
.fc-custom-theme .fc-button-primary.fc-button-active {
  background-color: #cfceff !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

/* Month text */
.fc-custom-theme .fc-toolbar-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #686e7a;
}

/* bottom bg color */
.fc-custom-theme .fc-day-today {
  background-color: #fefce8 !important;
}

.fc-custom-theme .fc-button-group {
  gap: 0.5rem;
}

/* Additional specific targeting for button group buttons */
.fc-toolbar-chunk:hover,
.fc-custom-theme .fc-button-group .fc-button {
  border: none !important;
  background-color: none !important;
}

/* actual button */
.fc-custom-theme .fc-button-group .fc-button-active {
  background-color: #cfceff !important;
  border: none !important;
  outline: none;
}

/* calender view */
.fc-custom-theme .fc-view {
  background-color: #edf9fd;
  border: none !important;
  cursor: pointer;
}

.fc-daygrid-more-link {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 4px;
}

.fc-popover {
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.fc-popover-header {
  background-color: #f3f4f6;
  padding: 8px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.fc-popover-body {
  background-color: #edf9fd !important;
  padding: 8px;
}

/* dropdown dot */
.fc-daygrid-event-dot {
  border-color: pink !important;
}

.fc-event {
  /* border-radius: 4px; */
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.6rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
}
</style>
