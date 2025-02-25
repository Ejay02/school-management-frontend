import { defineStore } from "pinia";

import { useApolloClient } from "@vue/apollo-composable";
import { getAllExams } from "../graphql/queries";

export const useExamStore = defineStore("examStore", {
  state: () => ({
    exams: [],
    loading: false,
    error: null,
    hasMore: true,
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
        const { client } = useApolloClient();
        const paginationParams = { page, limit };
        if (search) paginationParams.search = search;
        if (sortBy) paginationParams.sortBy = sortBy;
        if (sortOrder) paginationParams.sortOrder = sortOrder;

        const { data } = await client.query({
          query: getAllExams,
          variables: { pagination: paginationParams },
        });

        this.exams = data.getAllExams;
        this.hasMore = data.getAllExams.length === limit;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },
  },
});
