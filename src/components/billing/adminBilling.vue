<template>
  <div class="p-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Billing Management</h1>
      <p class="text-gray-600">
        Manage fee structures and view payment information
      </p>
    </div>

    <!-- Tabs for different sections -->
    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button
            @click="activeTab = 'feeStructures'"
            :class="[
              'py-4 px-6 font-medium text-sm',
              activeTab === 'feeStructures'
                ? 'border-b-2 border-eduPurple text-eduPurple'
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
                ? 'border-b-2 border-eduPurple text-eduPurple'
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
                ? 'border-b-2 border-eduPurple text-eduPurple'
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
      <FeeStructure />
    </div>

    <!-- Payments Tab -->
    <div v-if="activeTab === 'payments'">
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

    <!-- Reports Tab -->
    <div v-if="activeTab === 'reports'">
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
                ₦{{ formatCurrency(totalRevenue) }}
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
            <div class="p-3 rounded-full bg-red-100 text-red-600">
              <i class="fas fa-exclamation-circle text-xl"></i>
            </div>
            <div class="ml-4">
              <h3 class="text-gray-500 text-sm">Outstanding Payments</h3>
              <p class="text-2xl font-bold">
                ₦{{ formatCurrency(outstandingPayments) }}
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
                  >₦{{ formatCurrency(cls.revenue) }}</span
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

    <!-- Create/Edit Fee Structure Modal -->
    <div
      v-if="showCreateFeeModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div class="p-6 border-b">
          <h2 class="text-xl font-bold text-gray-800">
            {{ editingFee ? "Edit Fee Structure" : "Create Fee Structure" }}
          </h2>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveFeeStructure">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  for="academicYear"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Academic Year</label
                >
                <select
                  v-model="feeForm.academicYear"
                  required
                  class="w-full border rounded-lg px-3 py-2 focus:ring-eduPurple focus:border-eduPurple"
                >
                  <option value="2023-2024">2023-2024</option>
                  <option value="2024-2025">2024-2025</option>
                </select>
              </div>
              <div>
                <label
                  for="term"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Term</label
                >
                <select
                  v-model="feeForm.term"
                  required
                  class="w-full border rounded-lg px-3 py-2 focus:ring-eduPurple focus:border-eduPurple"
                >
                  <option value="First">First Term</option>
                  <option value="Second">Second Term</option>
                  <option value="Third">Third Term</option>
                </select>
              </div>
              <div>
                <label
                  for="feeType"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Fee Type</label
                >
                <select
                  v-model="feeForm.type"
                  required
                  class="w-full border rounded-lg px-3 py-2 focus:ring-eduPurple focus:border-eduPurple"
                >
                  <option value="Tuition">Tuition</option>
                  <option value="Development">Development Levy</option>
                  <option value="Uniform">Uniform</option>
                  <option value="Books">Books</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label
                  for="class"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Class</label
                >
                <select
                  v-model="feeForm.classId"
                  required
                  class="w-full border rounded-lg px-3 py-2 focus:ring-eduPurple focus:border-eduPurple"
                >
                  <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                    {{ cls.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mb-4">
              <h3 class="text-lg font-medium text-gray-800 mb-2">
                Fee Components
              </h3>
              <div
                v-for="(component, index) in feeForm.components"
                :key="index"
                class="mb-4 p-4 border rounded-lg"
              >
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      for="name"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Name</label
                    >
                    <input
                      type="text"
                      v-model="component.name"
                      required
                      class="w-full border rounded-lg px-3 py-2 focus:ring-eduPurple focus:border-eduPurple"
                      placeholder="e.g. Tuition Fee"
                    />
                  </div>
                  <div>
                    <label
                      for="description"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Description</label
                    >
                    <input
                      type="text"
                      v-model="component.description"
                      class="w-full border rounded-lg px-3 py-2 focus:ring-eduPurple focus:border-eduPurple"
                      placeholder="e.g. Basic tuition fee"
                    />
                  </div>
                  <div>
                    <label
                      for="amount"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Amount (₦)</label
                    >
                    <input
                      type="number"
                      v-model.number="component.amount"
                      required
                      min="0"
                      class="w-full border rounded-lg px-3 py-2 focus:ring-eduPurple focus:border-eduPurple"
                    />
                  </div>
                </div>
                <button
                  v-if="feeForm.components.length > 1"
                  @click="feeForm.components.splice(index, 1)"
                  type="button"
                  class="mt-2 text-red-600 hover:text-red-800 text-sm"
                >
                  <i class="fas fa-trash mr-1"></i> Remove Component
                </button>
              </div>
              <button
                @click="
                  feeForm.components.push({
                    name: '',
                    description: '',
                    amount: 0,
                  })
                "
                type="button"
                class="mt-2 text-eduPurple hover:text-purple-700 text-sm"
              >
                <i class="fas fa-plus mr-1"></i> Add Component
              </button>
            </div>

            <div class="flex justify-between items-center mt-6">
              <button
                type="button"
                @click="showCreateFeeModal = false"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-eduPurple text-white rounded-lg hover:bg-purple-700"
              >
                {{ editingFee ? "Update" : "Create" }} Fee Structure
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import FeeStructure from "./adminBillingComponents/feeStructure.vue";

// Active tab state
const activeTab = ref("feeStructures");


const loading = ref(false);

const itemsPerPage = 10;
const showCreateFeeModal = ref(false);
const editingFee = ref(null);

// Payments Tab
const paymentSearchQuery = ref("");
const paymentStatusFilter = ref("");
const classFilter = ref("");
const paymentCurrentPage = ref(1);

// Fee Structure Form
const feeForm = ref({
  academicYear: "2023-2024",
  term: "First",
  type: "Tuition",
  totalAmount: 0,
  components: [{ name: "", description: "", amount: 0 }],
  classId: "",
});

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

// Reports Tab Data
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

// Methods
const formatCurrency = (amount) => {
  return amount.toLocaleString("en-NG");
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const saveFeeStructure = () => {
  // Implement save fee structure logic
  console.log("Save fee structure", feeForm.value);
  showCreateFeeModal.value = false;
  editingFee.value = null;
};

const viewPaymentDetails = (payment) => {
  console.log("View payment details", payment);
  // Implement view payment details logic
};

const printReceipt = (payment) => {
  console.log("Print receipt", payment);
  // Implement print receipt logic
};

onMounted(() => {
  // Fetch data from API
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>
