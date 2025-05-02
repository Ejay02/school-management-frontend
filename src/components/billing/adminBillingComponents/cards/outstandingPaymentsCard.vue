<template>
  <div>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="p-4 rounded-full bg-red-100 text-red-600">
          <i class="fas fa-exclamation-circle text-xl"></i>
        </div>
        <div class="ml-4">
          <h3 class="text-gray-500 text-sm">Outstanding Payments</h3>
          <p class="text-2xl font-bold">${{ outstandingPayments }}</p>
        </div>
      </div>
      <div class="mt-4">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500"
            >{{ overdueCount }} students with overdue fees</span
          >
          <span class="text-sm text-red-600">{{ overduePercentage }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            class="bg-red-600 h-2 rounded-full"
            :style="{ width: `${overduePercentage}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';



const outstandingPayments = ref(300000);
const overdueCount = ref(5);
const overduePercentage = ref(10);
</script>
