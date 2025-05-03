<template>
  <div>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-blue-100 text-blue-600">
          <i class="fas fa-chart-pie text-xl"></i>
        </div>
        <div class="ml-4">
          <h3 class="text-gray-500 text-sm">Collection Rate</h3>
          <p class="text-2xl font-bold">{{ collectionRate.rate }}%</p>
        </div>
      </div>
      <div class="mt-4">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">Target: {{ collectionRate.targetRate }}%</span>
          <span
            class="text-sm"
            :class="
              collectionRate.rate >= collectionRate.targetRate ? 'text-green-600' : 'text-yellow-600'
            "
          >
            {{ collectionRate.rate >= collectionRate.targetRate ? "On Target" : "Below Target" }}
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            :class="collectionRate.rate >= collectionRate.targetRate ? 'bg-green-600' : 'bg-yellow-600'"
            class="h-2 rounded-full"
            :style="{ width: `${collectionRate.rate}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useBillingDashboardStore } from "../../../../store/billingDashboardStore";

const billingDashboardStore = useBillingDashboardStore();
const collectionRate = computed(() => billingDashboardStore.getCollectionRate);
</script>

