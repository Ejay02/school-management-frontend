<template>
  <CalenderSkeleton v-if="eventStore.loading || !holidaysFetched" />

  <div v-else class="fc-custom-theme w-full">
    <div class="w-full">
      <div class="calendar-container">
        <FullCalendar
          ref="calendarRef"
          :options="calendarOptions"
          class="w-full"
        />
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="showQuickCreateModal"
        class="fixed top-0 left-0 w-full h-full bg-gray-900/80 flex justify-center items-center z-50 p-4"
        @click.self="closeQuickCreate"
        :key="showQuickCreateModal"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md">
          <div
            class="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-t-xl flex justify-between items-center"
          >
            <h2 class="text-lg font-bold text-white">Add to Calendar</h2>
            <button
              @click="closeQuickCreate"
              class="text-white hover:text-gray-200 transition-colors duration-200 h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/20"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="p-6">
            <div class="text-sm text-gray-600 mb-4">
              {{ quickCreateLabel }}
            </div>
            <div v-if="isTeacher" class="grid grid-cols-1 gap-4 mb-5">
              <div>
                <label
                  v-if="classOptions.length !== 1"
                  for="quickCreateClass"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Class</label
                >
                <div
                  v-else
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Class
                </div>
                <div
                  v-if="classOptions.length === 1"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700"
                >
                  {{ classOptions[0] }}
                </div>
                <select
                  v-else
                  id="quickCreateClass"
                  v-model="selectedClassName"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option
                    v-for="name in classOptions"
                    :key="name"
                    :value="name"
                  >
                    {{ name }}
                  </option>
                </select>
              </div>
              <div>
                <label
                  v-if="subjectOptions.length !== 1"
                  for="quickCreateSubject"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Subject</label
                >
                <div
                  v-else
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </div>
                <div
                  v-if="subjectOptions.length === 1"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700"
                >
                  {{ subjectOptions[0].label }}
                </div>
                <select
                  v-else
                  id="quickCreateSubject"
                  v-model="selectedSubjectId"
                  :disabled="!selectedClassName"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select a subject</option>
                  <option
                    v-for="subject in subjectOptions"
                    :key="subject.value"
                    :value="subject.value"
                  >
                    {{ subject.label }}
                  </option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-1 gap-3">
              <button
                @click="goToCreate('lesson')"
                :disabled="!canCreateWithSelection || isBreakSlot"
                class="w-full inline-flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none"
              >
                Add Lesson
              </button>
              <button
                @click="goToCreate('exam')"
                :disabled="!canCreateWithSelection || isBreakSlot"
                class="w-full inline-flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none"
              >
                Add Exam
              </button>
              <button
                @click="goToCreate('assignment')"
                :disabled="!canCreateWithSelection"
                class="w-full inline-flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none"
              >
                Add Assignment
              </button>
            </div>
            <div class="flex justify-end mt-5">
              <button
                @click="closeQuickCreate"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import FullCalendar from "@fullcalendar/vue3";

import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import { useEventStore } from "../../store/eventStore.js";
import { useClassStore } from "../../store/classStore";
import { useNotificationStore } from "../../store/notification";
import { useUserStore } from "../../store/userStore";
import {
  fetchCountry,
  fetchHolidays,
  formatTime,
} from "../../utils/date.holidays.js";
import CalenderSkeleton from "../skeletonLoaders/calenderSkeleton.vue";

const currentEvents = ref([]);
const calendarRef = ref(null);
const holidaysFetched = ref(false);
const eventStore = useEventStore();
const notificationStore = useNotificationStore();
const userStore = useUserStore();
const classStore = useClassStore();
const router = useRouter();

const showQuickCreateModal = ref(false);
const quickCreateStart = ref(null);
const quickCreateEnd = ref(null);
const selectedClassName = ref("");
const selectedSubjectId = ref("");

