<template>
  <div v-if="holidaysFetched" class="fc-custom-theme w-full">
    <div class="w-full">
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
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/vue3";
import { computed, onMounted, ref } from "vue";

import { useEventStore } from "../../store/eventStore.js";
import { useUserStore } from "../../store/userStore.js";
import {
  fetchCountry,
  fetchHolidays,
  formatTime,
} from "../../utils/date.holidays.js";


const currentEvents = ref([]);
const calendarRef = ref(null);
const holidaysFetched = ref(false);
const eventStore = useEventStore();
const userStore = useUserStore();

// Fetch user events
const userEvents = computed(() => {
  if (!eventStore.allEvents || eventStore.allEvents.length === 0) return [];

  // Get current user ID
  const currentUserId = userStore.userInfo?.id;

  // Filter events for current user
  // This will depend on your event structure - adjust as needed
  // For example, events might have a creatorId, participantIds, or other fields
  const filteredEvents = eventStore.allEvents.filter((event) => {
    // Check if user is the creator
    const isCreator = event.creatorId === currentUserId;

    // Check if user is a participant (if your events have participants)
    const isParticipant = event.participants?.some(
      (p) => p.id === currentUserId
    );

    // Return true if user is involved with this event
    return isCreator || isParticipant;
  });

  // Map events to FullCalendar format
  return filteredEvents.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.startTime,
    end: event.endTime,
    description: event.description,
    location: event.location,
    backgroundColor:
      event.status === "CANCELLED"
        ? "#FDA4AF"
        : event.status === "COMPLETED"
        ? "#86EFAC"
        : "#FAE27C",
    borderColor:
      event.status === "CANCELLED"
        ? "#FDA4AF"
        : event.status === "COMPLETED"
        ? "#86EFAC"
        : "#FAE27C",
    extendedProps: {
      status: event.status,
      type: event.type,
      isUserEvent: true,
    },
  }));
});

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],

  headerToolbar: {
    left: "prev,next",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
  },
  initialView: "dayGridMonth",
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEventRows: 3,
  moreLinkClick: "popover",
  height: "auto",
  views: {
    dayGrid: {
      dayMaxEventRows: 3,
    },
    timeGrid: {
      height: "auto", // Allow time grid views to expand fully
    },
    dayGridMonth: {
      height: "auto", // Allow month view to expand fully
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
  eventDidMount: function (info) {
    // Add tooltip with event details for user events
    if (info.event.extendedProps.isUserEvent) {
      const tooltip = document.createElement("div");
      tooltip.className = "event-tooltip";
      tooltip.innerHTML = `
        <div class="p-2 bg-white shadow-md rounded-md">
          <p class="font-bold">${info.event.title}</p>
          ${
            info.event.extendedProps.status
              ? `<p class="text-xs">Status: ${info.event.extendedProps.status}</p>`
              : ""
          }
          ${
            info.event.extendedProps.type
              ? `<p class="text-xs">Type: ${info.event.extendedProps.type}</p>`
              : ""
          }
          ${
            info.event.start
              ? `<p class="text-xs">Start: ${formatTime(info.event.start)}</p>`
              : ""
          }
          ${
            info.event.end
              ? `<p class="text-xs">End: ${formatTime(info.event.end)}</p>`
              : ""
          }
          ${
            info.event.extendedProps.location
              ? `<p class="text-xs">Location: ${info.event.extendedProps.location}</p>`
              : ""
          }
        </div>
      `;

      const eventEl = info.el;
      eventEl.addEventListener("mouseover", function () {
        document.body.appendChild(tooltip);
        const rect = eventEl.getBoundingClientRect();
        tooltip.style.position = "absolute";
        tooltip.style.top = `${rect.bottom + window.scrollY}px`;
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.zIndex = 1000;
      });

      eventEl.addEventListener("mouseout", function () {
        if (document.body.contains(tooltip)) {
          document.body.removeChild(tooltip);
        }
      });
    }
  },

  events: [
    // These sample events will be replaced with fetched events
    // ... existing code ...
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
    // Fetch holidays
    const countryCode = await fetchCountry();
    const holidays = await fetchHolidays(countryCode);
    holidays.forEach((holiday) => {
      holiday.classNames = ["bg-green-300", "ring-green-600/20"]; // Add holiday styles
    });

    // Fetch events for the current user
    await eventStore.fetchEvents();

    // Combine holidays, initial events, and user events
    calendarOptions.value.events = [
      ...holidays,
      ...userEvents.value,
    ];
    holidaysFetched.value = true;
  } catch (error) {
    console.error("Error fetching calendar data:", error);
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
  // For user events, navigate to event details
  if (clickInfo.event.extendedProps.isUserEvent) {
    // Navigate to event details page
    window.location.href = `/event/${clickInfo.event.id}`;
    return;
  }

  // For regular calendar events
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
  height: auto;
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
