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
      classCount: 0,
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
            classCount: 0,
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
    //
    async fetchAttendance() {
      this.loading = true;
      this.error = null;
      try {
        const res = await apolloClient.query({
          query: getAttendances,
          fetchPolicy: "no-cache",
        });

        this.attendanceRecords = res.data.getAttendances;

        // return res.data.getAttendances;
      } catch (error) {
        this.error = error.message || "Error fetching attendance stats";
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

        // Optionally, update  local state with the new record.
        // push the new record into attendanceRecords:
        // this.attendanceRecords.push(res.data.markAttendance);
        await this.fetchAttendance();

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
