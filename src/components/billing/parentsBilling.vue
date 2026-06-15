<template>
  <div class="bg-eduYellowLight rounded-lg p-6 w-full">
    <LoadingScreen v-if="loading" message="Loading billing ..." />

    <div v-else>
      <div class="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
        <div class="rounded-lg bg-gray-200 p-4 shadow">
          <div class="flex items-center">
            <i class="fa-solid fa-dollar-sign text-2xl text-green-600"></i>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Total Outstanding</p>
              <p class="text-2xl font-bold text-gray-500">
                {{ formatCurrency(totalOutstanding) }}
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-lg bg-gray-200 p-4 shadow">
          <div class="flex items-center">
            <i class="fa-solid fa-file-invoice text-2xl text-blue-600"></i>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Open Invoices</p>
              <p class="text-2xl font-bold text-gray-500">
                {{ outstandingInvoices.length }}
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-lg bg-gray-200 p-4 shadow">
          <div class="flex items-center">
            <i class="fa-solid fa-triangle-exclamation text-2xl text-red-600"></i>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Overdue</p>
              <p class="text-2xl font-bold text-gray-500">
                {{ overdueInvoices.length }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-600">Fees Due</h2>
        </div>

        <div v-if="outstandingInvoices.length" class="space-y-4">
          <div
            v-for="invoice in outstandingInvoices"
            :key="invoice.id"
            class="rounded-lg bg-gray-100 p-6 shadow"
          >
            <div
              class="flex flex-col gap-4 border-b border-gray-300 pb-4 md:flex-row md:items-start md:justify-between"
            >
              <div>
                <h3 class="text-xl font-bold text-gray-600">
                  {{ invoiceLabel(invoice) }}
                </h3>
                <p class="text-sm text-gray-500">
                  Invoice {{ invoice.invoiceNumber }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  Due: {{ formatDate(invoice.dueDate) }}
                </p>
              </div>

              <div class="text-left md:text-right">
                <p class="text-2xl font-bold text-gray-600">
                  {{ formatCurrency(invoiceRemainingAmount(invoice)) }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  {{ formatCurrency(invoice.paidAmount) }} paid of
                  {{ formatCurrency(invoice.totalAmount) }}
                </p>
                <span
                  class="mt-2 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                  :class="statusChipClass(invoice.status)"
                >
                  {{ normalizeStatusLabel(invoice.status) }}
                </span>
              </div>
            </div>

            <div class="mt-4">
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="font-medium text-gray-600">Payment Progress</span>
                <span class="text-gray-500"
                  >{{ paymentProgress(invoice) }}%</span
                >
              </div>
              <div class="h-2 w-full rounded-full bg-gray-200">
                <div
                  class="h-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"
                  :style="{ width: `${paymentProgress(invoice)}%` }"
                ></div>
              </div>
            </div>

            <div v-if="invoice.feeStructure?.term || invoice.feeStructure?.academicYear" class="mt-4 rounded-lg bg-white p-4">
              <h4 class="mb-2 font-medium text-gray-600">Fee Details</h4>
              <div class="space-y-2 text-sm text-gray-500">
                <div class="flex justify-between">
                  <span>Academic Year</span>
                  <span>{{ invoice.feeStructure?.academicYear || "N/A" }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Term</span>
                  <span>{{ invoice.feeStructure?.term || "N/A" }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Type</span>
                  <span>{{ invoice.feeStructure?.type || "N/A" }}</span>
                </div>
              </div>
            </div>

            <div class="mt-4 flex justify-end">
              <button
                @click="handlePayInvoice(invoice)"
                :disabled="processingInvoiceId === invoice.id"
                class="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-2 text-white transition-colors hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {{
                  processingInvoiceId === invoice.id
                    ? "Redirecting..."
                    : `Pay ${formatCurrency(invoiceRemainingAmount(invoice))}`
                }}
              </button>
            </div>
          </div>
        </div>

        <EmptyState
          v-else
          icon="fa-regular fa-circle-check"
          heading="No fees due"
          description="You have no outstanding invoices right now."
        />
      </div>

      <div>
        <h2 class="mb-4 text-2xl font-bold text-gray-600">Invoice History</h2>
        <div v-if="invoices.length" class="overflow-hidden rounded-lg bg-white shadow">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Invoice #
                </th>
                <th
                  class="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell"
                >
                  Due Date
                </th>
                <th
                  class="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell"
                >
                  Description
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Amount
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Status
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 bg-gray-100">
              <tr v-for="invoice in invoices" :key="invoice.id">
                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-600">
                  {{ invoice.invoiceNumber }}
                </td>
                <td class="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 md:table-cell">
                  {{ formatDate(invoice.dueDate) }}
                </td>
                <td class="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 md:table-cell">
                  {{ invoiceLabel(invoice) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {{ formatCurrency(invoice.totalAmount) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                    :class="statusChipClass(invoice.status)"
                  >
                    {{ normalizeStatusLabel(invoice.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <EmptyState
          v-else
          icon="fa-solid fa-file-invoice-dollar"
          heading="No invoices yet"
          description="Your billing history will appear here once invoices are issued."
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { apolloClient } from "../../../apollo-client";
import { initiatePayment } from "../../graphql/mutations";
import { getMyInvoices } from "../../graphql/queries";
import { useNotificationStore } from "../../store/notification";
import { formatDate } from "../../utils/date.holidays";
import EmptyState from "../emptyState.vue";
import LoadingScreen from "../loadingScreen.vue";

const notificationStore = useNotificationStore();
const loading = ref(false);
const processingInvoiceId = ref("");
const invoices = ref([]);

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(amount || 0));

const invoiceRemainingAmount = (invoice) =>
  Math.max(
    Number(invoice?.totalAmount || 0) - Number(invoice?.paidAmount || 0),
    0,
  );

const outstandingInvoices = computed(() =>
  invoices.value.filter((invoice) => invoiceRemainingAmount(invoice) > 0),
);

const overdueInvoices = computed(() =>
  outstandingInvoices.value.filter((invoice) => {
    return new Date(invoice?.dueDate).getTime() < Date.now();
  }),
);

const totalOutstanding = computed(() =>
  outstandingInvoices.value.reduce((sum, invoice) => {
    return sum + invoiceRemainingAmount(invoice);
  }, 0),
);

const invoiceLabel = (invoice) => {
  const academicYear = invoice?.feeStructure?.academicYear || "";
  const term = invoice?.feeStructure?.term || "";
  const type = invoice?.feeStructure?.type || "Fee";
  return [academicYear, term, type].filter(Boolean).join(" • ") || "School Fee";
};

const paymentProgress = (invoice) => {
  const total = Number(invoice?.totalAmount || 0);
  if (!total) return 0;
  const progress = (Number(invoice?.paidAmount || 0) / total) * 100;
  return Math.max(0, Math.min(100, Math.round(progress)));
};

const normalizeStatusLabel = (status) => {
  const value = String(status || "").toLowerCase();
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const statusChipClass = (status) => {
  const value = String(status || "").toUpperCase();
  if (value === "PAID") return "bg-green-50 text-green-700 ring-green-600/20";
  if (value === "OVERDUE") return "bg-red-50 text-red-700 ring-red-600/10";
  if (value === "PARTIAL") return "bg-amber-50 text-amber-800 ring-amber-600/20";
  return "bg-blue-50 text-blue-700 ring-blue-600/20";
};

const fetchInvoices = async () => {
  loading.value = true;
  try {
    const { data } = await apolloClient.query({
      query: getMyInvoices,
      variables: { params: { page: 1, limit: 1000 } },
      fetchPolicy: "network-only",
    });

    invoices.value = Array.isArray(data?.getMyInvoices) ? data.getMyInvoices : [];
  } catch (error) {
    invoices.value = [];
    notificationStore.addNotification({
      type: "error",
      message: "Unable to load billing details.",
    });
  } finally {
    loading.value = false;
  }
};

const handlePayInvoice = async (invoice) => {
  const amount = invoiceRemainingAmount(invoice);
  if (!amount) return;

  processingInvoiceId.value = invoice.id;
  try {
    const { data } = await apolloClient.mutate({
      mutation: initiatePayment,
      variables: {
        invoiceId: invoice.id,
        amount,
      },
    });

    const checkoutUrl = data?.initiatePayment;
    if (!checkoutUrl) {
      throw new Error("Missing checkout URL");
    }

    window.location.href = checkoutUrl;
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: "Unable to start payment right now.",
    });
  } finally {
    processingInvoiceId.value = "";
  }
};

onMounted(() => {
  void fetchInvoices();
});
</script>

<style scoped></style>
