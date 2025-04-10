import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import { getAllSubjects } from "../graphql/queries";

export const useSubjectStore = defineStore("subjectStore", {
  state: () => ({
    allSubjects: [], // Store all subjects
    subjects: [], // Store paginated subjects
    loading: false,
    error: null,
    hasMore: true,
    totalPages: 1,
    totalCount: 0,
  }),

  actions: {
    async fetchSubjects({
      page = 1,
      limit = 10,
      search = "",
      sortBy = "",
      sortOrder = "",
    } = {}) {
      this.loading = true;

      try {
        // First fetch all subjects if we haven't already
        if (this.allSubjects.length === 0) {
          const { data } = await apolloClient.query({
            query: getAllSubjects,
            variables: { pagination: { page: 1, limit: 1000 } }, // Get all subjects
            fetchPolicy: "network-only",
          });
          this.allSubjects = data.getAllSubjects;
          this.totalCount = this.allSubjects.length;
          this.totalPages = Math.ceil(this.totalCount / limit);
        }

        // Calculate pagination locally
        const start = (page - 1) * limit;
        const end = start + limit;
        this.subjects = this.allSubjects.slice(start, end);
        this.hasMore = end < this.totalCount;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    async refreshSubjects() {
      // Clear the Apollo cache for getAllSubjects query
      await apolloClient.cache.evict({ fieldName: "getAllSubjects" });
      await apolloClient.cache.gc();
      this.allSubjects = [];
      await this.fetchSubjects();
    },

    // Method to delete a subject from local state
    removeSubjectFromState(subjectId) {
      this.allSubjects = this.allSubjects.filter(
        (subject) => subject.id !== subjectId
      );
      this.subjects = this.subjects.filter(
        (subject) => subject.id !== subjectId
      );
      this.totalCount = this.allSubjects.length;
      this.totalPages = Math.ceil(this.totalCount / this.limit || 10);
    },
  },
});
