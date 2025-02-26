import { defineStore } from "pinia";

import { getResultStatistics } from "../graphql/queries";
import { apolloClient } from "../../apollo-client";

export const useResultStore = defineStore("resultStore", {
  state: () => ({
    results: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchResultStatistics(className) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apolloClient.query({
          query: getResultStatistics,
          variables: { className },
          fetchPolicy: "no-cache",
        });

        if (
          !res.data.getResultStatistics ||
          !res.data.getResultStatistics.distribution
        ) {
          this.results = {
            distribution: { above90: 0, above80: 0, above70: 0, below50: 0 },
          };
        } else {
          this.results = res.data.getResultStatistics;
        }
      } catch (error) {
        this.error = error;
        
      } finally {
        this.loading = false;
      }
    },
  },
});
