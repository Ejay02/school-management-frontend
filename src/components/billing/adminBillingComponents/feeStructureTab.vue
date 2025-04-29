<template>
  <div class="">
    <div class="">
      <LoadingScreen message="Loading payments ... " v-if="loading" />

      <ErrorScreen :message="error" v-else-if="error" />

      <EmptyState
        v-else-if="!filteredFeeStructures.length"
        icon="fa-solid fa-money-bill"
        heading="Nothing here yet"
        description="Check back later for updates"
      />

      <div class="" v-else>
        <div class="flex justify-between mb-4">
          <div class="flex space-x-2">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search fee structures..."
                class="pl-10 pr-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
              <div class="absolute left-3 top-2.5 text-gray-400">
                <i class="fas fa-search"></i>
              </div>
            </div>
            <select
              v-model="academicYearFilter"
              class="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            >
              <option value="">All Academic Years</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
            </select>
            <select
              v-model="termFilter"
              class="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            >
              <option value="">All Terms</option>
              <option value="First">First Term</option>
              <option value="Second">Second Term</option>
              <option value="Third">Third Term</option>
            </select>
          </div>

          <!--  -->
          <button
            @click="showCreateFeeModal"
            class="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-md shadow-sm text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Create Fee Structure
          </button>
        </div>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Academic Year
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Term
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Amount
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
                <td colspan="5" class="px-6 py-4 text-center">
                  <div class="flex justify-center">
                    <div
                      class="animate-spin rounded-full h-6 w-6 border-b-2 border-eduPurple"
                    ></div>
                  </div>
                </td>
              </tr>
              <tr v-else-if="filteredFeeStructures.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                  No fee structures found
                </td>
              </tr>
              <tr
                v-for="fee in filteredFeeStructures"
                :key="fee.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ fee.academicYear }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">{{ fee.term }}</td>
                <td class="px-6 py-4 whitespace-nowrap">{{ fee.type }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="font-medium"
                    >₦{{ formatCurrency(fee.totalAmount) }}</span
                  >
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    @click="viewFeeDetails(fee)"
                    class="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    @click="editFeeStructure(fee)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="confirmDeleteFee(fee)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
          <!-- :currentPage="currentPage"
          :hasMore="feeStore.hasMore"
          :totalPages="feeStore.totalPages"
          @update:page="handlePageChange" -->
        <Pagination
        />
        <!-- <div class="flex justify-between items-center mt-4">
          <div class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ paginationStart }}</span> to
            <span class="font-medium">{{ paginationEnd }}</span> of
            <span class="font-medium">{{ totalFeeStructures }}</span> results
          </div>
          <div class="flex space-x-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              :class="[
                'px-3 py-1 rounded-md',
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50',
              ]"
            >
              Previous
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              :class="[
                'px-3 py-1 rounded-md',
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50',
              ]"
            >
              Next
            </button>
          </div>
        </div> -->
      </div>
    </div>

    <!-- Create/Edit Fee Structure Modal -->
    <!-- <div
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
    </div> -->

    <!-- View Fee Details Modal -->

    <div
      v-if="showFeeDetailsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <!-- Modal Header -->
        <div class="p-6 border-b flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-800">Fee Structure Details</h2>
          <button
            @click="showFeeDetailsModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6">
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p class="text-sm text-gray-500">Academic Year</p>
              <p class="font-medium">{{ selectedFee.academicYear }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Term</p>
              <p class="font-medium">{{ selectedFee.term }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Fee Type</p>
              <p class="font-medium">{{ selectedFee.type }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Amount</p>
              <p class="font-medium">
                ₦{{ formatCurrency(selectedFee.totalAmount) }}
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-4">
            <button
              @click="viewFeeDetails(selectedFee)"
              class="text-indigo-600 hover:text-indigo-900"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              @click="editFeeStructure(selectedFee)"
              class="text-blue-600 hover:text-blue-900"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              @click="confirmDeleteFee(selectedFee)"
              class="text-red-600 hover:text-red-900"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useModalStore } from "../../../store/useModalStore";
import EmptyState from "../../emptyState.vue";
import ErrorScreen from "../../errorScreen.vue";
import LoadingScreen from "../../loadingScreen.vue";
import Pagination from "../../pagination.vue";

const modalStore = useModalStore();

// Fee Structures Tab
const searchQuery = ref("");
const academicYearFilter = ref("");
const termFilter = ref("");
const loading = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;

const editingFee = ref(null);
const showFeeDetailsModal = ref(false);
const selectedFee = ref({});

const error = ref(false);

const showCreateFeeModal = () => {
   modalStore.data = {
    editing: false,
    feeForm: {
      academicYear: "2023-2024",
      term: "First",
      type: "Tuition",
      totalAmount: 0,
      components: [{ name: "", description: "", amount: 0 }],
      classId: ""
    }
  };

  // modalStore.data.editing = false;
  modalStore.createFeeStructureModal = true
};

// const editFeeStructure = (fee) => {
//   // Set up the form with the fee data
//   modalStore.data.feeForm = { ...fee };
//   modalStore.data.editing = true;
//   modalStore.openCreateFeeStructure();
// };

// // Fee Structure Form
// const feeForm = ref({
//   academicYear: "2023-2024",
//   term: "First",
//   type: "Tuition",
//   totalAmount: 0,
//   components: [{ name: "", description: "", amount: 0 }],
//   classId: "",
// });

// Dummy Data
const feeStructures = ref([
  {
    id: "1",
    academicYear: "2023-2024",
    term: "First",
    type: "Tuition",
    totalAmount: 250000,
    components: [
      {
        id: "1",
        name: "Tuition Fee",
        description: "Basic tuition fee",
        amount: 150000,
      },
      {
        id: "2",
        name: "Technology Fee",
        description: "Computer lab and internet",
        amount: 50000,
      },
      {
        id: "3",
        name: "Library Fee",
        description: "Library resources",
        amount: 25000,
      },
      {
        id: "4",
        name: "Sports Fee",
        description: "Sports equipment and facilities",
        amount: 25000,
      },
    ],
    classId: "1",
  },
  {
    id: "2",
    academicYear: "2023-2024",
    term: "Second",
    type: "Tuition",
    totalAmount: 250000,
    components: [
      {
        id: "1",
        name: "Tuition Fee",
        description: "Basic tuition fee",
        amount: 150000,
      },
      {
        id: "2",
        name: "Technology Fee",
        description: "Computer lab and internet",
        amount: 50000,
      },
      {
        id: "3",
        name: "Library Fee",
        description: "Library resources",
        amount: 25000,
      },
      {
        id: "4",
        name: "Sports Fee",
        description: "Sports equipment and facilities",
        amount: 25000,
      },
    ],
    classId: "1",
  },
  {
    id: "3",
    academicYear: "2023-2024",
    term: "Third",
    type: "Tuition",
    totalAmount: 250000,
    components: [
      {
        id: "1",
        name: "Tuition Fee",
        description: "Basic tuition fee",
        amount: 150000,
      },
      {
        id: "2",
        name: "Technology Fee",
        description: "Computer lab and internet",
        amount: 50000,
      },
      {
        id: "3",
        name: "Library Fee",
        description: "Library resources",
        amount: 25000,
      },
      {
        id: "4",
        name: "Sports Fee",
        description: "Sports equipment and facilities",
        amount: 25000,
      },
    ],
    classId: "1",
  },
  {
    id: "4",
    academicYear: "2023-2024",
    term: "First",
    type: "Boarding",
    totalAmount: 150000,
    components: [
      {
        id: "1",
        name: "Accommodation",
        description: "Dormitory fees",
        amount: 100000,
      },
      {
        id: "2",
        name: "Meals",
        description: "Food and catering",
        amount: 50000,
      },
    ],
    classId: "1",
  },
  {
    id: "5",
    academicYear: "2024-2025",
    term: "First",
    type: "Tuition",
    totalAmount: 275000,
    components: [
      {
        id: "1",
        name: "Tuition Fee",
        description: "Basic tuition fee",
        amount: 175000,
      },
      {
        id: "2",
        name: "Technology Fee",
        description: "Computer lab and internet",
        amount: 50000,
      },
      {
        id: "3",
        name: "Library Fee",
        description: "Library resources",
        amount: 25000,
      },
      {
        id: "4",
        name: "Sports Fee",
        description: "Sports equipment and facilities",
        amount: 25000,
      },
    ],
    classId: "1",
  },
]);

// Computed properties
const filteredFeeStructures = computed(() => {
  let filtered = feeStructures.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (fee) =>
        fee.academicYear.toLowerCase().includes(query) ||
        fee.term.toLowerCase().includes(query) ||
        fee.type.toLowerCase().includes(query)
    );
  }

  if (academicYearFilter.value) {
    filtered = filtered.filter(
      (fee) => fee.academicYear === academicYearFilter.value
    );
  }

  if (termFilter.value) {
    filtered = filtered.filter((fee) => fee.term === termFilter.value);
  }

  return filtered;
});

