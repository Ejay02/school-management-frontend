import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import { createFeeStructure, updateFeeStructure } from "../graphql/mutations";
import { getAllFeeStructures, getFeeStructureById } from "../graphql/queries";
import { useNotificationStore } from "./notification";

export const useFeeStructureStore = defineStore("feeStructureStore", {
  state: () => ({
    allFeeStructures: [], // Store all fee structures
    feeStructures: [], // Store paginated fee structures
    selectedFeeStructure: null,
    loading: false,
    error: null,
    hasMore: true,
    totalPages: 1,
    totalCount: 0,
  }),

  actions: {
    // Reset fee structures to force a fresh fetch
    resetFeeStructures() {
      this.allFeeStructures = [];
      this.feeStructures = [];
    },

    // Refresh fee structures by forcing a new fetch
    async refreshFeeStructures(page = 1, limit = 10) {
      this.resetFeeStructures();
      await this.fetchFeeStructures({ page, limit });
    },

    async fetchFeeStructures({
      page = 1,
      limit = 10,
      search = "",
      sortBy = "",
      sortOrder = "",
    } = {}) {
      this.loading = true;

      try {
        // First fetch all fee structures if we haven't already
        if (this.allFeeStructures.length === 0) {
          const { data } = await apolloClient.query({
            query: getAllFeeStructures,
            variables: { params: { page: 1, limit: 1000 } },
            fetchPolicy: "network-only", // Force a network request instead of using cache
          });

          this.allFeeStructures = data.getAllFeeStructures;
          this.totalCount = this.allFeeStructures.length;
          this.totalPages = Math.ceil(this.totalCount / limit);
        }

        // Handle pagination locally
        const start = (page - 1) * limit;
        const end = start + limit;
        this.feeStructures = this.allFeeStructures.slice(start, end);
        this.hasMore = end < this.totalCount;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    async fetchFeeStructureById(id) {
      this.loading = true;
      this.error = null;

      try {
        const res = await apolloClient.query({
          query: getFeeStructureById,
          variables: { feeStructureId: id },
          fetchPolicy: "network-only",
        });

        this.selectedFeeStructure = res?.data?.getFeeStructureById;
        return res?.data?.getFeeStructureById;
      } catch (error) {
        this.error = error.message || "Error fetching fee structure";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createNewFeeStructure(feeStructureData) {
      const notificationStore = useNotificationStore();
      this.loading = true;
      this.error = null;

      try {
        const { data } = await apolloClient.mutate({
          mutation: createFeeStructure,
          variables: { input: feeStructureData },
        });

        if (data?.createFeeStructure) {
          // Add the new fee structure to the store
          this.addFeeStructure(data.createFeeStructure);

          notificationStore.addNotification({
            type: "success",
            message: "Fee structure created successfully!",
          });

          return data.createFeeStructure;
        }
      } catch (error) {
        this.error = error.message || "Error creating fee structure";
        notificationStore.addNotification({
          type: "error",
          message: "Error creating fee structure",
          error,
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update an existing fee structure
    async updateExistingFeeStructure(id, feeStructureData) {
      const notificationStore = useNotificationStore();
      this.loading = true;
      this.error = null;

      try {
        const { data } = await apolloClient.mutate({
          mutation: updateFeeStructure,
          variables: {
            id: id,
            input: feeStructureData,
          },
        });

        if (data?.editFeeStructure) {
          // Update the fee structure in the store
          this.updateFeeStructure(data.editFeeStructure);

          notificationStore.addNotification({
            type: "success",
            message: "Fee structure updated successfully!",
          });

          return data.editFeeStructure;
        }
      } catch (error) {
        this.error = error.message || "Error updating fee structure";
        notificationStore.addNotification({
          type: "error",
          message: "Error updating fee structure",
          error,
        });
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete a fee structure
    // async deleteFeeStructureById(id) {
    //   const notificationStore = useNotificationStore();
    //   this.loading = true;
    //   this.error = null;

    //   try {
    //     const { data } = await apolloClient.mutate({
    //       mutation: deleteFeeStructure,
    //       variables: { id },
    //     });

    //     if (data?.deleteFeeStructure) {
    //       // Remove the fee structure from the store
    //       this.removeFeeStructure(id);

    //       notificationStore.addNotification({
    //         type: "success",
    //         message: "Fee structure deleted successfully!",
    //       });

    //       return true;
    //     }
    //   } catch (error) {
    //     this.error = error.message || "Error deleting fee structure";
    //     notificationStore.addNotification({
    //       type: "error",
    //       message: "Error deleting fee structure",
    //       error,
    //     });
    //     throw error;
    //   } finally {
    //     this.loading = false;
    //   }
    // },

    // This approach is a common pattern in state management to ensure UI consistency and optimize performance by reducing API calls.
    // Add a new fee structure to the store after creation
    addFeeStructure(newFeeStructure) {
      this.allFeeStructures.unshift(newFeeStructure);
      this.feeStructures.unshift(newFeeStructure);
    },

    // Update a fee structure in the store
    updateFeeStructure(updatedFeeStructure) {
      const index = this.allFeeStructures.findIndex(
        (f) => f.id === updatedFeeStructure.id
      );
      if (index !== -1) {
        this.allFeeStructures[index] = updatedFeeStructure;
      }

      const pageIndex = this.feeStructures.findIndex(
        (f) => f.id === updatedFeeStructure.id
      );
      if (pageIndex !== -1) {
        this.feeStructures[pageIndex] = updatedFeeStructure;
      }
    },

    // Remove a fee structure from the store
    removeFeeStructure(id) {
      this.allFeeStructures = this.allFeeStructures.filter((f) => f.id !== id);
      this.feeStructures = this.feeStructures.filter((f) => f.id !== id);
    },
  },
});
