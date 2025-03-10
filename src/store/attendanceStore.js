import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import { markAttendance } from "../graphql/mutations";
import { getAttendances, getSchoolAttendanceStats } from "../graphql/queries";

export const useAttendanceStore = defineStore("attendanceStore", {
  state: () => ({
    stats: {
      labels: [],
      present: [],
      absent: [],
      studentCount: 0,
    },
    attendanceRecords: [],
    loading: false,
    error: null,
    hasMore: true,
  }),

  actions: {
    async fetchSchoolAttendanceStats(startDate, endDate) {
      this.loading = true;
      this.error = null;
      try {
        // Convert string dates to Date objects if they aren't already
        const start =
          startDate instanceof Date ? startDate : new Date(startDate);
        const end = endDate instanceof Date ? endDate : new Date(endDate);

        // Make sure end date includes the full day by setting time to 23:59:59
        end.setHours(23, 59, 59);

        const res = await apolloClient.query({
          query: getSchoolAttendanceStats,
          variables: { startDate: start, endDate: end },
          fetchPolicy: "no-cache",
        });

        if (!res.data.getSchoolAttendanceStats) {
          this.stats = {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            present: [0, 0, 0, 0, 0],
            absent: [0, 0, 0, 0, 0],
            studentCount: 0,
          };
        } else {
          this.stats = res.data.getSchoolAttendanceStats;
        }
      } catch (error) {
        this.error = error.message || "Error fetching attendance stats";
      } finally {
        this.loading = false;
      }
    },

    async fetchAttendance() {
      this.loading = true;
      this.error = null;
      try {
        const res = await apolloClient.query({
          query: getAttendances,
          fetchPolicy: "no-cache",
        });

        this.attendanceRecords = res.data.getAttendances;
      } catch (error) {
        this.error = error.message || "Error fetching attendance stats";
      } finally {
        this.loading = false;
      }
    },

    async fetchAttendanceData(start, end) {
      this.loading = true;
      this.error = null;

      try {
        // Fetch weekly stats for chart
        await this.fetchSchoolAttendanceStats(start, end);
      } catch (err) {
        this.error =
          err.message || "Failed to fetch attendance data. Please try again.";
      } finally {
        this.loading = false;
      }
    },

    async markAttendance(lessonId, attendanceData) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apolloClient.mutate({
          mutation: markAttendance,
          variables: {
            lessonId,
            attendanceData: [attendanceData],
          },
        });

        // Refresh data after marking attendance
        await this.fetchAttendance();

        // Also refresh the attendance stats to update the charts
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        await this.fetchSchoolAttendanceStats(thirtyDaysAgo, today);

        return res.data.markAttendance;
      } catch (error) {
        this.error = error.message || "Error marking attendance";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