const totalFeeStructures = computed(() => filteredFeeStructures.value.length);

const paginatedFeeStructures = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredFeeStructures.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(filteredFeeStructures.value.length / itemsPerPage)
);

const paginationStart = computed(
  () => (currentPage.value - 1) * itemsPerPage + 1
);

const paginationEnd = computed(() =>
  Math.min(currentPage.value * itemsPerPage, totalFeeStructures.value)
);

// Methods
const formatCurrency = (value) => {
  return new Intl.NumberFormat().format(value);
};

const viewFeeDetails = (fee) => {
  selectedFee.value = { ...fee };
  showFeeDetailsModal.value = true;
};

// const editFeeStructure = (fee) => {
//   editingFee.value = fee;
//   feeForm.value = {
//     academicYear: fee.academicYear,
//     term: fee.term,
//     type: fee.type,
//     totalAmount: fee.totalAmount,
//     components: [...fee.components],
//     classId: fee.classId,
//   };
//   showCreateFeeModal.value = true;
// };

const saveFeeStructure = () => {
  // Implement save fee structure logic
  console.log("Save fee structure", feeForm.value);
  showCreateFeeModal.value = false;
  editingFee.value = null;
};

const confirmDeleteFee = (fee) => {
  if (
    confirm(
      `Are you sure you want to delete the fee structure for ${fee.academicYear} ${fee.term}?`
    )
  ) {
    // Implement delete fee structure logic
    console.log("Delete fee structure", fee);
  }
};

onMounted(() => {
  // Fetch data from API
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>
