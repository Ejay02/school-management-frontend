<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">
      Top Classes by Revenue
    </h3>
    <div class="space-y-4">
      <div v-for="(cls, index) in topClasses" :key="cls.id">
        <div class="flex justify-between items-center">
          <span class="font-medium">{{ cls.name }}</span>
          <span class="text-gray-700">${{ cls.revenue.toLocaleString() }}</span>
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
</template>

<script setup>
import { computed } from "vue";
import { useBillingDashboardStore } from "../../../../store/billingDashboardStore";

const billingDashboardStore = useBillingDashboardStore();
const topClasses = computed(() => billingDashboardStore.getTopClassesByRevenue);
</script>
