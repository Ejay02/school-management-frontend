import { defineStore } from "pinia";

import { useApolloClient } from "@vue/apollo-composable";
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
        const { client } = useApolloClient();
        const paginationParams = { page, limit };
        if (search) paginationParams.search = search;
        if (sortBy) paginationParams.sortBy = sortBy;
        if (sortOrder) paginationParams.sortOrder = sortOrder;

        const { data } = await client.query({
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
