import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import { getAllAnnouncements } from "../graphql/queries";
import {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  markAnnouncementAsRead,
  archiveAnnouncement,
  restoreAnnouncement,
} from "../graphql/mutations";
import socket from "../socket/socket";

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
      this.error = null;
      try {
        const res = await apolloClient.query({
          query: getAllAnnouncements,
          variables: {
            params: {
              isArchived: false,
            },
          },
          fetchPolicy: "no-cache",
        });

        this.announcements = res.data.getAllAnnouncements;
        return this.announcements;
      } catch (error) {
        console.log("error:", error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchArchivedAnnouncements() {
      this.loading = true;
      try {
        const res = await apolloClient.query({
          query: getAllAnnouncements,
          variables: {
            params: {
              isArchived: true,
            },
          },
          fetchPolicy: "no-cache",
        });
        this.archivedAnnouncements = res.data.getAllAnnouncements;
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

    async archiveAnnouncement(announcementId) {
      try {
        const res = await apolloClient.mutate({
          mutation: archiveAnnouncement,
          variables: { announcementId },
        });
        const announcement = this.announcements.find(
          (a) => a.id === announcementId
        );
        if (announcement) {
          this.archivedAnnouncements.unshift({
            ...announcement,
            archivedAt: res.data.archiveAnnouncement.archivedAt,
          });
          this.announcements = this.announcements.filter(
            (a) => a.id !== announcementId
          );
        }
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async restoreAnnouncement(announcementId) {
      try {
        await apolloClient.mutate({
          mutation: restoreAnnouncement,
          variables: { announcementId },
        });
        const announcement = this.archivedAnnouncements.find(
          (a) => a.id === announcementId
        );
        if (announcement) {
          this.announcements.unshift(announcement);
          this.archivedAnnouncements = this.archivedAnnouncements.filter(
            (a) => a.id !== announcementId
          );
        }
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async fetchAnnouncementById(id) {
      this.loading = true;
      try {
        const res = await apolloClient.query({
          query: getAnnouncementById,
          variables: { id },
          fetchPolicy: "no-cache",
        });
        return res.data.getAnnouncementById;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Socket listeners
    initializeSocketListeners() {
      socket.on("newAnnouncement", (announcement) => {
        this.announcements.unshift(announcement);
      });

      socket.on("announcementUpdated", (updatedAnnouncement) => {
        const index = this.announcements.findIndex(
          (a) => a.id === updatedAnnouncement.id
        );
        if (index !== -1) {
          this.announcements[index] = updatedAnnouncement;
        }
      });

      socket.on("announcementArchived", (id) => {
        const announcement = this.announcements.find((a) => a.id === id);
        if (announcement) {
          this.archivedAnnouncements.unshift(announcement);
          this.announcements = this.announcements.filter((a) => a.id !== id);
        }
      });

      socket.on("announcementRestored", (id) => {
        const announcement = this.archivedAnnouncements.find(
          (a) => a.id === id
        );
        if (announcement) {
          this.announcements.unshift(announcement);
          this.archivedAnnouncements = this.archivedAnnouncements.filter(
            (a) => a.id !== id
          );
        }
      });
    },
  },
});
