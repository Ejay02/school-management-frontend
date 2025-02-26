import { defineStore } from "pinia";
import { getSchoolAttendanceStats } from "../graphql/queries";
import { apolloClient } from "../../apollo-client";

export const useAttendanceStore = defineStore("attendanceStore", {
  state: () => ({
    stats: {
      labels: [],
      present: [],
      absent: [],
    },
    loading: false,
    error: null,
  }),

  actions: {
    async fetchSchoolAttendanceStats(startDate, endDate) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apolloClient.query({
          query: getSchoolAttendanceStats,
          variables: { startDate, endDate },
          fetchPolicy: "no-cache",
        });

        if (!res.data.getSchoolAttendanceStats) {
          this.stats = {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            present: [0, 0, 0, 0, 0],
            absent: [0, 0, 0, 0, 0],
          };
        } else {
          this.stats = res.data.getSchoolAttendanceStats;
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        this.error = error.message || "Error fetching attendance stats";
      } finally {
        this.loading = false;
      }
    },
  },
});
