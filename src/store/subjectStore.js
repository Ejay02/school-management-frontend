import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import { getAllSubjects } from "../graphql/queries";

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
        const paginationParams = { page, limit };
        if (search) paginationParams.search = search;
        if (sortBy) paginationParams.sortBy = sortBy;
        if (sortOrder) paginationParams.sortOrder = sortOrder;

        const { data } = await apolloClient.query({
          query: getAllSubjects,
          variables: { pagination: paginationParams },
        });

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
