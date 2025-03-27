import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import { getAllClasses } from "../graphql/queries";

export const useClassStore = defineStore("classStore", {
  state: () => ({
    allClasses: [], // Store all classes
    classes: [], // Store paginated classes
    loading: false,
    error: null,
    hasMore: true,
    totalPages: 1,
    totalCount: 0,
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
        // First fetch all classes if we haven't already
        if (this.allClasses.length === 0) {
          const { data } = await apolloClient.query({
            query: getAllClasses,
            variables: { pagination: { page: 1, limit: 1000 } },
            fetchPolicy: "network-only",
          });

          this.allClasses = data.getAllClasses;

          this.totalCount = this.allClasses.length;
          this.totalPages = Math.ceil(this.totalCount / limit);
        }

        // Handle pagination locally
        const start = (page - 1) * limit;
        const end = start + limit;
        this.classes = this.allClasses.slice(start, end);
        this.hasMore = end < this.totalCount;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    addClass(newClass) {
      // Add the new class to both arrays
      this.allClasses.unshift(newClass);
      this.classes.unshift(newClass);
    },

    async refreshClasses() {
      // Reset allClasses to force a fresh fetch
      this.allClasses = [];
      await this.fetchClasses();
    },
  },

  getters: {
    getClassNames: (state) => {
      return state.allClasses.map((classItem) => classItem.name);
    },
  },
});
