import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import { getAllAnnouncements, getAnnouncementById } from "../graphql/queries";
import {
  createAnnouncement,
  markAnnouncementAsRead,
  archiveAnnouncement,
  editAnnouncement,
  unarchiveAnnouncement,
  globalAnnouncementDelete,
  personalAnnouncementDelete,
} from "../graphql/mutations";

import { useUserStore } from "./userStore";
import { getData, setData } from "../utils/localStorageHelpers";

const READ_ANNOUNCEMENTS_KEY = "readAnnouncements";

export const useAnnouncementStore = defineStore("announcement", {
  state: () => ({
    announcements: [],
    selectedAnnouncement: null,
    archivedAnnouncements: [],
    loading: false,
    error: null,
    creators: {},
    unreadCount: 0,
    readAnnouncements: getData(READ_ANNOUNCEMENTS_KEY) || [],
  }),
  getters: {
    getUnreadCount: (state) => {
      return state.announcements.filter(
        (announcement) => !state.readAnnouncements.includes(announcement.id)
      ).length;
    },
  },
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
              page: 1,
              limit: 50,
              sortBy: "createdAt",
              sortOrder: "DESC",
            },
          },
          fetchPolicy: "network-only",
        });

        this.announcements = res.data.getAllAnnouncements;
        this.updateUnreadCount();
        return this.announcements;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    updateUnreadCount() {
      this.unreadCount = this.announcements.filter(
        (announcement) => !this.readAnnouncements.includes(announcement.id)
      ).length;
    },

    async fetchAnnouncementById(announcementId) {
      this.loading = true;
      this.error = null;

      try {
        const res = await apolloClient.query({
          query: getAnnouncementById,
          variables: { announcementId },
          fetchPolicy: "no-cache",
        });

        this.selectedAnnouncement = res?.data?.getAnnouncementById;
        return res?.data?.getAnnouncementById;
      } catch (error) {
        this.error = error.message || "Error fetching event";
        throw error;
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
              page: 1,
              limit: 50,
              sortBy: "createdAt",
              sortOrder: "DESC",
            },
          },
          fetchPolicy: "network-only",
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

    async updateAnnouncement(announcementId, title, content, targetRoles) {
      try {
        const res = await apolloClient.mutate({
          mutation: editAnnouncement,
          variables: {
            announcementId,
            title,
            content,
            targetRoles,
          },
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

    async globalAnnouncementDelete(announcementId) {
      try {
        await apolloClient.mutate({
          mutation: globalAnnouncementDelete,
          variables: { announcementId },
        });
        this.announcements = this.announcements.filter(
          (a) => a.id !== announcementId
        );
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async personalAnnouncementDelete(announcementId) {
      try {
        await apolloClient.mutate({
          mutation: personalAnnouncementDelete,
          variables: { announcementId },
        });
        this.announcements = this.announcements.filter(
          (a) => a.id !== announcementId
        );
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    },

    async markAsRead(announcementId) {
      if (!this.isAnnouncementRead(announcementId)) {
        try {
          const res = await apolloClient.mutate({
            mutation: markAnnouncementAsRead,
            variables: { announcementId },
          });
          if (res.data.markAnnouncementAsRead) {
            this.readAnnouncements.push(announcementId);
            setData(READ_ANNOUNCEMENTS_KEY, this.readAnnouncements);
            this.updateUnreadCount();
            return true;
          }
          return false;
        } catch (error) {
          this.error = error.message;
          throw error;
        }
      }
      return true;
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
          mutation: unarchiveAnnouncement,
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

    async fetchCreatorDetails(apolloClient) {
      const userStore = useUserStore();
      try {
        const uniqueCreatorIds = [
          ...new Set(
            this.announcements
              .filter((a) => a.creatorId)
              .map((a) => a.creatorId)
          ),
        ];

        for (const creatorId of uniqueCreatorIds) {
          if (!this.creators[creatorId]) {
            const userData = await userStore.findUserById(
              creatorId,
              apolloClient
            );
            if (userData) {
              this.creators[creatorId] = userData;
            } else {
              this.creators[creatorId] = { username: "Unknown" };
            }
          }
        }
      } catch (error) {
        console.error("Error fetching creator details:", error);
      }
    },

    getCreatorName(creatorId) {
      if (!creatorId) return "Unknown";
      const creator = this.creators[creatorId];
      if (!creator) return "Unknown";

      return creator.name
        ? `${creator.name} ${creator.surname || ""}`.trim()
        : creator.username || creator.email || "Unknown";
    },

    isAnnouncementRead(announcementId) {
      return this.readAnnouncements.includes(announcementId);
    },

  async refetchAll() {
      try {
          await Promise.all([
              this.fetchAnnouncements(),
              this.fetchArchivedAnnouncements()
          ]);
          await this.fetchCreatorDetails(apolloClient);
      } catch (error) {
          this.error = error.message;
          throw error;
      }
  },

  },
});
