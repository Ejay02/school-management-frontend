<template>
  <div class="bg-eduYellowLight rounded-lg p-6 w-full">
    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-gray-200 rounded-lg shadow p-4">
        <div class="flex items-center">
          <i class="fa-solid fa-dollar-sign text-2xl text-green-600"></i>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Total Outstanding</p>
            <p class="text-2xl font-bold text-gray-500">$5,799.98</p>
          </div>
        </div>
      </div>
      <div class="bg-gray-200 rounded-lg shadow p-4">
        <div class="flex items-center">
          <i class="fa-solid fa-receipt text-2xl text-blue-600"></i>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Last Payment</p>
            <p class="text-2xl font-bold text-gray-500">$2,999.99</p>
          </div>
        </div>
      </div>
      <div class="bg-gray-200 rounded-lg shadow p-4">
        <div class="flex items-center">
          <i class="fa-solid fa-credit-card text-2xl text-purple-600"></i>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Payment Methods</p>
            <p class="text-2xl font-bold text-gray-500">
              {{ paymentMethods.length }} Active
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Outstanding Fees Per Child -->
    <div v-for="child in children" :key="child.id" class="mb-8">
      <div class="bg-gray-200 rounded-lg shadow p-6">
        <div
          class="flex justify-between items-center mb-6 border-b border-gray-300 pb-4"
        >
          <div>
            <h3 class="text-xl font-bold text-gray-600">{{ child.name }}</h3>
            <p class="text-sm text-gray-500">
              {{ child.class }} - {{ child.plan }}
            </p>
          </div>
          <button
            @click="handleRedirectToStripe"
            class="px-4 py-2 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-colors"
          >
            Pay Full Year (${{ child.yearlyFee }})
          </button>
        </div>

        <!-- Term Selection Tabs -->
        <div class="mb-6">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
              <button
                v-for="tab in ['Current Term', 'Upcoming Terms']"
                :key="tab"
                @click="selectedTab = tab"
                :class="[
                  selectedTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                ]"
              >
                {{ tab }}
              </button>
            </nav>
          </div>
        </div>

        <!-- Current Term Content -->
        <div
          v-if="selectedTab === 'Current Term'"
          v-for="fee in child.currentTermFees"
          :key="fee.term"
        >
          <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h4 class="text-lg font-semibold text-gray-600">
                  {{ fee.term }}
                </h4>
                <p class="text-sm text-gray-500">Due: {{ fee.dueDate }}</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-gray-600">
                  ${{ fee.amount }}
                </p>
                <p v-if="fee.progress > 0" class="text-sm text-gray-600">
                  ${{ ((fee.amount * fee.progress) / 100).toFixed(2) }} paid
                </p>
              </div>
            </div>

            <!-- Payment Progress -->
            <div class="mb-4">
              <p class="text-sm font-medium mb-2 text-gray-600">
                Payment Progress
              </p>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 cursor-pointer h-2 rounded-full"
                  :style="{ width: fee.progress + '%' }"
                ></div>
              </div>
            </div>

            <!-- Fee Breakdown -->
            <div class="bg-white p-4 rounded-lg mb-4">
              <h5 class="font-medium mb-2 text-gray-600">Fee Breakdown</h5>
              <div class="space-y-2 text-gray-500">
                <div
                  v-for="(amount, type) in fee.breakdown"
                  :key="type"
                  class="flex justify-between"
                >
                  <span class="text-gray-500">{{
                    type.charAt(0).toUpperCase() + type.slice(1)
                  }}</span>
                  <span>${{ amount }}</span>
                </div>
              </div>
            </div>

            <!-- Payment Actions -->
            <div class="flex space-x-4">
              <button
                class="flex-1 px-4 py-2 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg 0 transition-colors"
              >
                Pay Full Term
              </button>
              <button
                class="flex-1 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Setup Payment Plan
              </button>
            </div>
          </div>
        </div>

        <!-- Upcoming Terms Content -->
        <div v-if="selectedTab === 'Upcoming Terms'">
          <div v-if="child.upcomingTermFees.length > 0">
            <div
              v-for="fee in child.upcomingTermFees"
              :key="fee.term"
              class="bg-gray-50 rounded-lg p-4 mb-4 text-gray-600"
            >
              <div class="flex justify-between items-center">
                <div>
                  <h4 class="text-lg font-semibold">{{ fee.term }}</h4>
                  <p class="text-sm text-gray-500">Due: {{ fee.dueDate }}</p>
                </div>
                <p class="text-2xl font-bold">${{ fee.amount }}</p>
              </div>
            </div>
          </div>

          <!-- empty state -->
          <EmptyState
            v-else
            icon="fa-regular fa-calendar-check"
            heading="You're All Set!"
            description="No more upcoming fees for this academic year"
          />
        </div>
      </div>
    </div>

    <!--  -->

    <!-- Payment Methods Section-->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-600">Payment Methods</h2>
        <button
          @click="showAddCard = true"
          class="mt-4 px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg focus:outline-none focus:ring-indigo-500 transition-colors"
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

    <!-- Payment History -->
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
              class="mt-4 px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
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
import { loadStripe } from "@stripe/stripe-js";
import Pagination from "../pagination.vue";
import EmptyState from "../emptyState.vue";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const selectedTab = ref("Current Term");

const children = ref([
  {
    id: 1,
    name: "John Smith",
    class: "6A",
    plan: "Primary 6",
    yearlyFee: 8999.97,
    currentTermFees: [
      {
        term: "Term 2",
        amount: 2999.99,
        dueDate: "2024-02-28",
        breakdown: {
          tuition: 2500,
          activities: 299.99,
          materials: 200,
        },
        progress: 0,
      },
    ],
    upcomingTermFees: [
      {
        term: "Term 3",
        amount: 2999.99,
        dueDate: "2024-05-15",
      },
    ],
  },
  {
    id: 2,
    name: "Sarah Smith",
    class: "4B",
    plan: "Primary 4",
    yearlyFee: 6399.97,
    currentTermFees: [
      {
        term: "Term 2",
        amount: 2799.99,
        dueDate: "2024-02-28",
        breakdown: {
          tuition: 2300,
          activities: 299.99,
          materials: 200,
        },
        progress: 50,
      },
    ],
    upcomingTermFees: [],
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

const handleRedirectToStripe = () => {
  const stripeCheckoutUrl =
    "https://checkout.stripe.com/c/pay/cs_test_a1ZMXJcXU4VYu4UTh8ZXoIh7BOb7hoXiSlpvn4Ugb9YTl7o6z1PW4jip6U#fidkdWxOYHwnPyd1blpxYHZxWjA0TWFyNkJGMT0yb3ZSMGdgd2lzNl9gTX9Nb0dfSEpWSEJIfUJuMU0yV0l8XVxzN3Zdb2pOdVM1Z2BgPWlVYDJGTWByf3ZhdkNxa1dMXG1RZHNQT2t3N1FVNTV3a3xfZn1tSicpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl";
  window.location.href = stripeCheckoutUrl;
};
</script>

<style scoped></style>
