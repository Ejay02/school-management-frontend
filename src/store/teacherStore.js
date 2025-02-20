import { defineStore } from "pinia";
import { useApolloClient } from "@vue/apollo-composable";
import { getAllTeachers } from "@/graphql/queries";

export const useTeacherStore = defineStore("teacherStore", {
  state: () => ({
    teachers: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchTeachers(pagination = {}) {
      this.loading = true;
      try {
        const client = useApolloClient().client;
        const { data } = await client.query({
          query: getAllTeachers,
          variables: { pagination },
        });
        this.teachers = data.getAllTeachers;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
