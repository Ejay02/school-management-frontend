import { defineStore } from "pinia";

import { apolloClient } from "../../apollo-client";
import {
  getClassResults,
  getResultStatistics,
  getStudentResults,
  getGradebookQuery,
} from "../graphql/queries";
import { upsertGradeMutation } from "../graphql/mutations";

export const useResultStore = defineStore("resultStore", {
  state: () => ({
    results: [],
    studentResults: [],
    gradebookData: null,
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

    async fetchGradebook(classId, subjectId) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apolloClient.query({
          query: getGradebookQuery,
          variables: { classId, subjectId },
          fetchPolicy: "network-only",
        });
        this.gradebookData = res.data?.getGradebook || { students: [], columns: [], cells: [] };
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    async saveGrade({ studentId, score, columnId, type }) {
      this.loading = true;
      this.error = null;
      const isExam = type === "EXAM";
      try {
        const res = await apolloClient.mutate({
          mutation: upsertGradeMutation,
          variables: {
            studentId,
            score: parseInt(score),
            examId: isExam ? columnId : null,
            assignmentId: !isExam ? columnId : null,
          },
        });

        const updated = res.data?.upsertGrade;
        if (updated && this.gradebookData) {
          const cellIndex = this.gradebookData.cells.findIndex(
            (c) => c.studentId === studentId && c.columnId === columnId
          );
          if (cellIndex !== -1) {
            this.gradebookData.cells[cellIndex].score = updated.score;
            this.gradebookData.cells[cellIndex].resultId = updated.id;
          } else {
            this.gradebookData.cells.push({
              studentId,
              columnId,
              resultId: updated.id,
              score: updated.score,
            });
          }
        }
        return updated;
      } catch (err) {
        this.error = err;
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
