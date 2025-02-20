import { defineStore } from "pinia";
import { useApolloClient } from "@vue/apollo-composable";
import { getAllAdminsQuery } from "@/graphql/queries";

export const useAdminStore = defineStore("adminStore", {
  state: () => ({
    admins: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAdmins() {
      this.loading = true;
      try {
        const client = useApolloClient().client;
        const { data } = await client.query({ query: getAllAdminsQuery });
        this.admins = data.getAllAdmins;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
