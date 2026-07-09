<template>
  <div>
    <LoadingScreen
      message="Loading reconciliation data..."
      v-if="paymentStore.reconciliationLoading"
    />

    <ErrorScreen
      :message="paymentStore.reconciliationError"
      v-else-if="paymentStore.reconciliationError"
    />

    <div v-else>
      <!-- Summary Cards Grid -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-3">Term Summaries</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div
            v-for="termSum in termSummaries"
            :key="termSum.term"
            :class="[
              'rounded-2xl border p-5 transition duration-300 hover:scale-[1.02] cursor-default shadow-sm',
              termSum.bgClass
            ]"
          >
            <div class="flex justify-between items-center mb-3">
              <span class="text-sm font-semibold tracking-wider uppercase opacity-80">{{ termSum.title }}</span>
              <i :class="['fas', termSum.icon, 'text-lg opacity-80']"></i>
            </div>
            
            <div class="space-y-2">
              <div class="flex justify-between items-baseline">
                <span class="text-xs opacity-75">Expected:</span>
                <span class="text-lg font-bold">{{ formatCurrency(termSum.expected) }}</span>
              </div>
              <div class="flex justify-between items-baseline">
                <span class="text-xs opacity-75">Collected:</span>
                <span class="text-lg font-bold">{{ formatCurrency(termSum.collected) }}</span>
              </div>
              <div class="flex justify-between items-baseline border-t border-black/10 pt-2">
                <span class="text-xs font-semibold">Outstanding:</span>
                <span class="text-lg font-black">{{ formatCurrency(termSum.outstanding) }}</span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mt-4">
              <div class="flex justify-between text-[10px] mb-1 opacity-80">
                <span>Collection Rate</span>
                <span class="font-bold">{{ termSum.rate.toFixed(1) }}%</span>
              </div>
              <div class="w-full bg-black/5 rounded-full h-1.5 overflow-hidden">
                <div
                  :class="[termSum.barClass, 'h-1.5 rounded-full transition-all duration-500']"
                  :style="{ width: `${Math.min(termSum.rate, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters panel -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-150">
        <div class="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
          <div class="flex flex-wrap items-center gap-3 flex-1">
            <!-- Search -->
            <div class="relative w-full md:w-64">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search student or ID..."
                class="pl-9 pr-4 block w-full h-[40px] border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
              />
              <div class="absolute left-3 top-2.5 text-gray-400">
                <i class="fas fa-search"></i>
              </div>
            </div>

            <!-- Term Filter -->
            <select
              v-model="filterTerm"
              class="block h-[40px] w-full md:w-44 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer transition duration-150"
            >
              <option value="">All Terms</option>
              <option value="FIRST">First Term</option>
              <option value="SECOND">Second Term</option>
              <option value="THIRD">Third Term</option>
              <option value="YEARLY">Yearly Fee</option>
            </select>

            <!-- Class Filter -->
            <select
              v-model="filterClass"
              class="block h-[40px] w-full md:w-44 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer transition duration-150"
            >
              <option value="">All Classes</option>
              <option
                v-for="cls in classOptions"
                :key="cls.id"
                :value="cls.name"
              >
                {{ cls.name }}
              </option>
            </select>

            <!-- Status Filter -->
            <select
              v-model="filterStatus"
              class="block h-[40px] w-full md:w-44 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer transition duration-150"
            >
              <option value="">All Statuses</option>
              <option value="PAID">Paid</option>
              <option value="PARTIAL">Partial</option>
              <option value="PENDING">Pending</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>

          <!-- Export Actions -->
          <div class="flex gap-2">
            <button
              @click="exportToCSV"
              class="flex-1 md:flex-initial h-[40px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-sm text-xs font-semibold focus:outline-none transition duration-150 flex items-center justify-center gap-2"
            >
              <i class="fas fa-file-csv text-emerald-600 text-sm"></i> Export CSV
            </button>
            <button
              @click="exportToExcel"
              class="flex-1 md:flex-initial h-[40px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg shadow-sm text-xs font-semibold focus:outline-none transition duration-150 flex items-center justify-center gap-2"
            >
              <i class="fas fa-file-excel text-sm"></i> Export Excel
            </button>
          </div>
        </div>
      </div>

      <!-- Reconciliation Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="w-10 px-4 py-3"></th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Class</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Term</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Fee Type</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Expected</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Paid</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Balance</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredRecords.length === 0">
                <td colspan="9" class="px-6 py-10 text-center text-gray-500">
                  <div class="flex flex-col items-center justify-center space-y-2">
                    <i class="fa-solid fa-receipt text-3xl text-gray-300"></i>
                    <p class="font-medium">No reconciliation records found</p>
                    <p class="text-xs text-gray-400">Try adjusting your filters or search query</p>
                  </div>
                </td>
              </tr>
              
              <template v-for="record in paginatedRecords" :key="record.invoiceId">
                <!-- Master Row -->
                <tr
                  class="hover:bg-gray-50/75 transition duration-150 cursor-pointer"
                  @click="toggleRow(record.invoiceId)"
                >
                  <td class="px-4 py-4 text-center" @click.stop="toggleRow(record.invoiceId)">
                    <button class="text-gray-400 hover:text-gray-600 focus:outline-none transition-transform duration-200" :class="{ 'rotate-180': expandedRows.has(record.invoiceId) }">
                      <i class="fas fa-chevron-down text-xs"></i>
                    </button>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                        {{ record.studentName ? record.studentName[0] : 'S' }}{{ record.studentSurname ? record.studentSurname[0] : '' }}
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-semibold text-gray-900">
                          {{ record.studentName || 'N/A' }} {{ record.studentSurname || '' }}
                        </div>
                        <div class="text-xs text-gray-500">
                          ID: {{ record.studentId || 'N/A' }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ record.className || 'Unassigned' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                    {{ formatTerm(record.term) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                    {{ record.feeType }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ formatCurrency(record.amount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                    {{ formatCurrency(record.paid) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="record.balance > 0 ? 'text-rose-600' : 'text-gray-500'">
                    {{ formatCurrency(record.balance) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset', getStatusClass(record.status)]">
                      {{ record.status }}
                    </span>
                  </td>
                </tr>

                <!-- Expanded Drill-down Details Row -->
                <tr v-if="expandedRows.has(record.invoiceId)" class="bg-gray-50/50">
                  <td colspan="9" class="px-6 py-4 border-l-2 border-indigo-500">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                      <!-- Invoice Information -->
                      <div class="space-y-3">
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Invoice Details</h4>
                        <div class="bg-white rounded-lg p-3 border border-gray-150 space-y-2 text-sm shadow-sm">
                          <div class="flex justify-between">
                            <span class="text-gray-500">Invoice Number:</span>
                            <span class="font-semibold text-gray-800">{{ record.invoiceNumber }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-500">Issued Date:</span>
                            <span class="text-gray-700">{{ formatDate(record.createdAt) }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-gray-500">Due Date:</span>
                            <span class="text-gray-700 font-medium">{{ formatDate(record.dueDate) }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Payment Transactions List -->
                      <div class="space-y-3">
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Transactions</h4>
                        <div class="bg-white rounded-lg border border-gray-150 overflow-hidden shadow-sm">
                          <!-- List of actual payments -->
                          <div class="divide-y divide-gray-150">
                            <div
                              v-for="pay in getInvoicePayments(record.invoiceId)"
                              :key="pay.id"
                              class="p-3 text-sm flex justify-between items-center hover:bg-gray-50/50"
                            >
                              <div>
                                <div class="font-semibold text-emerald-600">{{ formatCurrency(pay.amount) }}</div>
                                <div class="text-[11px] text-gray-400 mt-0.5">Method: {{ pay.paymentMethod }}</div>
                              </div>
                              <div class="text-right">
                                <div class="text-xs text-gray-600">{{ formatDate(pay.createdAt) }}</div>
                                <div class="text-[10px] text-gray-400 mt-0.5 font-mono">{{ pay.stripePaymentId.substring(0, 12) }}...</div>
                              </div>
                            </div>

                            <div v-if="!getInvoicePayments(record.invoiceId).length" class="p-4 text-center text-sm text-gray-400">
                              No payments recorded for this invoice yet.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="currentPage > 1 ? currentPage-- : null"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              @click="currentPage < totalPages ? currentPage++ : null"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ startIndex + 1 }}</span>
                to
                <span class="font-medium">{{ Math.min(endIndex, filteredRecords.length) }}</span>
                of
                <span class="font-medium">{{ filteredRecords.length }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="currentPage = 1"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span class="sr-only">First</span>
                  <i class="fas fa-angles-left"></i>
                </button>
                <button
                  @click="currentPage > 1 ? currentPage-- : null"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span class="sr-only">Previous</span>
                  <i class="fas fa-chevron-left"></i>
                </button>
                
                <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-gray-700">
                  Page {{ currentPage }} of {{ totalPages }}
                </span>

                <button
                  @click="currentPage < totalPages ? currentPage++ : null"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span class="sr-only">Next</span>
                  <i class="fas fa-chevron-right"></i>
                </button>
                <button
                  @click="currentPage = totalPages"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span class="sr-only">Last</span>
                  <i class="fas fa-angles-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { usePaymentStore } from "../../../store/paymentStore";
import { useClassStore } from "../../../store/classStore";
import LoadingScreen from "../../loadingScreen.vue";
import ErrorScreen from "../../errorScreen.vue";
import * as XLSX from "xlsx";

const paymentStore = usePaymentStore();
const classStore = useClassStore();

// UI Filters State
const searchQuery = ref("");
const filterTerm = ref("");
const filterClass = ref("");
const filterStatus = ref("");

// Pagination State
const currentPage = ref(1);
const itemsPerPage = 10;

// Drill-down State
const expandedRows = ref(new Set());

// Load dashboard and classes data
onMounted(async () => {
  await Promise.all([
    paymentStore.fetchReconciliationData(),
    classStore.fetchClasses(),
    paymentStore.fetchPayments() // Load payments to show inside drill-downs
  ]);
});

// Dropdown options
const classOptions = computed(() => classStore.getClassNames || []);

// Expand/Collapse row
const toggleRow = (invoiceId) => {
  if (expandedRows.value.has(invoiceId)) {
    expandedRows.value.delete(invoiceId);
  } else {
    expandedRows.value.add(invoiceId);
  }
};

// Filtered Records List
const filteredRecords = computed(() => {
  let records = [...paymentStore.reconciliationRecords];

  // Search Filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim();
    records = records.filter(
      (r) =>
        r.studentName?.toLowerCase().includes(query) ||
        r.studentSurname?.toLowerCase().includes(query) ||
        r.studentId?.toLowerCase().includes(query)
    );
  }

  // Term Filter
  if (filterTerm.value) {
    records = records.filter((r) => r.term === filterTerm.value || (filterTerm.value === "YEARLY" && r.feeType === "YEARLY"));
  }

  // Class Filter
  if (filterClass.value) {
    records = records.filter((r) => r.className === filterClass.value);
  }

  // Status Filter
  if (filterStatus.value) {
    records = records.filter((r) => r.status === filterStatus.value);
  }

  return records;
});

// Pagination Calculations
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRecords.value.length / itemsPerPage)));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => startIndex.value + itemsPerPage);
const paginatedRecords = computed(() => filteredRecords.value.slice(startIndex.value, endIndex.value));

// Term Summaries Aggregation (computed dynamically based on filtered records for interactive UX)
const termSummaries = computed(() => {
  const terms = [
    {
      term: "FIRST",
      title: "First Term",
      icon: "fa-money-bill-wave",
      bgClass: "bg-eduSky text-gray-800 border-eduSky/40",
      barClass: "bg-sky-600",
      expected: 0,
      collected: 0,
      outstanding: 0,
      rate: 0
    },
    {
      term: "SECOND",
      title: "Second Term",
      icon: "fa-coins",
      bgClass: "bg-eduPurple text-gray-800 border-eduPurple/40",
      barClass: "bg-indigo-500",
      expected: 0,
      collected: 0,
      outstanding: 0,
      rate: 0
    },
    {
      term: "THIRD",
      title: "Third Term",
      icon: "fa-vault",
      bgClass: "bg-eduYellow text-gray-800 border-eduYellow/40",
      barClass: "bg-amber-500",
      expected: 0,
      collected: 0,
      outstanding: 0,
      rate: 0
    },
    {
      term: "YEARLY",
      title: "Yearly Fee",
      icon: "fa-calendar-days",
      bgClass: "bg-eduPurpleLight text-gray-800 border-eduPurple/30",
      barClass: "bg-purple-500",
      expected: 0,
      collected: 0,
      outstanding: 0,
      rate: 0
    }
  ];

  // Aggregate values
  paymentStore.reconciliationRecords.forEach((r) => {
    // If fee structure is YEARLY, map to YEARLY summary
    const termKey = r.feeType === "YEARLY" ? "YEARLY" : r.term;
    const termObj = terms.find((t) => t.term === termKey);
    if (termObj) {
      termObj.expected += r.amount || 0;
      termObj.collected += r.paid || 0;
      termObj.outstanding += r.balance || 0;
    }
  });

  // Calculate rate
  terms.forEach((t) => {
    t.rate = t.expected > 0 ? (t.collected / t.expected) * 100 : 0;
  });

  return terms;
});

// Watch filters to reset page to 1
watch([searchQuery, filterTerm, filterClass, filterStatus], () => {
  currentPage.value = 1;
  expandedRows.value.clear();
});

// Help mapping payments for the invoice
const getInvoicePayments = (invoiceId) => {
  return paymentStore.allPayments.filter((p) => p.invoiceId === invoiceId && p.status === "Paid");
};

// Formatting helpers
const formatCurrency = (val) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(val || 0);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

const formatTerm = (termVal) => {
  if (!termVal) return "N/A";
  return termVal.charAt(0) + termVal.slice(1).toLowerCase() + " Term";
};

const getStatusClass = (status) => {
  switch (status) {
    case "PAID":
      return "bg-green-50 text-green-700 ring-green-600/20";
    case "PARTIAL":
      return "bg-amber-50 text-amber-800 ring-amber-600/20";
    case "PENDING":
      return "bg-gray-50 text-gray-600 ring-gray-500/10";
    case "OVERDUE":
      return "bg-rose-50 text-rose-700 ring-rose-600/10";
    default:
      return "bg-gray-50 text-gray-600 ring-gray-500/10";
  }
};

// Exports Actions
const exportToCSV = () => {
  // Acceptance criteria: "student, class, fee type, amount, paid, and balance"
  const headers = ["Student", "Class", "Fee Type", "Term", "Expected Amount", "Paid Amount", "Outstanding Balance", "Status"];
  const rows = filteredRecords.value.map((r) => [
    `"${r.studentName || ''} ${r.studentSurname || ''}"`,
    `"${r.className || 'Unassigned'}"`,
    `"${r.feeType}"`,
    `"${r.term || 'N/A'}"`,
    r.amount,
    r.paid,
    r.balance,
    r.status
  ]);

  let csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `finance_reconciliation_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToExcel = () => {
  const dataToExport = filteredRecords.value.map((r) => ({
    Student: `${r.studentName || ''} ${r.studentSurname || ''}`,
    Class: r.className || 'Unassigned',
    "Fee Type": r.feeType,
    Term: r.term || 'N/A',
    "Expected Amount": r.amount,
    "Paid Amount": r.paid,
    "Outstanding Balance": r.balance,
    Status: r.status,
    "Due Date": formatDate(r.dueDate)
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reconciliation");
  XLSX.writeFile(workbook, `finance_reconciliation_${new Date().toISOString().split('T')[0]}.xlsx`);
};
</script>

<style scoped>
/* Smooth expand/collapse animation for drill-down rows */
.rotate-180 {
  transform: rotate(180deg);
}
</style>
