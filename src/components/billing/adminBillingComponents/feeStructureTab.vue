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
        <div class="flex flex-col sm:flex-row justify-between mb-4 gap-3">
          <div class="flex flex-wrap gap-2">
            <div class="relative w-full sm:w-auto">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search fee structures..."
                class="pl-10 pr-4 block w-full h-[42px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              />
              <div class="absolute left-3 top-2.5 text-gray-400">
                <i class="fas fa-search"></i>
              </div>
            </div>
            <select
              v-model="academicYearFilter"
              class="block h-[42px] w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            >
              <option value="">All Academic Years</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
            </select>
            <select
              v-model="termFilter"
              class="block h-[42px] w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
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
            class="w-full sm:w-auto h-[42px] bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-md shadow-sm text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Create Fee Structure
          </button>
        </div>
        <div class="bg-white rounded-lg shadow overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Academic Year
                </th>
                <th
                  class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                >
                  Term
                </th>
                <th
                  class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Type
                </th>
                <th
                  class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Amount
                </th>
                <th
                  class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading">
                <td colspan="5" class="px-4 sm:px-6 py-4 text-center">
                  <div class="flex justify-center">
                    <div
                      class="animate-spin rounded-full h-6 w-6 border-b-2 border-eduPurple"
                    ></div>
                  </div>
                </td>
              </tr>
              <tr v-else-if="filteredFeeStructures.length === 0">
                <td colspan="5" class="px-4 sm:px-6 py-4 text-center text-gray-500">
                  No fee structures found
                </td>
              </tr>
              <tr
                v-for="fee in filteredFeeStructures"
                :key="fee.id"
                class="hover:bg-gray-50"
              >
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                  {{ fee.academicYear }}
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm hidden sm:table-cell">
                  {{ fee.term }}
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm hidden md:table-cell">
                  {{ fee.type }}
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                  <span class="font-medium"
                    >₦{{ formatCurrency(fee.totalAmount) }}</span
                  >
                </td>
                <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                  <div class="flex space-x-2">
                    <button
                      @click="viewFeeDetails(fee)"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      @click="editFeeStructure(fee)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      @click="confirmDeleteFee(fee)"
                      class="text-red-600 hover:text-red-900"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <Pagination />
    
      </div>
    </div>

    <!-- View Fee Details Modal -->
  
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
