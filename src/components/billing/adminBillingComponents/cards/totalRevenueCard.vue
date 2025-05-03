<template>
  <div>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-green-100 text-green-600">
          <i class="fas fa-money-bill-wave text-xl"></i>
        </div>
        <div class="ml-4">
          <h3 class="text-gray-500 text-sm">Total Revenue</h3>
          <p class="text-2xl font-bold">
            ${{ totalRevenue.amount.toLocaleString() }}
          </p>
        </div>
      </div>
      <div class="mt-4">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">This Term</span>
          <span class="text-sm text-green-600"
            >+{{ totalRevenue.growthPercentage }}%</span
          >
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            class="bg-green-600 h-2 rounded-full"
            :style="{ width: `${totalRevenue.growthPercentage}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useBillingDashboardStore } from "../../../../store/billingDashboardStore";

const billingDashboardStore = useBillingDashboardStore();
const totalRevenue = computed(() => billingDashboardStore.getTotalRevenue);
</script>
