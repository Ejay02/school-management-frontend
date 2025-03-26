import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import { getAllClasses } from "../graphql/queries";

export const useClassStore = defineStore("classStore", {
  state: () => ({
    classes: [],
    loading: false,
    error: null,
    hasMore: true,
  }),

  actions: {
    async fetchClasses({
      page = 1,
      limit = 10,
      search = "",
      sortBy = "",
      sortOrder = "",
    } = {}) {
      this.loading = true;

      try {
        const paginationParams = { page, limit };
        if (search) paginationParams.search = search;
        if (sortBy) paginationParams.sortBy = sortBy;
        if (sortOrder) paginationParams.sortOrder = sortOrder;

        const { data } = await apolloClient.query({
          query: getAllClasses,
          variables: { pagination: paginationParams },
          fetchPolicy: "network-only",
        });

        this.classes = data.getAllClasses;
        this.hasMore = data.getAllClasses.length >= Number(limit);
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    addClass(newClass) {
      // Add the new class to the beginning of the array
      this.classes.unshift(newClass);
    },

    // Refresh classes after a new class is created
    async refreshClasses() {
      // Reset to first page and fetch fresh data
      await this.fetchClasses();
    },
  },
});
