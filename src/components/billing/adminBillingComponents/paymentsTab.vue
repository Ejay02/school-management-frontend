<template>
  <div>
    <div class="">
      <LoadingScreen
        message="Loading payments ... "
        v-if="paymentStore.loading"
      />

      <ErrorScreen
        :message="paymentStore.error"
        v-else-if="paymentStore.error"
      />

      <EmptyState
        v-else-if="!paymentStore.payments.length && !paymentStore.loading"
        icon="fa-solid fa-money-bill"
        heading="Nothing here yet"
        description="Check back later for updates"
      />

      <div class="" v-else>
        <!-- header/search -->
        <div class="flex flex-col md:flex-row justify-between mb-4 gap-3">
          <div class="flex flex-wrap gap-2">
            <!--  -->
            <div class="relative w-full sm:w-auto">
              <input
                type="text"
                v-model="paymentSearchQuery"
                placeholder="Search payments..."
                class="pl-10 pr-4 block w-full h-[42px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
              <div class="absolute left-3 top-2.5 text-gray-400">
                <i class="fas fa-search"></i>
              </div>
            </div>
            <!--  -->
            <select
              v-model="paymentStatusFilter"
              class="block h-[42px] w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
            <!--  -->
            <div class="h-[42px] w-full sm:w-auto flex items-center">
              <Dropdown
                v-model="selectedClass"
                :options="classOptions"
                emptyLabel="Select a class"
                label=""
                class="w-full"
              />
            </div>
          </div>
          <div class="mt-2 md:mt-0">
            <button
              @click="exportToExcel"
              class="w-full sm:w-auto h-[42px] bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-md shadow-sm text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <i class="fas fa-file-export mr-2"></i> Export
            </button>
          </div>
        </div>

        <!-- Payments Table -->
        <div class="bg-white rounded-lg shadow overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Student
                </th>
                <th
                  class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                >
                  Class
                </th>
                <th
                  class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Fee Type
                </th>
                <th
                  class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Date
                </th>
                <th
                  class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="paymentStore.loading">
                <td colspan="7" class="px-4 sm:px-6 py-4 text-center">
                  <div class="flex justify-center">
                    <div
                      class="animate-spin rounded-full h-6 w-6 border-b-2 border-eduPurple"
                    ></div>
                  </div>
                </td>
              </tr>
              <tr v-else-if="filteredPayments.length === 0">
                <td
                  colspan="7"
                  class="px-4 sm:px-6 py-4 text-center text-gray-500"
                >
                  No payments found
                </td>
              </tr>
              <tr
                v-for="payment in filteredPayments"
                :key="payment.id"
                class="hover:bg-gray-50"
              >
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                      <img
                        class="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                        :src="payment.student.photo || '/default-avatar.png'"
                        alt=""
                      />
                    </div>
                    <div class="ml-2 sm:ml-4">
                      <div class="text-xs sm:text-sm font-medium text-gray-900">
                        {{ payment.student.name }} {{ payment.student.surname }}
                      </div>
                      <div class="text-xs sm:text-sm text-gray-500">
                        {{ payment.student.id }}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  class="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell"
                >
                  {{ payment.class.name }}
                </td>
                <td
                  class="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell"
                >
                  {{ payment.feeType }}
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap font-medium">
                  ${{ payment.amount }}
                </td>
                <td
                  class="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell"
                >
                  {{ formatDate(payment.date) }}
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset',
                      payment.status === 'Paid'
                        ? 'bg-green-50 text-green-700 ring-green-600/20'
                        : payment.status === 'Pending'
                        ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                        : 'bg-red-50 text-red-700 ring-red-600/10',
                    ]"
                  >
                    {{ payment.status }}
                  </span>
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex gap-1">
                    <!--  -->
                    <div class="group relative">
                      <button
                        @click="viewPaymentDetails(payment)"
                        class="group relative text-indigo-600 hover:bg-eduSkyLight px-3 py-1 rounded-md text-sm transition duration-300"
                      >
                        <i class="fa-solid fa-arrow-right"></i>
                      </button>
                      <span
                        class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex"
                      >
                        View
                      </span>
                    </div>

                    <div class="group relative">
                      <button
                        @click="printReceipt(payment)"
                        class="group relative text-gray-700 hover:bg-eduSkyLight px-3 py-1 rounded-md text-sm transition duration-300"
                      >
                        <i class="fas fa-print"></i>
                      </button>
                      <span
                        class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex"
                      >
                        Print
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pagination for Payments -->
    <Pagination
      :currentPage="paymentCurrentPage"
      :hasMore="paymentCurrentPage < paymentTotalPages"
      :totalPages="paymentTotalPages"
      @update:page="handlePageChange"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useClassStore } from "../../../store/classStore";
import { usePaymentStore } from "../../../store/paymentStore";
import Dropdown from "../../dropdowns/dropdown.vue";
import EmptyState from "../../emptyState.vue";
import LoadingScreen from "../../loadingScreen.vue";

import { printPaymentReceipt } from "../../../utils/print.reciept";
import ErrorScreen from "../../errorScreen.vue";

import * as XLSX from "xlsx";


import Pagination from "../../pagination.vue";

const classStore = useClassStore();
const paymentStore = usePaymentStore();


const selectedClass = ref("");
const paymentSearchQuery = ref("");
const paymentStatusFilter = ref("");
const paymentCurrentPage = ref(1);
const itemsPerPage = 10;

const classOptions = computed(() => {
  return classStore.getClassNames?.map((classItem) => classItem.name) || [];
});

const handlePageChange = (page) => {
  paymentCurrentPage.value = page;
};

const filteredPayments = computed(() => {
  let result = [...paymentStore.payments];

  if (paymentSearchQuery.value) {
    const query = paymentSearchQuery.value.toLowerCase();
    result = result.filter(
      (payment) =>
        payment.student.name.toLowerCase().includes(query) ||
        payment.student.surname.toLowerCase().includes(query) ||
        payment.student.id.toLowerCase().includes(query)
    );
  }

  if (paymentStatusFilter.value) {
    result = result.filter(
      (payment) => payment.status === paymentStatusFilter.value
    );
  }

  if (selectedClass.value) {
    result = result.filter(
      (payment) => payment.class.name === selectedClass.value
    );
  }

  return result;
});

const totalPayments = computed(() => filteredPayments.value.length);

const paymentTotalPages = computed(() =>
  Math.ceil(totalPayments.value / itemsPerPage)
);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const viewPaymentDetails = (payment) => {
  console.log("View payment details", payment);
  // Implement view payment details logic
};

const printReceipt = (payment) => {
  printPaymentReceipt(payment, formatDate);
};

const exportToExcel = () => {
  // Prepare data for export
  const dataToExport = filteredPayments.value.map((payment) => ({
    "Student ID": payment.student.id,
    "Student Name": `${payment.student.name} ${payment.student.surname}`,
    Class: payment.class.name,
    "Fee Type": payment.feeType,
    Amount: `$${payment.amount}`,
    Date: formatDate(payment.date),
    Status: payment.status,
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

  // Generate Excel file
  XLSX.writeFile(workbook, "payments_export.xlsx");
};

// Reset pagination when filters change
watch([paymentSearchQuery, paymentStatusFilter, selectedClass], () => {
  paymentCurrentPage.value = 1;
});

onMounted(async () => {
  await Promise.all([classStore.fetchClasses(), paymentStore.fetchPayments()]);
});
</script>
