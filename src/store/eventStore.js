import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import { markEventAsRead } from "../graphql/mutations";
import { getEventById, getEvents } from "../graphql/queries";
import { getData, setData } from "../utils/localStorageHelpers";

const STORAGE_KEY = "newEventMarkers";
const READ_EVENTS_KEY = "readEvents";

export const useEventStore = defineStore("eventStore", {
  state: () => ({
    allEvents: [], // Store all events
    events: [], // Store paginated events
    selectedEvent: null,
    loading: false,
    error: null,
    hasMore: true,
    totalPages: 1,
    totalCount: 0,
    newEventMarkers: getData(STORAGE_KEY) || [],
    readEvents: getData(READ_EVENTS_KEY) || [],
  }),

  actions: {
    async fetchEvents({
      page = 1,
      limit = 10,
      search = "",
      sortBy = "",
      sortOrder = "",
    } = {}) {
      this.loading = true;
      this.error = null;

      try {
        // First fetch all events if we haven't already
        if (this.allEvents.length === 0) {
          const res = await apolloClient.query({
            query: getEvents,
            variables: {
              params: {},
              filter: {},
            },
            fetchPolicy: "network-only",
          });

          this.allEvents = res.data.getEvents;
          this.totalCount = this.allEvents.length;
          this.totalPages = Math.ceil(this.totalCount / limit);
        }

        // Handle pagination locally
        const start = (page - 1) * limit;
        const end = start + limit;
        this.events = this.allEvents.slice(start, end);
        this.hasMore = end < this.totalCount;

        return this.events;
      } catch (error) {
        this.error = error.message || "Error fetching events";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update addNewEvent to handle both arrays
    addNewEvent(event) {
      const exists = this.allEvents.some((e) => e.id === event.id);
      if (!exists) {
        this.allEvents.unshift(event);
        this.events.unshift(event);

        const alreadyNew = this.newEventMarkers.some(
          (marker) => marker.id === event.id
        );
        if (!alreadyNew) {
          const newEntry = { id: event.id, addedAt: Date.now() };
          this.newEventMarkers.push(newEntry);
          setData(STORAGE_KEY, this.newEventMarkers);
        }
      }
    },

    async fetchEventById(id) {
      this.loading = true;
      this.error = null;

      try {
        const res = await apolloClient.query({
          query: getEventById,
          variables: { id },
          fetchPolicy: "no-cache",
        });

        this.selectedEvent = res.data.getEventById;
      } catch (error) {
        this.error = error.message || "Error fetching event";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async markEventAsRead(eventId) {
      if (!this.isEventRead(eventId)) {
        try {
          const result = await apolloClient.mutate({
            mutation: markEventAsRead,
            variables: { eventId },
          });

          if (result.data.markEventAsRead) {
            this.readEvents.push(eventId);
            setData(READ_EVENTS_KEY, this.readEvents);
            return true;
          }
          return false;
        } catch (error) {
          this.error = error.message || "Error marking event as read";
          throw error;
        }
      }
      return true;
    },

    async refetchAll() {
      try {
          // Clear all cached data
          this.allEvents = [];
          this.events = [];
          this.selectedEvent = null;
          
          // Fetch fresh data
          await this.fetchEvents();
          
          // Clean up any expired markers
          this.cleanupNewEventMarkers();
          
          return this.events;
      } catch (error) {
          this.error = error.message;
          throw error;
      }
  },

    isNewEvent(eventId) {
      // Look for the event marker and check if it's within the 1-hour window
      const marker = this.newEventMarkers.find((m) => m.id === eventId);
      if (marker) {
        const oneHour = 1000 * 60 * 60;
        return Date.now() - marker.addedAt < oneHour;
      }
      return false;
    },

    // Cleanup expired markers (older than one hour)
    cleanupNewEventMarkers() {
      const oneHour = 1000 * 60 * 60;
      const now = Date.now();
      this.newEventMarkers = this.newEventMarkers.filter(
        (marker) => now - marker.addedAt < oneHour
      );
      setData(STORAGE_KEY, this.newEventMarkers);
    },

    isEventRead(eventId) {
      return this.readEvents.includes(eventId);
    },

    isEventNow(event) {
      const now = new Date().getTime();
      const startTime = new Date(event.startTime).getTime();
      const endTime = new Date(event.endTime).getTime();

      return now >= startTime && now <= endTime;
    },
  },
});
