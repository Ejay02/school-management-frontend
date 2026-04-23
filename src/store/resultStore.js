import { defineStore } from "pinia";

import { apolloClient } from "../../apollo-client";
import {
  getClassResults,
  getResultStatistics,
  getStudentResults,
} from "../graphql/queries";

export const useResultStore = defineStore("resultStore", {
  state: () => ({
    results: [],
    studentResults: [],
    activeStudentId: null,
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

    async fetchClassResults(
      classId,
      academicPeriod,
      params = { page: 1, limit: 10 }
    ) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apolloClient.query({
          query: getClassResults,
          variables: { classId, academicPeriod, params },
          fetchPolicy: "network-only",
        });

        if (res.data.getClassResults) {
          this.classResults = res.data.getClassResults;
        } else {
          this.classResults = {
            data: [],
            meta: { total: 0, page: 1, lastPage: 1, limit: 10 },
          };
        }
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    async fetchStudentResults(studentId) {
      this.loading = true;
      this.error = null;
      this.activeStudentId = studentId || null;

      try {
        if (!studentId) {
          this.studentResults = [];
          return;
        }

        const res = await apolloClient.query({
          query: getStudentResults,
          variables: { studentId },
          fetchPolicy: "network-only",
        });

        this.studentResults = Array.isArray(res?.data?.getStudentResults)
          ? res.data.getStudentResults
          : [];
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
