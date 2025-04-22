import { getAllParents } from "@/graphql/queries";
import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";

export const useParentStore = defineStore("parentStore", {
  state: () => ({
    allParents: [], // Store all parents
    parents: [], // Store paginated parents
    loading: false,
    error: null,
    hasMore: true,
    selectedParent: null,
    totalPages: 1,
    totalCount: 0,
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
        // First fetch all parents if we haven't already
        if (this.allParents.length === 0) {
          const { data } = await apolloClient.query({
            query: getAllParents,
            variables: { pagination: { page: 1, limit: 1000 } },
          });

          this.allParents = data.getAllParents.map((parent) => ({
            ...parent,
            parentId: parent.id,
            photo: parent.image,
            students: parent.students.map(
              (student) => `${student.name} ${student.surname}`
            ),
          }));
          
          this.totalCount = this.allParents.length;
          this.totalPages = Math.ceil(this.totalCount / limit);
        }

        // Handle pagination locally
        const start = (page - 1) * limit;
        const end = start + limit;
        this.parents = this.allParents.slice(start, end);
        this.hasMore = end < this.totalCount;

      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
