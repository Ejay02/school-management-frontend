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
      <FeeStructureTab />
    </div>

    <!-- Payments Tab -->
    <div v-if="activeTab === 'payments'">
      <PaymentsTab />
    </div>

    <!-- Reports Tab -->
    <div v-if="activeTab === 'reports'">
      <ReportsTab />
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
import { ref } from "vue";
import FeeStructureTab from "./adminBillingComponents/feeStructureTab.vue";
import PaymentsTab from "./adminBillingComponents/paymentsTab.vue";
import ReportsTab from "./adminBillingComponents/reportsTab.vue";

// Active tab state
const activeTab = ref("feeStructures");

const showCreateFeeModal = ref(false);
const editingFee = ref(null);

// Fee Structure Form
const feeForm = ref({
  academicYear: "2023-2024",
  term: "First",
  type: "Tuition",
  totalAmount: 0,
  components: [{ name: "", description: "", amount: 0 }],
  classId: "",
});

const classes = ref([
  { id: "1", name: "Primary 6" },
  { id: "2", name: "JSS 1" },
  { id: "3", name: "JSS 2" },
  { id: "4", name: "JSS 3" },
]);

// Reports Tab Data

const saveFeeStructure = () => {
  // Implement save fee structure logic
  console.log("Save fee structure", feeForm.value);
  showCreateFeeModal.value = false;
  editingFee.value = null;
};
</script>
