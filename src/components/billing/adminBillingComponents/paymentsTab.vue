<template>
  <div>
    <div class="flex justify-between mb-4">
      <div class="flex space-x-2">
        <div class="relative">
          <input
            type="text"
            v-model="paymentSearchQuery"
            placeholder="Search payments..."
            class="pl-10 pr-4 py-2 border rounded-lg focus:ring-eduPurple focus:border-eduPurple"
          />
          <div class="absolute left-3 top-2.5 text-gray-400">
            <i class="fas fa-search"></i>
          </div>
        </div>
        <select
          v-model="paymentStatusFilter"
          class="border rounded-lg px-4 py-2 focus:ring-eduPurple focus:border-eduPurple"
        >
          <option value="">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
        <select
          v-model="classFilter"
          class="border rounded-lg px-4 py-2 focus:ring-eduPurple focus:border-eduPurple"
        >
          <option value="">All Classes</option>
          <option v-for="cls in classes" :key="cls.id" :value="cls.id">
            {{ cls.name }}
          </option>
        </select>
      </div>
      <div>
        <button
          class="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <i class="fas fa-file-export mr-2"></i> Export
        </button>
      </div>
    </div>

    <!-- Payments Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Student
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Class
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Fee Type
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="7" class="px-6 py-4 text-center">
              <div class="flex justify-center">
                <div
                  class="animate-spin rounded-full h-6 w-6 border-b-2 border-eduPurple"
                ></div>
              </div>
            </td>
          </tr>
          <tr v-else-if="filteredPayments.length === 0">
            <td colspan="7" class="px-6 py-4 text-center text-gray-500">
              No payments found
            </td>
          </tr>
          <tr
            v-for="payment in filteredPayments"
            :key="payment.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0">
                  <img
                    class="h-10 w-10 rounded-full"
                    :src="payment.student.photo || '/default-avatar.png'"
                    alt=""
                  />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ payment.student.name }} {{ payment.student.surname }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ payment.student.id }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ payment.class.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ payment.feeType }}</td>
            <td class="px-6 py-4 whitespace-nowrap font-medium">
              ₦{{ formatCurrency(payment.amount) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ formatDate(payment.date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                  payment.status === 'Paid'
                    ? 'bg-green-100 text-green-800'
                    : payment.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800',
                ]"
              >
                {{ payment.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button
                @click="viewPaymentDetails(payment)"
                class="text-indigo-600 hover:text-indigo-900 mr-3"
              >
                <i class="fas fa-eye"></i>
              </button>
              <button
                @click="printReceipt(payment)"
                class="text-green-600 hover:text-green-900"
              >
                <i class="fas fa-print"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination for Payments -->
    <div class="flex justify-between items-center mt-4">
      <div class="text-sm text-gray-700">
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
            'px-3 py-1 rounded-md',
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
            'px-3 py-1 rounded-md',
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
import { computed, ref } from "vue";

const paymentSearchQuery = ref("");
const paymentStatusFilter = ref("");
const classFilter = ref("");
const paymentCurrentPage = ref(1);
const itemsPerPage = 10;
const loading = ref(false);

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


const classes = ref([
  { id: "1", name: "Primary 6" },
  { id: "2", name: "JSS 1" },
  { id: "3", name: "JSS 2" },
  { id: "4", name: "JSS 3" },
]);

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

  if (classFilter.value) {
    result = result.filter((payment) => payment.class.id === classFilter.value);
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
</script>
