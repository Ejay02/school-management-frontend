<template>
  <div class="p-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Billing Management</h1>
      <p class="text-gray-600">
        Manage fee structures and view payment information
      </p>
    </div>

    <!--Nav Tabs for different sections -->
    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button
            @click="activeTab = 'feeStructures'"
            :class="[
              'py-4 px-6 font-medium text-sm',
              activeTab === 'feeStructures'
                ? 'border-b-2 border-eduPurple text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Fee Structures
          </button>
          <button
            @click="activeTab = 'payments'"
            :class="[
              'py-4 px-6 font-medium text-sm',
              activeTab === 'payments'
                ? 'border-b-2 border-eduPurple text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Payments
          </button>
          <button
            @click="activeTab = 'reports'"
            :class="[
              'py-4 px-6 font-medium text-sm',
              activeTab === 'reports'
                ? 'border-b-2 border-eduPurple text-indigo-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Reports
          </button>
        </nav>
      </div>
    </div>

    <!-- Fee Structures Tab -->
    <div v-if="activeTab === 'feeStructures'">
      <FeeStructureTab />
    </div>

    <!-- Payments Tab -->
    <div v-if="activeTab === 'payments'">
      <PaymentsTab />
    </div>

    <!-- Reports Tab -->
    <div v-if="activeTab === 'reports'">
      <ReportsTab />
    </div>

  
  </div>
</template>

<script setup>
import { ref } from "vue";
import FeeStructureTab from "./adminBillingComponents/feeStructureTab.vue";
import PaymentsTab from "./adminBillingComponents/paymentsTab.vue";
import ReportsTab from "./adminBillingComponents/reportsTab.vue";


const activeTab = ref("feeStructures");

</script>
