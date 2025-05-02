import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import { getAllPayments, getPaymentById } from "../graphql/queries";
import { useUserStore } from "./userStore";

export const usePaymentStore = defineStore("paymentStore", {
  state: () => ({
    allPayments: [], // Store all payments
    payments: [], // Store paginated payments
    selectedPayment: null,
    loading: false,
    error: null,
    hasMore: true,
    totalPages: 1,
    totalCount: 0,
  }),

  actions: {
    async fetchPayments({
      page = 1,
      limit = 10,
      search = "",
      sortBy = "",
      sortOrder = "",
    } = {}) {
      this.loading = true;
      this.error = null;

      try {
        // First fetch all payments if we haven't already
        if (this.allPayments.length === 0) {
          const { data } = await apolloClient.query({
            query: getAllPayments,
            variables: { params: { page: 1, limit: 1000 } },
            fetchPolicy: "network-only", // Force a network request instead of using cache
          });

          // Map the data to match the format expected by the component
          this.allPayments = data.getAllPayments.map(payment => ({
            id: payment.id,
            student: {
              id: payment.studentId,
              name: payment.studentName,
              surname: payment.studentSurname,
              photo: payment.studentImage,
            },
            class: {
              id: payment.classId,
              name: payment.className,
            },
            feeType: payment.feeType,
            amount: payment.Amount,
            date: payment.createdAt,
            status: payment.status,
            description: payment.description,
            invoiceId: payment.invoiceId,
            parentId: payment.parentId,
            paymentMethod: payment.paymentMethod,
          }));

          this.totalCount = this.allPayments.length;
          this.totalPages = Math.ceil(this.totalCount / limit);
        }

        // Handle pagination locally
        const start = (page - 1) * limit;
        const end = start + limit;
        this.payments = this.allPayments.slice(start, end);
        this.hasMore = end < this.totalCount;
      } catch (err) {
        this.error = err.message || "Error fetching payments";
      } finally {
        this.loading = false;
      }
    },

    async fetchPaymentById(paymentId) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await apolloClient.query({
          query: getPaymentById,
          variables: { paymentId },
          fetchPolicy: "network-only",
        });

        // Map the data to match the format expected by the component
        this.selectedPayment = {
          id: data.getPaymentById.id,
          student: {
            id: data.getPaymentById.studentId,
            name: data.getPaymentById.studentName,
            surname: data.getPaymentById.studentSurname,
            photo: data.getPaymentById.studentImage,
          },
          class: {
            id: data.getPaymentById.classId,
            name: data.getPaymentById.className,
          },
          feeType: data.getPaymentById.feeType,
          amount: data.getPaymentById.Amount,
          date: data.getPaymentById.createdAt,
          status: data.getPaymentById.status,
          description: data.getPaymentById.description,
          invoiceId: data.getPaymentById.invoiceId,
          parentId: data.getPaymentById.parentId,
          paymentMethod: data.getPaymentById.paymentMethod,
        };

        return this.selectedPayment;
      } catch (error) {
        this.error = error.message || "Error fetching payment details";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Reset payments to force a fresh fetch
    resetPayments() {
      this.allPayments = [];
      this.payments = [];
    },

    // Refresh payments by forcing a new fetch
    async refreshPayments(page = 1, limit = 10) {
      this.resetPayments();
      await this.fetchPayments({ page, limit });
    },
  },
});