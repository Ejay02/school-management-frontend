import { getAllStudents, getStudentGenderStats } from "@/graphql/queries";
import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import { getStudentById } from "../graphql/queries";

export const useStudentStore = defineStore("studentStore", {
  state: () => ({
    allStudents: [], // Store all students
    students: [], // Store paginated students
    selectedStudent: null,
    hasMore: true,
    totalPages: 1,
    totalCount: 0,
    genderStats: {
      totalStudents: 0,
      maleCount: 0,
      femaleCount: 0,
      malePercentage: 0,
      femalePercentage: 0,
      totalCapacity: 0,
    },
    loading: false,
    error: null,
  }),

  actions: {
    async fetchStudents({
      page = 1,
      limit = 10,
      search = "",
      sortBy = "",
      sortOrder = "",
    } = {}) {
      this.loading = true;
      try {
        // First fetch all students if we haven't already
        if (this.allStudents.length === 0) {
          const { data } = await apolloClient.query({
            query: getAllStudents,
            variables: { pagination: { page: 1, limit: 1000 } },
          });

          this.allStudents = data.getAllStudents.map((student) => ({
            ...student,
            studentId: student.id,
            photo: student.image,
            parent: student.parent
              ? `${student.parent.name} ${student.parent.surname}`
              : "",
            className: student.class ? student.class.name : "",
          }));
          
          this.totalCount = this.allStudents.length;
          this.totalPages = Math.ceil(this.totalCount / limit);
        }

        // Handle pagination locally
        const start = (page - 1) * limit;
        const end = start + limit;
        this.students = this.allStudents.slice(start, end);
        this.hasMore = end < this.totalCount;

      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    async fetchGenderStats({ classId = null } = {}) {
      this.loading = true;
      try {
        const { data } = await apolloClient.query({
          query: getStudentGenderStats,
          variables: { classId },
        });
        this.genderStats = data.getStudentsByGender;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    async fetchStudentById(studentId) {
      this.loading = true;
      try {
        const { data } = await apolloClient.query({
          query: getStudentById,
          variables: { studentId },
        });

        this.selectedStudent = data.getStudentById;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
