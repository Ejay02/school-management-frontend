import { defineStore } from "pinia";
import { getAllSubjects } from "../graphql/queries";
import { useApolloClient } from "@vue/apollo-composable";

export const useSubjectStore = defineStore("subjectStore", {
  state: () => ({
    subjects: [],
    loading: false,
    error: null,
    hasMore: true,
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
        const { client } = useApolloClient();
        const paginationParams = { page, limit };
        if (search) paginationParams.search = search;
        if (sortBy) paginationParams.sortBy = sortBy;
        if (sortOrder) paginationParams.sortOrder = sortOrder;

        const { data } = await client.query({
          query: getAllSubjects,
          variables: { pagination: paginationParams },
        });

        console.log("data:", data);

        this.subjects = data.getAllSubjects;
        this.hasMore = data.getAllSubjects.length === limit;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },
  },
});
