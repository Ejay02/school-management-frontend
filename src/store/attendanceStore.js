import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import { markAttendance } from "../graphql/mutations";
import { getAttendances, getSchoolAttendanceStats } from "../graphql/queries";

const attendanceListRequests = new Map();
const schoolStatsRequests = new Map();

export const useAttendanceStore = defineStore("attendanceStore", {
  state: () => ({
    stats: {
      labels: [],
      present: [],
      absent: [],
      studentCount: 0,
    },
    allAttendanceRecords: [], // Store all attendance records
    attendanceRecords: [], // Store paginated records
    activeStudentId: null,
    loading: false,
    listLoading: false,
    error: null,
    hasMore: true,
    totalPages: 1,
    totalCount: 0,
  }),

  actions: {
    calculateAttendanceStats(startDate, endDate) {
      const labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
      const present = [0, 0, 0, 0, 0];
      const absent = [0, 0, 0, 0, 0];

      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (end) {
        end.setHours(23, 59, 59, 999);
      }

      const filteredRecords = this.allAttendanceRecords.filter((record) => {
        const recordDate = new Date(record.date);

        if (start && recordDate < start) return false;
        if (end && recordDate > end) return false;

        const dayIndex = recordDate.getDay();
        return dayIndex >= 1 && dayIndex <= 5;
      });

      filteredRecords.forEach((record) => {
        const dayIndex = new Date(record.date).getDay() - 1;
        if (dayIndex < 0 || dayIndex > 4) return;

        if (record.present) {
          present[dayIndex] += 1;
        } else {
          absent[dayIndex] += 1;
        }
      });

      this.stats = {
        labels,
        present,
        absent,
        studentCount: filteredRecords.length,
      };
    },

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

        const requestKey = `${start.toISOString().slice(0, 10)}|${end
          .toISOString()
          .slice(0, 10)}`;

        let requestPromise = schoolStatsRequests.get(requestKey);
        if (!requestPromise) {
          requestPromise = apolloClient
            .query({
              query: getSchoolAttendanceStats,
              variables: { startDate: start, endDate: end },
              fetchPolicy: "no-cache",
            })
            .finally(() => {
              schoolStatsRequests.delete(requestKey);
            });

          schoolStatsRequests.set(requestKey, requestPromise);
        }

        const res = await requestPromise;

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

    async fetchAttendance({
      page = 1,
      limit = 10,
      search = "",
      sortBy = "",
      sortOrder = "",
      studentId = null,
    } = {}) {
      this.error = null;
      const shouldShowLoader = this.allAttendanceRecords.length === 0;
      if (shouldShowLoader) {
        this.listLoading = true;
      }

      const normalizedStudentId = studentId || this.activeStudentId || null;
      if (this.activeStudentId !== normalizedStudentId) {
        this.allAttendanceRecords = [];
        this.attendanceRecords = [];
        this.totalCount = 0;
        this.totalPages = 1;
        this.hasMore = true;
        this.activeStudentId = normalizedStudentId;
      }

      try {
        // First fetch all attendance records if we haven't already
        if (this.allAttendanceRecords.length === 0) {
          const requestKey = this.activeStudentId || "__school__";

          let requestPromise = attendanceListRequests.get(requestKey);
          if (!requestPromise) {
            requestPromise = apolloClient
              .query({
                query: getAttendances,
                variables: {
                  studentId: this.activeStudentId,
                },
                fetchPolicy: "no-cache",
              })
              .finally(() => {
                attendanceListRequests.delete(requestKey);
              });

            attendanceListRequests.set(requestKey, requestPromise);
          }

          const res = await requestPromise;

          this.allAttendanceRecords = res.data.getAttendances;
        }

        // Apply search filter to all records
        let filteredRecords = [...this.allAttendanceRecords];
        if (search) {
          const searchLower = search.toLowerCase();
          filteredRecords = filteredRecords.filter(
            (record) =>
              record?.student?.name?.toLowerCase().includes(searchLower) ||
              record?.student?.surname?.toLowerCase().includes(searchLower) ||
              record?.class?.name?.toLowerCase().includes(searchLower) ||
              record?.lesson?.name?.toLowerCase().includes(searchLower),
          );
        }

        // Update total count based on filtered records
        this.totalCount = filteredRecords.length;
        this.totalPages = Math.ceil(this.totalCount / limit);

        // Handle pagination
        const start = (page - 1) * limit;
        const end = start + limit;
        this.attendanceRecords = filteredRecords.slice(start, end);
        this.hasMore = end < this.totalCount;
      } catch (error) {
        this.error = error.message || "Error fetching attendance stats";
      } finally {
        if (shouldShowLoader) {
          this.listLoading = false;
        }
      }
    },

    async fetchAttendanceData(start, end) {
      this.loading = true;
      this.error = null;

      try {
        if (this.activeStudentId) {
          this.calculateAttendanceStats(start, end);
          return;
        }

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
