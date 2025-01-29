<template>
  <div class="bg-eduYellowLight rounded-lg p-6 w-full">
    <!-- Current Term Fees -->
    <h2 class="text-2xl font-bold text-gray-600 text-center mb-4">
      School Fees Management
    </h2>
    <div class="mb-8">
      <div class="bg-gray-100 rounded-lg shadow p-6">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-600">
              {{ studentFees.ward }} -
              <span class="text-gray-500">
                {{ studentFees.plan }}
              </span>
            </h3>
            <p class="text-gray-600">
              Class :
              <span class="text-gray-500"> {{ studentFees.class }}</span>
            </p>
            <p class="text-gray-500">
              Next payment due :

              <span
                class="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-purple-700/10 ring-inset"
                >{{ studentFees.nextPayment }}</span
              >
            </p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-gray-600">
              ${{ studentFees.termFee }}
            </p>

            <span
              class="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
              :class="{
                'bg-green-50 text-green-700 ring-green-600/20 ':
                  studentFees.status === 'current',
                'bg-yellow-50 text-yellow-800 ring-yellow-600/20':
                  studentFees.status === 'pending',
                'bg-red-50 text-red-700 ring-red-600/10':
                  studentFees.status === 'overdue',
              }"
            >
              {{
                studentFees.status.charAt(0).toUpperCase() +
                studentFees.status.slice(1)
              }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Methods -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-600">Payment Methods</h2>
        <button
          @click="showAddCard = true"
          class="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-indigo-500 transition-colors"
        >
          <i class="fa-solid fa-plus"></i>
          Add Payment Method
        </button>
      </div>

      <!-- Payment Methods List -->
      <div class="bg-gray-100 rounded-lg shadow">
        <ul class="divide-y divide-gray-200">
          <li v-for="method in paymentMethods" :key="method.id" class="p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <i class="fa-regular fa-credit-card"></i>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">
                    {{ method.brand }} ending in {{ method.last4 }}
                  </p>
                  <p class="text-sm text-gray-500">
                    Expires
                    <span
                      class="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-purple-700/10 ring-inset"
                    >
                      {{ method.expiryMonth }}/{{ method.expiryYear }}
                    </span>
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

    <!-- Fee Payment History -->
    <div>
      <h2 class="text-2xl font-bold text-gray-600 mb-4">Payment History</h2>
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Invoice #
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
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
          <tbody class="bg-gray-100 divide-y divide-gray-200">
            <tr v-for="payment in feeHistory" :key="payment.id">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600"
              >
                {{ payment.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ payment.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ payment.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                ${{ payment.amount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <!--   px-2 py-1 text-xs font-medium text-gray-600 " -->
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset"
                  :class="{
                    'bg-green-50 text-green-700 ring-green-600/20':
                      payment.status === 'paid',
                    'bg-yellow-50 text-yellow-800 ring-yellow-600/20':
                      payment.status === 'pending',
                    'bg-red-50 text-red-700 ring-red-600/10':
                      payment.status === 'overdue',
                  }"
                >
                  {{
                    payment.status.charAt(0).toUpperCase() +
                    payment.status.slice(1)
                  }}
                </span>
              </td>
              <td
                class="px-14 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <a
                  :href="payment.downloadUrl"
                  class="text-indigo-500 hover:text-eduPurple"
                >
                  <i class="fa-solid fa-download"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <Pagination />
      </div>
    </div>

    <!-- Add Payment Method Modal -->
    <div
      v-if="showAddCard"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-600 mb-4 text-center">
          Add Payment Method
        </h3>
        <form @submit.prevent="addNewCard">
          <div class="space-y-4">
            <div>
              <label
                for="cardNumber"
                class="block text-sm font-medium text-gray-500"
                >Card Number</label
              >
              <input
                v-model="newCard.number"
                type="text"
                required
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <!--  -->

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >Expiry Date</label
                >
                <input
                  v-model="newCard.expiry"
                  type="text"
                  required
                  class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500"
                  >CVC</label
                >
                <input
                  v-model="newCard.cvc"
                  type="text"
                  required
                  class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                  placeholder="123"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500"
                >Name on Card</label
              >
              <input
                v-model="newCard.name"
                type="text"
                required
                class="cursor-pointer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-eduPurple sm:text-sm/6"
                placeholder="John Doe"
              />
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="showAddCard = false"
              class="px-4 py-2 mt-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isProcessing"
              class="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              {{ isProcessing ? "Processing..." : "Add Card" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Pagination from "../pagination.vue";

const studentFees = ref({
  plan: "Primary 6",
  status: "current",
  nextPayment: "2024-02-28",
  termFee: 2999.99,
  ward: "John Smith",
  class: "6A",
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

const feeHistory = ref([
  {
    id: "FEE-001",
    date: "2024-01-28",
    description: "Term 2 School Fees",
    amount: 2999.99,
    status: "paid",
    downloadUrl: "#",
  },
  {
    id: "FEE-002",
    date: "2023-12-28",
    description: "Term 1 School Fees",
    amount: 2999.99,
    status: "pending",
    downloadUrl: "#",
  },
  {
    id: "FEE-003",
    date: "2023-09-15",
    description: "Term 3 School Fees",
    amount: 2999.99,
    status: "overdue",
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
