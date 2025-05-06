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

  // Map events to FullCalendar format without filtering
  return eventStore.allEvents.map((event) => ({
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
  eventClick: handleEventClick,
  eventsSet: handleEvents,

  // Modern tooltip implementation
  eventDidMount: function (info) {
    if (info.event.extendedProps.isUserEvent) {
      const eventEl = info.el;

      // Create tooltip element
      const tooltip = document.createElement("div");
      tooltip.className = "event-tooltip";
      tooltip.style.display = "none";

      // Get event data
      const eventTitle = info.event.title;
      const eventStatus = info.event.extendedProps.status || "";
      const eventType = info.event.extendedProps.type || "";
      const eventStart = info.event.start ? formatTime(info.event.start) : "";
      const eventEnd = info.event.end ? formatTime(info.event.end) : "";
      const eventLocation = info.event.extendedProps.location || "";

      // Get status color
      const statusColor =
        eventStatus === "CANCELLED"
          ? "#FDA4AF"
          : eventStatus === "COMPLETED"
          ? "#86EFAC"
          : "#FAE27C";

      // Create tooltip content with modern styling
      tooltip.innerHTML = `
        <div class="tooltip-container">
          <div class="tooltip-header">
            <div class="status-indicator" style="background-color: ${statusColor}"></div>
            <div class="tooltip-title">${eventTitle}</div>
          </div>
          ${
            eventStatus
              ? `<div class="tooltip-detail"><i class="tooltip-icon status-icon"></i>Status: ${eventStatus}</div>`
              : ""
          }
          ${
            eventType
              ? `<div class="tooltip-detail"><i class="tooltip-icon type-icon"></i>Type: ${eventType}</div>`
              : ""
          }
          ${
            eventStart
              ? `<div class="tooltip-detail"><i class="tooltip-icon time-icon"></i>Start: ${eventStart}</div>`
              : ""
          }
          ${
            eventEnd
              ? `<div class="tooltip-detail"><i class="tooltip-icon time-icon"></i>End: ${eventEnd}</div>`
              : ""
          }
          ${
            eventLocation
              ? `<div class="tooltip-detail"><i class="tooltip-icon location-icon"></i>Location: ${eventLocation}</div>`
              : ""
          }
        </div>
      `;

      document.body.appendChild(tooltip);

      // Show tooltip on mouseover
      eventEl.addEventListener("mouseover", function () {
        const rect = eventEl.getBoundingClientRect();
        tooltip.style.position = "absolute";
        tooltip.style.left = rect.left + window.scrollX + "px";
        tooltip.style.top = rect.bottom + window.scrollY + 5 + "px"; // 5px offset
        tooltip.style.display = "block";
      });

      // Hide tooltip on mouseout
      eventEl.addEventListener("mouseout", function () {
        tooltip.style.display = "none";
      });

      // Clean up tooltip when event element is removed
      info.el.addEventListener("DOMNodeRemoved", function () {
        if (tooltip && tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      });
    }
  },

  eventTimeFormat: {
    hour: "numeric",
    minute: "2-digit",
    meridiem: "short",
    omitZeroMinute: false,
  },
});

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

onMounted(async () => {
  try {
    // Fetch holidays
    const countryCode = await fetchCountry();
    const holidays = await fetchHolidays(countryCode);
    holidays.forEach((holiday) => {
      holiday.classNames = ["bg-green-300", "ring-green-600/20"]; // Add holiday styles
    });

    // Fetch events for the current user - only call fetchEvents once
    await eventStore.fetchEvents();

    // Don't call refetchAll() here as it clears the events you just fetched

    // Combine holidays and user events
    calendarOptions.value.events = [...holidays, ...userEvents.value];
    console.log("calendarOptions:", calendarOptions.value);

    // Update the calendar with the latest events
    if (calendarRef.value) {
      const calendarApi = calendarRef.value.getApi();
      calendarApi.removeAllEvents();
      calendarApi.addEventSource(calendarOptions.value.events);
    }

    holidaysFetched.value = true;
  } catch (error) {
    console.error("Error fetching calendar data:", error);
  }
});
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

/* tooltip styling */
.event-tooltip {
  z-index: 10000;
  max-width: 350px; /* Increased from 300px to 350px */
  width: 320px; /* Added fixed width for consistency */
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
  animation: tooltip-fade-in 0.2s ease-out;
}

@keyframes tooltip-fade-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tooltip-container {
  padding: 0;
}

.tooltip-header {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eaeaea;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
}

.tooltip-title {
  font-weight: 600;
  font-size: 14px;
  color: #201d1d;
  line-height: 1.3;
}

.tooltip-detail {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  font-size: 12px;
  color: #555;
  border-bottom: 1px solid #f0f0f0;
}

.tooltip-detail:last-child {
  border-bottom: none;
}

.tooltip-icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
  opacity: 0.7;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

/* Simulate icons with CSS */
.status-icon {
  background-color: #792e8a;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clip-rule='evenodd' /%3E%3C/svg%3E");
}

.type-icon {
  background-color: #792e8a;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z' /%3E%3Cpath fill-rule='evenodd' d='M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z' clip-rule='evenodd' /%3E%3C/svg%3E");
}

.time-icon {
  background-color: #792e8a;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' clip-rule='evenodd' /%3E%3C/svg%3E");
}

.location-icon {
  background-color: #792e8a;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clip-rule='evenodd' /%3E%3C/svg%3E");
}
</style>