const role = computed(() => String(userStore.currentRole || "").toLowerCase());
const canQuickCreate = computed(() =>
  ["teacher", "admin", "super_admin"].includes(role.value),
);

const isTeacher = computed(() => role.value === "teacher");

const classOptions = computed(() => {
  return classStore.getClassNames?.map((c) => c.name) || [];
});

const subjectOptions = computed(() => {
  if (!selectedClassName.value) return [];

  if (!isTeacher.value) {
    return classStore
      .getSubjectsForClass(selectedClassName.value)
      .map((s) => ({ value: s.id, label: s.name }));
  }

  const userId = userStore.userInfo?.id;
  return classStore
    .getTeacherSubjectsForClass(selectedClassName.value, userId)
    .map((s) => ({ value: s.id, label: s.name }));
});

const canCreateWithSelection = computed(() => {
  if (!isTeacher.value) return true;
  return Boolean(selectedClassName.value && selectedSubjectId.value);
});

const selectionStorageKey = "plannerQuickCreateSelection";

const loadSavedSelection = () => {
  const raw = localStorage.getItem(selectionStorageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveSelection = () => {
  if (!selectedClassName.value) return;
  localStorage.setItem(
    selectionStorageKey,
    JSON.stringify({
      className: selectedClassName.value,
      subjectId: selectedSubjectId.value || "",
    }),
  );
};

const formatDateForQuery = (date) => {
  if (!date) return "";
  return date.toISOString().split("T")[0];
};

const formatTimeForQuery = (date) => {
  if (!date) return "";
  return date.toTimeString().slice(0, 5);
};

const getDayName = (date) => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

const breakStartMinutes = 12 * 60;
const breakEndMinutes = 13 * 60;

const timeRangesOverlap = (aStart, aEnd, bStart, bEnd) => {
  return aStart < bEnd && bStart < aEnd;
};

const isBreakOverlap = (rangeStart, rangeEnd) => {
  if (!(rangeStart instanceof Date) || !(rangeEnd instanceof Date))
    return false;
  if (Number.isNaN(rangeStart.getTime()) || Number.isNaN(rangeEnd.getTime()))
    return false;

  const start = new Date(rangeStart);
  const end = new Date(rangeEnd);
  if (end.getTime() <= start.getTime()) return false;

  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);

  while (cursor.getTime() < end.getTime()) {
    const dayIndex = cursor.getDay();
    const isWeekday = dayIndex >= 1 && dayIndex <= 5;
    if (isWeekday) {
      const breakStart = new Date(cursor);
      breakStart.setHours(12, 0, 0, 0);
      const breakEnd = new Date(cursor);
      breakEnd.setHours(13, 0, 0, 0);

      const aStart = Math.max(start.getTime(), breakStart.getTime());
      const aEnd = Math.min(end.getTime(), breakEnd.getTime());
      if (aStart < aEnd) return true;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return false;
};

const isBreakSlot = computed(() => {
  if (!quickCreateStart.value || !quickCreateEnd.value) return false;
  return isBreakOverlap(quickCreateStart.value, quickCreateEnd.value);
});

const quickCreateLabel = computed(() => {
  if (!quickCreateStart.value) return "";
  const date = formatDateForQuery(quickCreateStart.value);
  const start = formatTimeForQuery(quickCreateStart.value);
  const end = formatTimeForQuery(quickCreateEnd.value);
  const endPart = end ? ` - ${end}` : "";
  return `${date} • ${start}${endPart}`;
});

const openQuickCreate = async (start, end) => {
  if (!canQuickCreate.value) return;
  quickCreateStart.value = start || null;
  quickCreateEnd.value = end || null;

  if (!classStore.allClasses.length) {
    await classStore.fetchClasses({ page: 1, limit: 1000 });
  } else if (isTeacher.value) {
    const firstClass = classStore.allClasses[0];
    const firstSubject = firstClass?.subjects?.[0];
    if (firstSubject && !Object.hasOwn(firstSubject, "teachers")) {
      await classStore.refreshClasses();
    }
  }

  const saved = loadSavedSelection();
  if (saved?.className && typeof saved.className === "string") {
    selectedClassName.value = saved.className;
  } else if (!selectedClassName.value) {
    selectedClassName.value = classOptions.value?.[0] || "";
  }

  if (saved?.subjectId && typeof saved.subjectId === "string") {
    selectedSubjectId.value = saved.subjectId;
  }

  ensureValidSelection();
  showQuickCreateModal.value = true;
};

const ensureValidSelection = () => {
  if (!isTeacher.value) return;
  if (!selectedClassName.value) {
    selectedSubjectId.value = "";
    return;
  }

  const subjects = subjectOptions.value;
  if (!subjects.length) {
    selectedSubjectId.value = "";
    return;
  }

  const hasSelected = subjects.some((s) => s.value === selectedSubjectId.value);
  if (!hasSelected) {
    selectedSubjectId.value = subjects[0].value;
  }
};

const closeQuickCreate = () => {
  showQuickCreateModal.value = false;
  quickCreateStart.value = null;
  quickCreateEnd.value = null;
  selectedClassName.value = "";
  selectedSubjectId.value = "";
};

const goToCreate = (type) => {
  if (!quickCreateStart.value) return;
  if (!canCreateWithSelection.value) return;
  if (isBreakSlot.value && (type === "lesson" || type === "exam")) {
    notificationStore.addNotification({
      type: "error",
      message: "Break time is 12:00pm to 1:00pm. Please choose another time.",
    });
    return;
  }
  const date = formatDateForQuery(quickCreateStart.value);
  const startTime = formatTimeForQuery(quickCreateStart.value);
  const endTime = formatTimeForQuery(quickCreateEnd.value);
  const day = getDayName(quickCreateStart.value);
  const className = selectedClassName.value;
  const subjectId = selectedSubjectId.value;

  saveSelection();
  closeQuickCreate();

  if (type === "lesson") {
    router.push({
      path: "/dashboard/lesson/new",
      query: {
        date,
        day,
        startTime,
        endTime,
        className,
        subjectId,
      },
    });
    return;
  }

  if (type === "exam") {
    router.push({
      path: "/dashboard/exam/new",
      query: {
        date,
        startTime,
        endTime,
        className,
        subjectId,
      },
    });
    return;
  }

  if (type === "assignment") {
    router.push({
      path: "/dashboard/assignment/new",
      query: {
        startDate: date,
        dueDate: date,
        className,
        subjectId,
      },
    });
  }
};

watch(
  () => selectedClassName.value,
  () => {
    ensureValidSelection();
  },
);

watch(
  () => subjectOptions.value,
  () => {
    ensureValidSelection();
  },
);

watch(
  () => classOptions.value,
  (next) => {
    if (!isTeacher.value) return;
    if (selectedClassName.value) return;
    if (next.length === 1) {
      selectedClassName.value = next[0];
    }
  },
);

const getStatusColor = (status) => {
  if (status === "CANCELLED") return "#FDA4AF";
  if (status === "COMPLETED") return "#86EFAC";
  return "#FAE27C";
};

const holidayEvents = ref([]);

const getBreakEventsInRange = (rangeStart, rangeEnd) => {
  const events = [];
  if (!(rangeStart instanceof Date) || !(rangeEnd instanceof Date))
    return events;
  if (Number.isNaN(rangeStart.getTime()) || Number.isNaN(rangeEnd.getTime()))
    return events;

  const cursor = new Date(rangeStart);
  cursor.setHours(0, 0, 0, 0);

  while (cursor.getTime() < rangeEnd.getTime()) {
    const dayIndex = cursor.getDay();
    const isWeekday = dayIndex >= 1 && dayIndex <= 5;
    if (isWeekday) {
      const start = new Date(cursor);
      start.setHours(12, 0, 0, 0);
      const end = new Date(cursor);
      end.setHours(13, 0, 0, 0);

      const startMinutes = start.getHours() * 60 + start.getMinutes();
      const endMinutes = end.getHours() * 60 + end.getMinutes();
      if (
        timeRangesOverlap(
          startMinutes,
          endMinutes,
          breakStartMinutes,
          breakEndMinutes,
        )
      ) {
        events.push({
          id: `break-${start.toISOString().split("T")[0]}`,
          title: "Break",
          start,
          end,
          backgroundColor: "#FDE68A",
          borderColor: "#F59E0B",
          textColor: "#92400E",
          editable: false,
          extendedProps: {
            isBreak: true,
          },
        });
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return events;
};

const syncCalendarEvents = (rangeStart, rangeEnd) => {
  const breakEvents = getBreakEventsInRange(rangeStart, rangeEnd);
  const combined = [
    ...holidayEvents.value,
    ...userEvents.value,
    ...breakEvents,
  ];
  calendarOptions.value.events = combined;

  if (!calendarRef.value) return;
  const calendarApi = calendarRef.value.getApi();
  calendarApi.removeAllEvents();
  calendarApi.addEventSource(combined);
};

// Fetch user events
const userEvents = computed(() => {
  if (!eventStore.allEvents || eventStore.allEvents.length === 0) return [];

  // Map events to FullCalendar format
  return eventStore.allEvents.map((event) => {
    // Get the color based on event status
    const statusColor = getStatusColor(event.status);

    return {
      id: event.id,
      title: event.title,
      start: event.startTime,
      end: event.endTime,
      description: event.description,
      location: event.location,
      backgroundColor: statusColor,
      borderColor: statusColor,
      extendedProps: {
        status: event.status,
        type: event.type,
        isUserEvent: true,
      },
    };
  });
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
  datesSet: function (info) {
    syncCalendarEvents(info.start, info.end);
  },
  dateClick: function (info) {
    const calendarApi = info.view.calendar;
    if (String(info.view.type || "").startsWith("dayGrid")) {
      calendarApi.changeView("timeGridDay", info.dateStr);
      return;
    }

    const start = info.date;
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    openQuickCreate(start, end);
  },
  select: function (info) {
    openQuickCreate(info.start, info.end);
  },
  eventClick: handleEventClick,
  eventsSet: handleEvents,

  eventDidMount: function (info) {
    mountUserEventTooltip(info);
  },

  eventTimeFormat: {
    hour: "numeric",
    minute: "2-digit",
    meridiem: "short",
    omitZeroMinute: false,
  },
});

function buildUserEventTooltipHtml({
  title,
  status,
  type,
  start,
  end,
  location,
  statusColor,
}) {
  const details = [];
  if (status) {
    details.push(
      `<div class="tooltip-detail"><i class="tooltip-icon status-icon"></i>Status: ${status}</div>`,
    );
  }
  if (type) {
    details.push(
      `<div class="tooltip-detail"><i class="tooltip-icon type-icon"></i>Type: ${type}</div>`,
    );
  }
  if (start) {
    details.push(
      `<div class="tooltip-detail"><i class="tooltip-icon time-icon"></i>Start: ${start}</div>`,
    );
  }
  if (end) {
    details.push(
      `<div class="tooltip-detail"><i class="tooltip-icon time-icon"></i>End: ${end}</div>`,
    );
  }
  if (location) {
    details.push(
      `<div class="tooltip-detail"><i class="tooltip-icon location-icon"></i>Location: ${location}</div>`,
    );
  }

  return `<div class="tooltip-container">
    <div class="tooltip-header">
      <div class="status-indicator" style="background-color: ${statusColor}"></div>
      <div class="tooltip-title">${title}</div>
    </div>
    ${details.join("")}
  </div>`;
}

function mountUserEventTooltip(info) {
  if (!info?.event?.extendedProps?.isUserEvent) return;
  const eventEl = info.el;
  if (!eventEl) return;

  const tooltip = document.createElement("div");
  tooltip.className = "event-tooltip";
  tooltip.style.display = "none";

  const eventTitle = info.event.title;
  const eventStatus = info.event.extendedProps.status || "";
  const eventType = info.event.extendedProps.type || "";
  const eventStart = info.event.start ? formatTime(info.event.start) : "";
  const eventEnd = info.event.end ? formatTime(info.event.end) : "";
  const eventLocation = info.event.extendedProps.location || "";
  const statusColor = getStatusColor(eventStatus);

  tooltip.innerHTML = buildUserEventTooltipHtml({
    title: eventTitle,
    status: eventStatus,
    type: eventType,
    start: eventStart,
    end: eventEnd,
    location: eventLocation,
    statusColor,
  });

  document.body.appendChild(tooltip);

  const showTooltip = () => {
    const rect = eventEl.getBoundingClientRect();
    tooltip.style.position = "absolute";
    tooltip.style.left = rect.left + globalThis.scrollX + "px";
    tooltip.style.top = rect.bottom + globalThis.scrollY + 5 + "px";
    tooltip.style.display = "block";
  };

  const hideTooltip = () => {
    tooltip.style.display = "none";
  };

  eventEl.addEventListener("mouseover", showTooltip);
  eventEl.addEventListener("mouseout", hideTooltip);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        Array.from(mutation.removedNodes).includes(eventEl) ||
        !document.body.contains(eventEl)
      ) {
        tooltip.remove();
        observer.disconnect();
        break;
      }
    }
  });

  if (eventEl.parentNode) {
    observer.observe(eventEl.parentNode, {
      childList: true,
      subtree: true,
    });
    eventEl._tooltipObserver = observer;
  }
}

function handleEventClick(clickInfo) {
  // For user events, navigate to event details
  if (clickInfo.event.extendedProps.isUserEvent) {
    // Navigate to event details page
    globalThis.location.href = `/event/${clickInfo.event.id}`;
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
    holidayEvents.value = holidays;

    // Fetch events for the current user - only call fetchEvents once
    await eventStore.fetchEvents();

    if (calendarRef.value) {
      const calendarApi = calendarRef.value.getApi();
      syncCalendarEvents(
        calendarApi.view.activeStart,
        calendarApi.view.activeEnd,
      );
    }

    holidaysFetched.value = true;
  } catch (error) {
    console.error("Error fetching calendar data:", error);
  }
});

watch(
  () => userEvents.value,
  () => {
    if (!calendarRef.value) return;
    const calendarApi = calendarRef.value.getApi();
    syncCalendarEvents(
      calendarApi.view.activeStart,
      calendarApi.view.activeEnd,
    );
  },
);
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
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
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
  max-width: 350px;
  width: 320px; /* Added fixed width for consistency */
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
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

/* Fix for overlapping text in day view */
.fc .fc-timegrid-event .fc-event-time {
  display: block; /* Change from flex to block */
  white-space: normal; /* Allow text to wrap */
  font-size: 0.7rem; /* Slightly smaller font */
  margin-bottom: 2px; /* Add space between time and title */
  overflow: hidden;
  text-overflow: ellipsis;
}

.fc .fc-timegrid-event .fc-event-title {
  display: block;
  white-space: normal; /* Allow text to wrap */
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.7rem;
  line-height: 1.2;
}

/* Make sure the event container has enough padding */
.fc .fc-timegrid-event {
  padding: 4px 6px;
}

/* Fix for list view time display */
.fc .fc-list-event-time {
  white-space: nowrap; /* Keep time on one line */
  font-size: 0.8rem;
  color: #555;
  width: 140px; /* Fixed width to prevent overflow */
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Ensure list event title doesn't overflow */
.fc .fc-list-event-title {
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fc-h-event .fc-event-title,
.fc .fc-timegrid-event .fc-event-time,
.fc-v-event .fc-event-title-container {
  color: black;
}
</style>
