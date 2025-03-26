import { getAllTeachers, getTeacherById } from "@/graphql/queries";
import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";

export const useTeacherStore = defineStore("teacherStore", {
  state: () => ({
    allTeachers: [], // Store all teachers
    teachers: [], // Store paginated teachers
    loading: false,
    error: null,
    hasMore: true,
    selectedTeacher: null,
    totalPages: 1,
    totalCount: 0,
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
        // First fetch all teachers if we haven't already
        if (this.allTeachers.length === 0) {
          const { data } = await apolloClient.query({
            query: getAllTeachers,
            variables: { pagination: { page: 1, limit: 1000 } },
          });

          this.allTeachers = data.getAllTeachers.map((teacher) => ({
            ...teacher,
            teacherId: teacher.id,
            photo: teacher.img,
            subjects: teacher.subjects.map((subject) => subject.name),
            classes: teacher.classes || [],
          }));
          
          this.totalCount = this.allTeachers.length;
          this.totalPages = Math.ceil(this.totalCount / limit);
        }

        // Handle pagination locally
        const start = (page - 1) * limit;
        const end = start + limit;
        this.teachers = this.allTeachers.slice(start, end);
        this.hasMore = end < this.totalCount;

      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTeacherById(teacherId) {
      this.loading = true;
      try {
        const { data } = await apolloClient.query({
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
