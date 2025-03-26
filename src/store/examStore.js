import { defineStore } from "pinia";

import { apolloClient } from "../../apollo-client";
import { getAllExams } from "../graphql/queries";

export const useExamStore = defineStore("examStore", {
  state: () => ({
    allExams: [], // Store all exams
    exams: [], // Store paginated exams
    loading: false,
    error: null,
    hasMore: true,
    totalPages: 1,
    totalCount: 0,
  }),

  actions: {
    async fetchExams({
      page = 1,
      limit = 10,
      search = "",
      sortBy = "",
      sortOrder = "",
    } = {}) {
      this.loading = true;

      try {
        // First fetch all exams if we haven't already
        if (this.allExams.length === 0) {
          const { data } = await apolloClient.query({
            query: getAllExams,
            variables: { pagination: { page: 1, limit: 1000 } },
          });

          this.allExams = data.getAllExams;
          this.totalCount = this.allExams.length;
          this.totalPages = Math.ceil(this.totalCount / limit);
        }

        // Handle pagination locally
        const start = (page - 1) * limit;
        const end = start + limit;
        this.exams = this.allExams.slice(start, end);
        this.hasMore = end < this.totalCount;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },
  },
});
