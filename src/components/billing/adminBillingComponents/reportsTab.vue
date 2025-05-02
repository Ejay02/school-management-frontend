<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Total Revenue Card -->
      <TotalRevenueCard />

      <!-- Outstanding Payments Card -->
      <OutstandingPaymentsCard />

      <!-- Collection Rate Card -->
      <CollectionRateCard />
    </div>

    <!-- Revenue Chart -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
      <div class="h-64">
        <!-- Chart will be rendered here -->
        <div class="flex items-center justify-center h-full text-gray-500">
          <p>Revenue chart will be displayed here</p>
        </div>
      </div>
    </div>

    <!-- Payment Status Distribution -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Payment Status Distribution
        </h3>
        <div class="h-64">
          <!-- Chart will be rendered here -->
          <div class="flex items-center justify-center h-full text-gray-500">
            <p>Payment status chart will be displayed here</p>
          </div>
        </div>
      </div>

      <!-- Top Classes by Revenue -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Top Classes by Revenue
        </h3>
        <div class="space-y-4">
          <div v-for="(cls, index) in topClasses" :key="cls.id">
            <div class="flex justify-between items-center">
              <span class="font-medium">{{ cls.name }}</span>
              <span class="text-gray-700">${{ cls.revenue }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                class="bg-eduPurple h-2 rounded-full"
                :style="{
                  width: `${(cls.revenue / topClasses[0].revenue) * 100}%`,
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CollectionRateCard from "./cards/collectionRateCard.vue";
import OutstandingPaymentsCard from "./cards/outstandingPaymentsCard.vue";
import TotalRevenueCard from "./cards/totalRevenueCard.vue";

const topClasses = ref([
  { id: "1", name: "Primary 6", revenue: 750000 },
  { id: "2", name: "JSS 1", revenue: 600000 },
  { id: "3", name: "JSS 2", revenue: 450000 },
  { id: "4", name: "JSS 3", revenue: 350000 },
]);
</script>
