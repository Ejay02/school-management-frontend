import { defineStore } from "pinia";
import { getAllClasses } from "../graphql/queries";
import { useApolloClient } from "@vue/apollo-composable";

export const useClassStore = defineStore("classStore", {
  state: () => ({
    classes: [],
    loading: false,
    error: null,
    hasMore: true,
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
        const { client } = useApolloClient();
        const paginationParams = { page, limit };
        if (search) paginationParams.search = search;
        if (sortBy) paginationParams.sortBy = sortBy;
        if (sortOrder) paginationParams.sortOrder = sortOrder;

        const { data } = await client.query({
          query: getAllClasses,
          variables: { pagination: paginationParams },
        });

        this.classes = data.getAllClasses;
        this.hasMore = data.getAllClasses.length === limit;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },
  },
});
