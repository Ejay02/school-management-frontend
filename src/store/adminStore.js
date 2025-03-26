import { getAllAdminsQuery } from "@/graphql/queries";
import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";

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
        const { data } = await apolloClient.query({ query: getAllAdminsQuery });
        this.admins = data.getAllAdmins;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
