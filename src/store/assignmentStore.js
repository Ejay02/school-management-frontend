import { defineStore } from "pinia";

import { apolloClient } from "../../apollo-client";
import { getAllAssignments } from "../graphql/queries";

export const useAssignmentStore = defineStore("assignmentStore", {
  state: () => ({
    assignments: [],
    loading: false,
    error: null,
    hasMore: true,
  }),

  actions: {
    async fetchAssignments({
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
          query: getAllAssignments,
          variables: { pagination: paginationParams },
        });

        this.assignments = data.getAllAssignments;
        this.hasMore = data.getAllAssignments.length === limit;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },
  },
});
