import { defineStore } from "pinia";
import { useApolloClient } from "@vue/apollo-composable";
import { getAllParents } from "@/graphql/queries";

export const useParentStore = defineStore("parentStore", {
  state: () => ({
    parents: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchParents(pagination = {}) {
      this.loading = true;
      try {
        const client = useApolloClient().client;
        const { data } = await client.query({
          query: getAllParents,
          variables: { pagination },
        });
        this.parents = data.getAllParents;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
