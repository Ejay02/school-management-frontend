import { defineStore } from "pinia";

import { apolloClient } from "../../apollo-client";
import { getAllExams, getClassExams } from "../graphql/queries";

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
            variables: { params: { page: 1, limit: 1000 } },
            fetchPolicy: "network-only",
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

    async fetchClassExams(classId, { page = 1, limit = 100 } = {}) {
      this.loading = true;

      try {
        const { data } = await apolloClient.query({
          query: getClassExams,
          variables: {
            classId,
            params: { page, limit },
          },
          fetchPolicy: "network-only",
        });

        this.classExams = data.getClassExams;
        this.totalCount = this.classExams.length;
        this.totalPages = Math.ceil(this.totalCount / limit);
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    resetExams() {
      this.allExams = [];
      this.exams = [];
      this.classExams = [];
    },

    async refreshExams(page = 1, limit = 10) {
      // Reset the exams array to force a fresh fetch
      this.resetExams();

      // Fetch exams again
      await this.fetchExams({ page, limit });
    },

    async refreshClassExams(classId, { page = 1, limit = 10 } = {}) {
      this.resetExams();
      await this.fetchClassExams(classId, { page, limit });
    },
  },
});
