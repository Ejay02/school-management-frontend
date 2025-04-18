import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import { getAllLessons, getLessonById } from "../graphql/queries";

export const useLessonStore = defineStore("lessonStore", {
  state: () => ({
    allLessons: [], // Store all lessons
    lessons: [], // Store paginated lessons
    selectedLesson: null,
    loading: false,
    error: null,
    hasMore: true,
    totalPages: 1,
    totalCount: 0,
  }),

  actions: {
    // Reset lessons to force a fresh fetch
    resetLessons() {
      this.allLessons = [];
      this.lessons = [];
    },

    // Refresh lessons by forcing a new fetch
    async refreshLessons(page = 1, limit = 10) {
      // Reset the lessons array to force a fresh fetch
      this.resetLessons();
      // Fetch lessons again
      await this.fetchLessons({ page, limit });
    },

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
            fetchPolicy: "network-only", // Force a network request instead of using cache
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

    async fetchLessonById(id) {
      this.loading = true;
      this.error = null;

      try {
        const res = await apolloClient.query({
          query: getLessonById,
          variables: { id },
          fetchPolicy: "network-only", // Force a network request instead of using cache
        });

        this.selectedLesson = res?.data?.getLessonById;
        return res?.data?.getLessonById;
      } catch (error) {
        this.error = error.message || "Error fetching event";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
