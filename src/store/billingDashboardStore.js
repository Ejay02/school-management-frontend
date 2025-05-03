import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import { getBillingReportDashboard } from "../graphql/queries";

export const useBillingDashboardStore = defineStore("billingDashboardStore", {
  state: () => ({
    dashboardData: {
      totalRevenue: {
        amount: 0,
        growthPercentage: 0,
      },
      outstandingPayments: {
        amount: 0,
        overdueCount: 0,
        overduePercentage: 0,
      },
      collectionRate: {
        rate: 0,
        targetRate: 95,
      },
      revenueTrend: {
        months: [],
        data: [],
      },
      paymentStatusDistribution: {
        labels: [],
        data: [],
      },
      topClassesByRevenue: [],
    },
    loading: false,
    error: null,
  }),

  actions: {
    async fetchDashboardData() {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await apolloClient.query({
          query: getBillingReportDashboard,
          fetchPolicy: "network-only", // Force a network request instead of using cache
        });

        if (data?.getBillingReportDashboard) {
          this.dashboardData = data.getBillingReportDashboard;
        }

        return this.dashboardData;
      } catch (error) {
        this.error = error.message || "Error fetching billing dashboard data";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async refreshDashboardData() {
      return this.fetchDashboardData();
    },
  },

  getters: {
    getTotalRevenue: (state) => state.dashboardData.totalRevenue,
    getOutstandingPayments: (state) => state.dashboardData.outstandingPayments,
    getCollectionRate: (state) => state.dashboardData.collectionRate,
    getRevenueTrend: (state) => state.dashboardData.revenueTrend,
    getPaymentStatusDistribution: (state) =>
      state.dashboardData.paymentStatusDistribution,
    getTopClassesByRevenue: (state) => state.dashboardData.topClassesByRevenue,
  },
});
