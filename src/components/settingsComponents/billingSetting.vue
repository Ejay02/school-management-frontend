<template>
  <div class="bg-white rounded-lg p-6 w-full">
    <!-- Current Subscription -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-800 text-center mb-4">Subscription</h2>
      <div class="bg-eduYellowLight rounded-lg shadow p-6">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ subscription.plan }} Plan
            </h3>
            <p class="text-gray-600">
              Next billing date: {{ subscription.nextBilling }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-gray-900">
              ${{ subscription.amount }}/mo
            </p>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="{
                'bg-green-100 text-green-800': subscription.status === 'active',
                'bg-yellow-100 text-yellow-800':
                  subscription.status === 'pending',
                'bg-red-100 text-red-800': subscription.status === 'cancelled',
              }"
            >
              {{
                subscription.status.charAt(0).toUpperCase() +
                subscription.status.slice(1)
              }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Methods -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-900">Payment Methods</h2>
        <button
          @click="showAddCard = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <i class="fa-solid fa-plus"></i>
          Add Payment Method
        </button>
      </div>

      <!-- Payment Methods List -->
      <div class="bg-white rounded-lg shadow">
        <ul class="divide-y divide-gray-200">
          <li v-for="method in paymentMethods" :key="method.id" class="p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <i class="fa-regular fa-credit-card"></i>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">
                    {{ method.brand }} ending in {{ method.last4 }}
                  </p>
                  <p class="text-sm text-gray-500">
                    Expires {{ method.expiryMonth }}/{{ method.expiryYear }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <button
                  v-if="!method.isDefault"
                  @click="setDefaultPaymentMethod(method.id)"
                  class="text-sm text-blue-600 hover:text-blue-800"
                >
                  Make Default
                </button>
                <span v-else class="text-sm text-green-600 font-medium"
                  >Default</span
                >
                <button
                  v-if="!method.isDefault"
                  @click="removePaymentMethod(method.id)"
                  class="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Billing History -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Billing History</h2>
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Invoice
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Download
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="invoice in billingHistory" :key="invoice.id">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ invoice.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ invoice.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${{ invoice.amount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800': invoice.status === 'paid',
                    'bg-yellow-100 text-yellow-800':
                      invoice.status === 'pending',
                    'bg-red-100 text-red-800': invoice.status === 'failed',
                  }"
                >
                  {{
                    invoice.status.charAt(0).toUpperCase() +
                    invoice.status.slice(1)
                  }}
                </span>
              </td>
              <td
                class="px-14 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <a
                  :href="invoice.downloadUrl"
                  class="text-indigo-600 hover:text-eduPurple"
                >
                  <i class="fa-solid fa-download"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Payment Method Modal -->
    <div
      v-if="showAddCard"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Add Payment Method
        </h3>
        <form @submit.prevent="addNewCard">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Card Number</label
              >
              <input
                v-model="newCard.number"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Expiry Date</label
                >
                <input
                  v-model="newCard.expiry"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >CVC</label
                >
                <input
                  v-model="newCard.cvc"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="123"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Name on Card</label
              >
              <input
                v-model="newCard.name"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="showAddCard = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isProcessing"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span v-if="isProcessing">Processing...</span>
              <span v-else>Add Card</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
// import { CreditCard, Plus, AlertCircle } from "lucide-react";

const subscription = ref({
  plan: "Professional",
  status: "active",
  nextBilling: "2024-02-28",
  amount: 29.99,
});

const paymentMethods = ref([
  {
    id: 1,
    last4: "4242",
    brand: "Visa",
    expiryMonth: "12",
    expiryYear: "2025",
    isDefault: true,
  },
]);

const billingHistory = ref([
  {
    id: "INV-001",
    date: "2024-01-28",
    amount: 29.99,
    status: "paid",
    downloadUrl: "#",
  },
  {
    id: "INV-002",
    date: "2023-12-28",
    amount: 29.99,
    status: "pending",
    downloadUrl: "#",
  },
  {
    id: "INV-003",
    date: "2023-12-28",
    amount: 29.99,
    status: "failed",
    downloadUrl: "#",
  },
]);

const showAddCard = ref(false);
const isProcessing = ref(false);

const newCard = ref({
  number: "",
  expiry: "",
  cvc: "",
  name: "",
});

const addNewCard = async () => {
  try {
    isProcessing.value = true;
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Add new card to list
    paymentMethods.value.push({
      id: paymentMethods.value.length + 1,
      last4: newCard.value.number.slice(-4),
      brand: "Visa",
      expiryMonth: newCard.value.expiry.split("/")[0],
      expiryYear: "20" + newCard.value.expiry.split("/")[1],
      isDefault: false,
    });

    showAddCard.value = false;
    newCard.value = { number: "", expiry: "", cvc: "", name: "" };
  } catch (error) {
    console.error("Error adding card:", error);
  } finally {
    isProcessing.value = false;
  }
};

const setDefaultPaymentMethod = (id) => {
  paymentMethods.value = paymentMethods.value.map((method) => ({
    ...method,
    isDefault: method.id === id,
  }));
};

const removePaymentMethod = (id) => {
  paymentMethods.value = paymentMethods.value.filter(
    (method) => method.id !== id
  );
};
</script>

<style scoped></style>
