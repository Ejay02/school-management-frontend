<template>
  <div>
    <div class="">
      <LoadingScreen message="Loading payments ... " v-if="loading" />

      <ErrorScreen :message="error" v-else-if="error" />

      <EmptyState
        v-else-if="!payments.length"
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
              <tr v-if="loading">
                <td colspan="7" class="px-4 sm:px-6 py-4 text-center">
                  <div class="flex justify-center">
                    <div
                      class="animate-spin rounded-full h-6 w-6 border-b-2 border-eduPurple"
                    ></div>
                  </div>
                </td>
              </tr>
              <tr v-else-if="filteredPayments.length === 0">
                <td colspan="7" class="px-4 sm:px-6 py-4 text-center text-gray-500">
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
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  {{ payment.class.name }}
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  {{ payment.feeType }}
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap font-medium">
                  ${{ payment.amount }}
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
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
                  <div class="flex space-x-2">
                    <button
                      @click="viewPaymentDetails(payment)"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      @click="printReceipt(payment)"
                      class="text-green-600 hover:text-green-900"
                    >
                      <i class="fas fa-print"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pagination for Payments -->
    <div class="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
      <div class="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
        Showing
        <span class="font-medium">{{ paymentPaginationStart }}</span> to
        <span class="font-medium">{{ paymentPaginationEnd }}</span> of
        <span class="font-medium">{{ totalPayments }}</span> results
      </div>
      <div class="flex space-x-2">
        <button
          @click="paymentCurrentPage--"
          :disabled="paymentCurrentPage === 1"
          :class="[
            'px-3 py-1 rounded-md text-xs sm:text-sm',
            paymentCurrentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50',
          ]"
        >
          Previous
        </button>
        <button
          @click="paymentCurrentPage++"
          :disabled="paymentCurrentPage === paymentTotalPages"
          :class="[
            'px-3 py-1 rounded-md text-xs sm:text-sm',
            paymentCurrentPage === paymentTotalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50',
          ]"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useClassStore } from "../../../store/classStore";
import Dropdown from "../../dropdowns/dropdown.vue";
import EmptyState from "../../emptyState.vue";
import LoadingScreen from "../../loadingScreen.vue";

import ErrorScreen from "../../errorScreen.vue";

const classStore = useClassStore();

const selectedClass = ref("");

const paymentSearchQuery = ref("");
const paymentStatusFilter = ref("");

const paymentCurrentPage = ref(1);
const itemsPerPage = 10;
const loading = ref(false);
const error = ref(false);

const payments = ref([
  {
    id: "1",
    student: {
      id: "STD001",
      name: "John",
      surname: "Doe",
      photo: "",
    },
    class: {
      id: "1",
      name: "Primary 6",
    },
    feeType: "Tuition",
    amount: 250000,
    date: "2023-09-05",
    status: "Paid",
  },
  {
    id: "2",
    student: {
      id: "STD002",
      name: "Jane",
      surname: "Smith",
      photo: "",
    },
    class: {
      id: "1",
      name: "Primary 6",
    },
    feeType: "Tuition",
    amount: 250000,
    date: "2023-09-10",
    status: "Paid",
  },
  {
    id: "3",
    student: {
      id: "STD003",
      name: "Michael",
      surname: "Johnson",
      photo: "",
    },
    class: {
      id: "2",
      name: "JSS 1",
    },
    feeType: "Tuition",
    amount: 300000,
    date: "2023-09-15",
    status: "Pending",
  },
  {
    id: "4",
    student: {
      id: "STD004",
      name: "Sarah",
      surname: "Williams",
      photo: "",
    },
    class: {
      id: "2",
      name: "JSS 1",
    },
    feeType: "Tuition",
    amount: 300000,
    date: "2023-08-20",
    status: "Overdue",
  },
]);

const classOptions = computed(() => {
  return classStore.getClassNames?.map((classItem) => classItem.name) || [];
});

const filteredPayments = computed(() => {
  let result = [...payments.value];

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
      (payment) => payment.class.id === selectedClass.value
    );
  }

  return result;
});

const totalPayments = computed(() => filteredPayments.value.length);

const paymentTotalPages = computed(() =>
  Math.ceil(totalPayments.value / itemsPerPage)
);
const paymentPaginationStart = computed(
  () => (paymentCurrentPage.value - 1) * itemsPerPage + 1
);
const paymentPaginationEnd = computed(() =>
  Math.min(paymentCurrentPage.value * itemsPerPage, totalPayments.value)
);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount) => {
  return amount.toLocaleString("en-NG");
};

const viewPaymentDetails = (payment) => {
  console.log("View payment details", payment);
  // Implement view payment details logic
};

const printReceipt = (payment) => {
  console.log("Print receipt", payment);
  // Implement print receipt logic
};

onMounted(async () => {
  await Promise.all([classStore.fetchClasses()]);
});
</script>
