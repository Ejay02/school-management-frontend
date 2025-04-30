<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Total Revenue Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600">
            <i class="fas fa-money-bill-wave text-xl"></i>
          </div>
          <div class="ml-4">
            <h3 class="text-gray-500 text-sm">Total Revenue</h3>
            <p class="text-2xl font-bold">
              ${{ totalRevenue }}
            </p>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">This Term</span>
            <span class="text-sm text-green-600">+{{ revenueGrowth }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              class="bg-green-600 h-2 rounded-full"
              :style="{ width: `${revenueGrowth}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Outstanding Payments Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-4 rounded-full bg-red-100 text-red-600">
            <i class="fas fa-exclamation-circle text-xl"></i>
          </div>
          <div class="ml-4">
            <h3 class="text-gray-500 text-sm">Outstanding Payments</h3>
            <p class="text-2xl font-bold">
              ${{ outstandingPayments }}
            </p>
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

      <!-- Collection Rate Card -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600">
            <i class="fas fa-chart-pie text-xl"></i>
          </div>
          <div class="ml-4">
            <h3 class="text-gray-500 text-sm">Collection Rate</h3>
            <p class="text-2xl font-bold">{{ collectionRate }}%</p>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">Target: 95%</span>
            <span
              class="text-sm"
              :class="
                collectionRate >= 95 ? 'text-green-600' : 'text-yellow-600'
              "
            >
              {{ collectionRate >= 95 ? "On Target" : "Below Target" }}
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              :class="collectionRate >= 95 ? 'bg-green-600' : 'bg-yellow-600'"
              class="h-2 rounded-full"
              :style="{ width: `${collectionRate}%` }"
            ></div>
          </div>
        </div>
      </div>
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
              <span class="text-gray-700"
                >${{ cls.revenue }}</span
              >
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

const totalRevenue = ref(1250000);
const revenueGrowth = ref(15);
const outstandingPayments = ref(300000);
const overdueCount = ref(5);
const overduePercentage = ref(10);
const collectionRate = ref(85);

const topClasses = ref([
  { id: "1", name: "Primary 6", revenue: 750000 },
  { id: "2", name: "JSS 1", revenue: 600000 },
  { id: "3", name: "JSS 2", revenue: 450000 },
  { id: "4", name: "JSS 3", revenue: 350000 },
]);

// Methods
const formatCurrency = (amount) => {
  return amount.toLocaleString("en-NG");
};
</script>
