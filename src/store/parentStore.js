import { defineStore } from "pinia";
import { useApolloClient } from "@vue/apollo-composable";
import { getAllParents } from "@/graphql/queries";

export const useParentStore = defineStore("parentStore", {
  state: () => ({
    parents: [],
    loading: false,
    error: null,
    hasMore: true,
    selectedParent: null,
  }),
  actions: {
    async fetchParents({
      page = 1,
      limit = 10,
      search = "",
      sortBy = "",
      sortOrder = "",
    } = {}) {
      this.loading = true;
      try {
        const client = useApolloClient().client;
        const paginationParams = { page, limit };
        if (search) paginationParams.search = search;
        if (sortBy) paginationParams.sortBy = sortBy;
        if (sortOrder) paginationParams.sortOrder = sortOrder;

        const { data } = await client.query({
          query: getAllParents,
          variables: { pagination: paginationParams },
        });

        const fetchedParents = data.getAllParents.map((parent) => ({
          ...parent,
          parentId: parent.id,
          photo: parent.img,
          students: parent.students.map(
            (student) => `${student.name} ${student.surname}`
          ),
        }));

        this.parents = fetchedParents;

        this.haMore = fetchedParents.length === limit;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
