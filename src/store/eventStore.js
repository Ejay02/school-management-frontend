import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import { getEvents } from "../graphql/queries";

export const useEventStore = defineStore("eventStore", {
  state: () => ({
    events: [],
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
            params: {}, // provide valid pagination params if needed
            filter: {}, // provide an empty object if no filters are applied
          },
          fetchPolicy: "no-cache",
        });
        console.log("res:", res);

        this.events = res.data.getEvents;
        return this.events;
      } catch (error) {
        this.error = error.message || "Error fetching events";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
