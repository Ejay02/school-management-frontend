import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import { getEventById, getEvents } from "../graphql/queries";

export const useEventStore = defineStore("eventStore", {
  state: () => ({
    events: [],
    selectedEvent: null,
    loading: false,
    error: null,
    hasMore: true,
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
        this.error = error.message || "Error fetching events";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
