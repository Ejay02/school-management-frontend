<template>
  <div>
    <!-- top cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Total Revenue Card -->
      <TotalRevenueCard />

      <!-- Outstanding Payments Card -->
      <OutstandingPaymentsCard />

      <!-- Collection Rate Card -->
      <CollectionRateCard />
    </div>

    <!-- Revenue Chart -->
    <RevenueChart />

    <!-- Payment Status Distribution -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PaymentStatusDistribution />

      <!-- Top Classes by Revenue -->
      <TopClassesByRevenue />
    </div>
  </div>
</template>

<script setup>
import CollectionRateCard from "./cards/collectionRateCard.vue";
import OutstandingPaymentsCard from "./cards/outstandingPaymentsCard.vue";
import PaymentStatusDistribution from "./cards/paymentStatusDistribution.vue";
import RevenueChart from "./cards/revenueChart.vue";
import TopClassesByRevenue from "./cards/topClassesByRevenue.vue";
import TotalRevenueCard from "./cards/totalRevenueCard.vue";
</script>
