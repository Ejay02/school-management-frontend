import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import {
  getAllAnnouncements,
  // getArchivedAnnouncements,
} from "../graphql/queries";
import {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  markAnnouncementAsRead,
  archiveAnnouncement,
  restoreAnnouncement,
} from "../graphql/mutations";

export const useAnnouncementStore = defineStore("announcement", {
  state: () => ({
    announcements: [],
    archivedAnnouncements: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAnnouncements() {
      this.loading = true;
      try {
        const res = await apolloClient.query({
          query: getAllAnnouncements,
          fetchPolicy: "no-cache",
        });
        console.log("res:", res);
        this.announcements = res.data.getAllAnnouncements;
        return this.announcements;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchArchivedAnnouncements() {
      this.loading = true;
      try {
        console.log("archived!");
        // const res = await apolloClient.query({
        //   query: getArchivedAnnouncements,
        //   fetchPolicy: "no-cache",
        // });
        // this.archivedAnnouncements = res.data.archivedAnnouncements;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createAnnouncement(input) {
      try {
        const res = await apolloClient.mutate({
          mutation: createAnnouncement,
          variables: { input },
        });
        this.announcements.unshift(res.data.createAnnouncement);
        return res.data.createAnnouncement;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async updateAnnouncement(id, input) {
      try {
        const res = await apolloClient.mutate({
          mutation: updateAnnouncement,
          variables: { id, input },
        });
        const index = this.announcements.findIndex((a) => a.id === id);
        if (index !== -1) {
          this.announcements[index] = {
            ...this.announcements[index],
            ...res.data.updateAnnouncement,
          };
        }
        return res.data.updateAnnouncement;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async deleteAnnouncement(id) {
      try {
        await apolloClient.mutate({
          mutation: deleteAnnouncement,
          variables: { id },
        });
        this.announcements = this.announcements.filter((a) => a.id !== id);
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async markAsRead(id) {
      try {
        const res = await apolloClient.mutate({
          mutation: markAnnouncementAsRead,
          variables: { id },
        });
        const index = this.announcements.findIndex((a) => a.id === id);
        if (index !== -1) {
          this.announcements[index].isRead = true;
        }
        return res.data.markAnnouncementAsRead;
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async archiveAnnouncement(id) {
      try {
        const res = await apolloClient.mutate({
          mutation: archiveAnnouncement,
          variables: { id },
        });
        const announcement = this.announcements.find((a) => a.id === id);
        if (announcement) {
          this.archivedAnnouncements.unshift({
            ...announcement,
            archivedAt: res.data.archiveAnnouncement.archivedAt,
          });
          this.announcements = this.announcements.filter((a) => a.id !== id);
        }
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async restoreAnnouncement(id) {
      try {
        await apolloClient.mutate({
          mutation: restoreAnnouncement,
          variables: { id },
        });
        const announcement = this.archivedAnnouncements.find(
          (a) => a.id === id
        );
        if (announcement) {
          this.announcements.unshift(announcement);
          this.archivedAnnouncements = this.archivedAnnouncements.filter(
            (a) => a.id !== id
          );
        }
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },
  },
});
