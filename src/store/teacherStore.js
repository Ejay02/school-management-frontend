
import { defineStore } from "pinia";
import { useApolloClient } from "@vue/apollo-composable";
import { getAllTeachers, getTeacherById } from "@/graphql/queries";

export const useTeacherStore = defineStore("teacherStore", {
  state: () => ({
    teachers: [],
    loading: false,
    error: null,
    hasMore: true, // indicates if there might be a next page
    selectedTeacher: null,
  }),
  actions: {
    async fetchTeachers({
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
          query: getAllTeachers,
          variables: { pagination: paginationParams },
        });

        const fetchedTeachers = data.getAllTeachers.map((teacher) => ({
          ...teacher,
          teacherId: teacher.id,
          photo: teacher.img,
          subjects: teacher.subjects.map((subject) => subject.name),
          classes: teacher.classes || [],
        }));
        this.teachers = fetchedTeachers;
        this.hasMore = fetchedTeachers.length === limit;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTeacherById(teacherId) {
      this.loading = true;
      try {
        const client = useApolloClient().client;
        const { data } = await client.query({
          query: getTeacherById,
          variables: { teacherId },
        });

        this.selectedTeacher = data.getTeacherById;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
});
