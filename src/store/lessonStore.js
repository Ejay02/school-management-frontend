import { defineStore } from "pinia";
import { getAllLessons } from "../graphql/queries";
import { apolloClient } from "../../apollo-client";

export const useLessonStore = defineStore("lessonStore", {
  state: () => ({
    allLessons: [], // Store all lessons
    lessons: [], // Store paginated lessons
    loading: false,
    error: null,
    hasMore: true,
    totalPages: 1,
    totalCount: 0,
  }),

  actions: {
    async fetchLessons({
      page = 1,
      limit = 10,
      search = "",
      sortBy = "",
      sortOrder = "",
    } = {}) {
      this.loading = true;

      try {
        // First fetch all lessons if we haven't already
        if (this.allLessons.length === 0) {
          const { data } = await apolloClient.query({
            query: getAllLessons,
            variables: { pagination: { page: 1, limit: 1000 } },
          });

          this.allLessons = data.getAllLessons;
          this.totalCount = this.allLessons.length;
          this.totalPages = Math.ceil(this.totalCount / limit);
        }

        // Handle pagination locally
        const start = (page - 1) * limit;
        const end = start + limit;
        this.lessons = this.allLessons.slice(start, end);
        this.hasMore = end < this.totalCount;

      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },
  },
});
