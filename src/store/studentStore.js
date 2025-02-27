import { defineStore } from "pinia";
import { useApolloClient } from "@vue/apollo-composable";
import { getAllStudents, getStudentGenderStats } from "@/graphql/queries";
import { getStudentById } from "../graphql/queries";

export const useStudentStore = defineStore("studentStore", {
  state: () => ({
    students: [],
    selectedStudent: null,

    hasMore: true,
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
        const client = useApolloClient().client;
        const paginationParams = { page, limit };
        if (search) paginationParams.search = search;
        if (sortBy) paginationParams.sortBy = sortBy;
        if (sortOrder) paginationParams.sortOrder = sortOrder;

        const { data } = await client.query({
          query: getAllStudents,
          variables: { pagination: paginationParams },
        });

        const fetchedStudents = data.getAllStudents.map((student) => ({
          ...student,
          studentId: student.id,
          photo: student.img,
          parent: student.parent
            ? `${student.parent.name} ${student.parent.surname}`
            : "",
          className: student.class ? student.class.name : "",
          // class: student.class ? student.class.name : "",
        }));

        this.students = fetchedStudents;
        this.hasMore = fetchedStudents?.length === limit;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    async fetchGenderStats({ classId = null } = {}) {
      this.loading = true;
      try {
        const client = useApolloClient().client;
        const { data } = await client.query({
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
        const client = useApolloClient().client;
        const { data } = await client.query({
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
