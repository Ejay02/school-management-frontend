<template>
  <div class="w-full rounded-lg bg-eduYellowLight p-4 md:p-6">
    <LoadingScreen v-if="loading" message="Loading billing ..." />

    <div v-else class="space-y-8">
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-xl bg-white p-4 shadow">
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600"
            >
              <i class="fa-solid fa-wallet text-lg"></i>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Due</p>
              <p class="text-2xl font-bold text-gray-700">
                {{ formatCurrency(totalOutstanding) }}
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-xl bg-white p-4 shadow">
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600"
            >
              <i class="fa-solid fa-circle-check text-lg"></i>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Paid</p>
              <p class="text-2xl font-bold text-gray-700">
                {{ formatCurrency(totalPaid) }}
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-xl bg-white p-4 shadow">
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600"
            >
              <i class="fa-solid fa-calendar-days text-lg"></i>
            </div>
            <div>
              <p class="text-sm text-gray-500">Upcoming Installments</p>
              <p class="text-2xl font-bold text-gray-700">
                {{ upcomingInstallments.length }}
              </p>
              <p class="text-xs text-gray-500">
                {{ upcomingInstallmentsSummary }}
              </p>
            </div>
          </div>
        </div>

        <div class="rounded-xl bg-white p-4 shadow">
          <div class="flex items-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600"
            >
              <i class="fa-solid fa-triangle-exclamation text-lg"></i>
            </div>
            <div>
              <p class="text-sm text-gray-500">Overdue Balances</p>
              <p class="text-2xl font-bold text-gray-700">
                {{ overdueInvoices.length }}
              </p>
              <p class="text-xs text-gray-500">
                {{ formatCurrency(totalOverdueAmount) }} overdue
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-2xl font-bold text-gray-700">Fees Due</h2>
            <p class="text-sm text-gray-500">
              Review outstanding balances and continue to checkout.
            </p>
          </div>
        </div>

        <div v-if="outstandingInvoices.length" class="space-y-4">
          <article
            v-for="invoice in outstandingInvoices"
            :key="invoice.id"
            class="rounded-xl bg-white p-5 shadow"
          >
            <div
              class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"
            >
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-lg font-bold text-gray-700">
                    {{ invoiceLabel(invoice) }}
                  </h3>
                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                    :class="statusChipClass(invoice.status)"
                  >
                    {{ normalizeStatusLabel(invoice.status) }}
                  </span>
                </div>
                <p class="mt-1 text-sm text-gray-500">
                  Invoice {{ invoice.invoiceNumber }}
                </p>
                <div
                  class="mt-3 flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
                >
                  <span>Due {{ formatDate(invoice.dueDate) }}</span>
                  <span>{{ formatCurrency(invoice.paidAmount) }} paid</span>
                  <span>{{ formatCurrency(invoice.totalAmount) }} total</span>
                </div>
              </div>

              <div class="w-full max-w-sm rounded-xl bg-gray-50 p-4 lg:w-80">
                <p
                  class="text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  Remaining balance
                </p>
                <p class="mt-1 text-3xl font-bold text-gray-700">
                  {{ formatCurrency(invoiceRemainingAmount(invoice)) }}
                </p>
                <div class="mt-4">
                  <div class="mb-2 flex items-center justify-between text-sm">
                    <span class="font-medium text-gray-600"
                      >Payment Progress</span
                    >
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
                <button
                  @click="handlePayInvoice(invoice)"
                  :disabled="processingInvoiceId === invoice.id"
                  class="mt-4 w-full rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {{
                    processingInvoiceId === invoice.id
                      ? "Redirecting..."
                      : `Pay ${formatCurrency(invoiceRemainingAmount(invoice))}`
                  }}
                </button>
              </div>
            </div>
          </article>
        </div>

        <EmptyState
          v-else
          icon="fa-regular fa-circle-check"
          heading="No fees due"
          description="You have no outstanding invoices right now."
        />
      </section>

      <section class="space-y-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-700">
            Upcoming Installments
          </h2>
          <p class="text-sm text-gray-500">
            Future payments that are already scheduled on your account.
          </p>
        </div>

        <div
          v-if="upcomingInstallments.length"
          class="grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          <article
            v-for="invoice in upcomingInstallments"
            :key="`${invoice.id}-upcoming`"
            class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h3 class="text-base font-semibold text-gray-700">
                  {{ invoiceLabel(invoice) }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  Invoice {{ invoice.invoiceNumber }}
                </p>
              </div>
              <span
                class="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
              >
                Due {{ formatDate(invoice.dueDate) }}
              </span>
            </div>
            <div class="mt-4 flex items-center justify-between gap-3">
              <div>
                <p class="text-xs uppercase tracking-wide text-gray-500">
                  Amount due
                </p>
                <p class="text-xl font-bold text-gray-700">
                  {{ formatCurrency(invoiceRemainingAmount(invoice)) }}
                </p>
              </div>
              <button
                @click="handlePayInvoice(invoice)"
                :disabled="processingInvoiceId === invoice.id"
                class="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Pay
              </button>
            </div>
          </article>
        </div>

        <EmptyState
          v-else
          icon="fa-regular fa-calendar-check"
          heading="No upcoming installments"
          description="There are no future installments scheduled at the moment."
        />
      </section>

      <section class="space-y-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-700">Payment Timeline</h2>
          <p class="text-sm text-gray-500">
            Your most recent payments, receipts, and settlement details.
          </p>
        </div>

        <div
          v-if="payments.length"
          class="rounded-xl bg-white p-4 shadow md:p-6"
        >
          <div class="space-y-6">
            <article
              v-for="payment in payments"
              :key="payment.id"
              class="relative pl-8"
            >
              <div class="absolute left-2 top-1 h-full w-px bg-gray-200"></div>
              <div
                class="absolute left-0 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 ring-4 ring-indigo-100"
              ></div>

              <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div
                  class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"
                >
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <h3 class="text-base font-semibold text-gray-700">
                        {{ paymentTitle(payment) }}
                      </h3>
                      <span
                        class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                        :class="paymentStatusChipClass(payment.status)"
                      >
                        {{ normalizeStatusLabel(payment.status) }}
                      </span>
                    </div>
                    <p class="mt-1 text-sm text-gray-500">
                      {{ formatDateTime(payment.createdAt) }}
                    </p>
                    <div
                      class="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-500 sm:grid-cols-2"
                    >
                      <p>Amount: {{ formatCurrency(payment.amount) }}</p>
                      <p>
                        Method:
                        {{ normalizePaymentMethod(payment.paymentMethod) }}
                      </p>
                      <p v-if="payment.studentName">
                        Student: {{ payment.studentName }}
                        {{ payment.studentSurname }}
                      </p>
                      <p v-if="payment.className">
                        Class: {{ payment.className }}
                      </p>
                    </div>
                  </div>

                  <div
                    class="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[200px]"
                  >
                    <button
                      v-if="canDownloadReceipt(payment)"
                      @click="downloadReceipt(payment)"
                      class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white"
                    >
                      Download receipt PDF
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        <EmptyState
          v-else
          icon="fa-solid fa-receipt"
          heading="No payment history yet"
          description="Completed payments and downloadable receipts will appear here."
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { apolloClient } from "../../../apollo-client";
import { initiatePayment } from "../../graphql/mutations";
import { getAllPayments, getMyInvoices } from "../../graphql/queries";
import { useNotificationStore } from "../../store/notification";
import { useUserStore } from "../../store/userStore";
import { formatDate } from "../../utils/date.holidays";
import EmptyState from "../emptyState.vue";
import LoadingScreen from "../loadingScreen.vue";

const notificationStore = useNotificationStore();
const userStore = useUserStore();

const loading = ref(false);
const processingInvoiceId = ref("");
const invoices = ref([]);
const payments = ref([]);

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const formatCurrency = (amount) =>
  currencyFormatter.format(Number(amount || 0));

const formatDateTime = (value) => {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const invoiceRemainingAmount = (invoice) =>
  Math.max(
    Number(invoice?.totalAmount || 0) - Number(invoice?.paidAmount || 0),
    0,
  );

const invoiceDueTime = (invoice) => new Date(invoice?.dueDate || 0).getTime();

const outstandingInvoices = computed(() =>
  [...invoices.value]
    .filter((invoice) => invoiceRemainingAmount(invoice) > 0)
    .sort((left, right) => invoiceDueTime(left) - invoiceDueTime(right)),
);

const overdueInvoices = computed(() =>
  outstandingInvoices.value.filter(
    (invoice) => invoiceDueTime(invoice) < Date.now(),
  ),
);

const upcomingInstallments = computed(() =>
  outstandingInvoices.value.filter(
    (invoice) => invoiceDueTime(invoice) >= Date.now(),
  ),
);

const totalOutstanding = computed(() =>
  outstandingInvoices.value.reduce((sum, invoice) => {
    return sum + invoiceRemainingAmount(invoice);
  }, 0),
);

const totalPaid = computed(() =>
  payments.value.reduce((sum, payment) => {
    if (String(payment?.status || "").toUpperCase() !== "COMPLETED") return sum;
    return sum + Number(payment?.amount || 0);
  }, 0),
);

const totalOverdueAmount = computed(() =>
  overdueInvoices.value.reduce((sum, invoice) => {
    return sum + invoiceRemainingAmount(invoice);
  }, 0),
);

const upcomingInstallmentsSummary = computed(() => {
  if (!upcomingInstallments.value.length) return "No future payments scheduled";
  if (upcomingInstallments.value.length === 1) {
    return `Next due ${formatDate(upcomingInstallments.value[0].dueDate)}`;
  }
  return `Next due ${formatDate(upcomingInstallments.value[0].dueDate)}`;
});

const invoiceMap = computed(() =>
  invoices.value.reduce((acc, invoice) => {
    acc[invoice.id] = invoice;
    return acc;
  }, {}),
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

const normalizePaymentMethod = (method) => {
  const value = String(method || "")
    .replace(/_/g, " ")
    .trim();
  if (!value) return "Online payment";
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const statusChipClass = (status) => {
  const value = String(status || "").toUpperCase();
  if (value === "PAID") return "bg-green-50 text-green-700 ring-green-600/20";
  if (value === "OVERDUE") return "bg-red-50 text-red-700 ring-red-600/10";
  if (value === "PARTIAL")
    return "bg-amber-50 text-amber-800 ring-amber-600/20";
  return "bg-blue-50 text-blue-700 ring-blue-600/20";
};

const paymentStatusChipClass = (status) => {
  const value = String(status || "").toUpperCase();
  if (value === "COMPLETED") {
    return "bg-green-50 text-green-700 ring-green-600/20";
  }
  if (value === "FAILED" || value === "CANCELLED") {
    return "bg-red-50 text-red-700 ring-red-600/10";
  }
  if (value === "REFUNDED") {
    return "bg-amber-50 text-amber-800 ring-amber-600/20";
  }
  return "bg-blue-50 text-blue-700 ring-blue-600/20";
};

const paymentTitle = (payment) => {
  const invoice = invoiceMap.value[payment?.invoiceId];
  if (invoice) return invoiceLabel(invoice);
  return payment?.feeType
    ? `${normalizeStatusLabel(payment.feeType)} fee`
    : "Fee payment";
};

const canDownloadReceipt = (payment) =>
  String(payment?.status || "").toUpperCase() === "COMPLETED";

const escapePdfText = (value) =>
  String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

const buildSimplePdf = (lines) => {
  const textCommands = lines
    .filter(Boolean)
    .map((line, index) => {
      const yPosition = 760 - index * 22;
      return `BT /F1 12 Tf 72 ${yPosition} Td (${escapePdfText(line)}) Tj ET`;
    })
    .join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${textCommands.length} >>\nstream\n${textCommands}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
};

const downloadReceipt = (payment) => {
  const invoice = invoiceMap.value[payment?.invoiceId];
  const schoolName = userStore.schoolInfo?.schoolName || "School";
  const parentName = [userStore.userInfo?.name, userStore.userInfo?.surname]
    .filter(Boolean)
    .join(" ");

  const lines = [
    `${schoolName} Payment Receipt`,
    "",
    `Receipt ID: ${payment.id}`,
    `Payment date: ${formatDateTime(payment.createdAt)}`,
    `Parent: ${parentName || "Parent"}`,
    `Student: ${[payment.studentName, payment.studentSurname].filter(Boolean).join(" ") || "N/A"}`,
    `Description: ${paymentTitle(payment)}`,
    `Invoice number: ${invoice?.invoiceNumber || payment.invoiceId || "N/A"}`,
    `Amount paid: ${formatCurrency(payment.amount)}`,
    `Payment method: ${normalizePaymentMethod(payment.paymentMethod)}`,
    `Invoice due date: ${invoice?.dueDate ? formatDate(invoice.dueDate) : "N/A"}`,
    `Status: ${normalizeStatusLabel(payment.status)}`,
  ];

  const blob = buildSimplePdf(lines);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `receipt-${payment.id}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};

const fetchBillingData = async () => {
  loading.value = true;

  const [invoiceResult, paymentResult] = await Promise.allSettled([
    apolloClient.query({
      query: getMyInvoices,
      variables: { params: { page: 1, limit: 1000 } },
      fetchPolicy: "network-only",
    }),
    apolloClient.query({
      query: getAllPayments,
      variables: { params: { page: 1, limit: 1000 } },
      fetchPolicy: "network-only",
    }),
  ]);

  if (invoiceResult.status === "fulfilled") {
    invoices.value = Array.isArray(invoiceResult.value?.data?.getMyInvoices)
      ? invoiceResult.value.data.getMyInvoices
      : [];
  } else {
    invoices.value = [];
    notificationStore.addNotification({
      type: "error",
      message: "Unable to load invoice balances.",
    });
  }

  if (paymentResult.status === "fulfilled") {
    payments.value = Array.isArray(paymentResult.value?.data?.getAllPayments)
      ? [...paymentResult.value.data.getAllPayments].sort(
          (left, right) =>
            new Date(right?.createdAt || 0).getTime() -
            new Date(left?.createdAt || 0).getTime(),
        )
      : [];
  } else {
    payments.value = [];
    notificationStore.addNotification({
      type: "error",
      message: "Unable to load payment history.",
    });
  }

  loading.value = false;
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
  void fetchBillingData();
});
</script>

<style scoped></style>
