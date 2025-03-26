import { defineStore } from "pinia";

import { apolloClient } from "../../apollo-client";
import { getAllAssignments } from "../graphql/queries";

export const useAssignmentStore = defineStore("assignmentStore", {
  state: () => ({
    allAssignments: [], // Store all assignments
    assignments: [], // Store paginated assignments
    loading: false,
    error: null,
    hasMore: true,
    totalPages: 1,
    totalCount: 0,
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
        // First fetch all assignments if we haven't already
        if (this.allAssignments.length === 0) {
          const { data } = await apolloClient.query({
            query: getAllAssignments,
            variables: { pagination: { page: 1, limit: 1000 } },
          });

          this.allAssignments = data.getAllAssignments;
          this.totalCount = this.allAssignments.length;
          this.totalPages = Math.ceil(this.totalCount / limit);
        }

        // Handle pagination locally
        const start = (page - 1) * limit;
        const end = start + limit;
        this.assignments = this.allAssignments.slice(start, end);
        this.hasMore = end < this.totalCount;

      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },
  },
});
