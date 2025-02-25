import { defineStore } from "pinia";
import { getAllLessons } from "../graphql/queries";
import { useApolloClient } from "@vue/apollo-composable";

export const useLessonStore = defineStore("lessonStore", {
  state: () => ({
    lessons: [],
    loading: false,
    error: null,
    hasMore: true,
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
        const { client } = useApolloClient();
        const paginationParams = { page, limit };
        if (search) paginationParams.search = search;
        if (sortBy) paginationParams.sortBy = sortBy;
        if (sortOrder) paginationParams.sortOrder = sortOrder;

        const { data } = await client.query({
          query: getAllLessons,
          variables: { pagination: paginationParams },
        });

        this.lessons = data.getAllLessons;
        this.hasMore = data.getAllLessons.length === limit;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },
  },
});
