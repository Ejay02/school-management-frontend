import { defineStore } from "pinia";
import { useApolloClient } from "@vue/apollo-composable";
import { getAllStudents, getStudentGenderStats } from "@/graphql/queries";

export const useStudentStore = defineStore("studentStore", {
  state: () => ({
    students: [],
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
    async fetchStudents(pagination = {}) {
      this.loading = true;
      try {
        const client = useApolloClient().client;
        const { data } = await client.query({
          query: getAllStudents,
          variables: { pagination },
        });
        this.students = data.getAllStudents;
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
  },
});
