import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import { getEventById, getEvents } from "../graphql/queries";
import { getData, setData } from "../utils/localStorageHelpers";
import { markEventAsRead, deleteEvent } from "../graphql/mutations";

const STORAGE_KEY = "newEventMarkers";
const READ_EVENTS_KEY = "readEvents";

export const useEventStore = defineStore("eventStore", {
  state: () => ({
    events: [],
    selectedEvent: null,
    loading: false,
    error: null,
    hasMore: true,
    // Initialize from localStorage or use an empty array
    newEventMarkers: getData(STORAGE_KEY) || [],
    readEvents: getData(READ_EVENTS_KEY) || [],
  }),

  actions: {
    async fetchEvents() {
      this.loading = true;
      this.error = null;

      try {
        const res = await apolloClient.query({
          query: getEvents,
          variables: {
            params: {},
            filter: {},
          },
          fetchPolicy: "no-cache",
        });

        this.events = res.data.getEvents;
        return this.events;
      } catch (error) {
        this.error = error.message || "Error fetching events";
        throw error;
      } finally {
        this.loading = false;
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

    async deleteEvent(eventId) {
      this.loading = true;
      this.error = null;

      try {
        const result = await apolloClient.mutate({
          mutation: deleteEvent,
          variables: { id: eventId },
        });

        if (result.data.deleteEvent) {
          // Update local state by removing the deleted event
          this.events = this.events.filter((event) => event.id !== eventId);

          // If the deleted event is the selected event, clear the selection
          if (this.selectedEvent && this.selectedEvent.id === eventId) {
            this.selectedEvent = null;
          }

          // Remove from newEventMarkers if present
          this.newEventMarkers = this.newEventMarkers.filter(
            (marker) => marker.id !== eventId
          );
          setData(STORAGE_KEY, this.newEventMarkers);

          // Remove from readEvents if present
          this.readEvents = this.readEvents.filter((id) => id !== eventId);
          setData(READ_EVENTS_KEY, this.readEvents);

          return true;
        }
        return false;
      } catch (error) {
        this.error = error.message || "Error deleting event";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    addNewEvent(event) {
      // Check if the event already exists in the events array
      const exists = this.events.some((e) => e.id === event.id);
      if (!exists) {
        // Add the event to the beginning of the events array
        this.events.unshift(event);

        // Check if the event is already marked as new
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
