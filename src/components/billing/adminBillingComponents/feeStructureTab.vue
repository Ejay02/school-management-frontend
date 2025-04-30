<template>
  <div class="">
    <div class="">
      <div class="">
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
            <option v-for="year in academicYearOptions" :key="year" :value="year">
              {{ year }}
            </option>
            </select>
            <select
              v-model="termFilter"
              class="block h-[42px] w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
            >
              <option value="">All Terms</option>
              <option v-for="option in termOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
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

        <LoadingScreen
          message="Loading fees structure... "
          v-if="feeStructureStore.loading"
        />

        <ErrorScreen
          :message="feeStructureStore.error"
          v-else-if="feeStructureStore.error"
        />

        <EmptyState
          v-else-if="!filteredFeeStructures.length"
          icon="fa-solid fa-money-bill"
          heading="Nothing here yet"
          description="Check back later for updates"
        />

        <div class="bg-white rounded-lg shadow overflow-x-auto" v-else>
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
                class
                  <!-- Term -->
                </th>
                <th
                  class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  <!-- Type -->
                   Term
                </th>
                <th
                  class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Description
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
              <tr v-if="feeStructureStore.loading">
                <td colspan="5" class="px-4 sm:px-6 py-4 text-center">
                  <div class="flex justify-center">
                    <div
                      class="animate-spin rounded-full h-6 w-6 border-b-2 border-eduPurple"
                    ></div>
                  </div>
                </td>
              </tr>
              <tr v-else-if="filteredFeeStructures.length === 0">
                <td
                  colspan="5"
                  class="px-4 sm:px-6 py-4 text-center text-gray-500"
                >
                  No fee structures found
                </td>
              </tr>
              <tr
                 v-for="fee in paginatedFeeStructures"
                :key="fee?.id"
                class="hover:bg-gray-50"
              >
                <td
                  class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm"
                >
                  {{ fee?.academicYear }}
                </td>
                <td
                  class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm hidden sm:table-cell"
                >
                {{ fee?.classes?.[0]?.name || 'N/A' }}
                </td>
                <td
                  class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm hidden md:table-cell"
                >
                  {{ fee?.type ?? fee?.term  }}
                </td>
                <td
                  class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm hidden md:table-cell"
                >
                  {{ fee?.description ?? "NA" }}
                </td>
                <td
                  class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm"
                >
                
                  <span class="font-medium"
                    >${{ fee?.totalAmount }}</span
                  >
                </td>
                <td
                  class="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm"
                >
                  <div class="flex space-x-2">
                
                    <div class="group relative">
                      <button
                        @click="showViewDetailsModal(fee)"
                      class="group relative text-indigo-600 hover:bg-eduSkyLight px-3 py-1 rounded-md text-sm transition duration-300"
                    >
                      <i class="fa-solid fa-arrow-right"></i>
                    </button>
                    <span
                      class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex"
                    >
                      View
                    </span>
                    </div>
                  
                  
                    <button
                   
                    @click="showDelModal(fee.id, fee.description, 'feeStructure')"
                    class="group relative w-6 h-6 flex items-center justify-center rounded-full"
                  >
                    <i class="fa-solid fa-trash-can text-red-600 text-xs"></i>
                    <span
                      class="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    >
                      Delete
                    </span>
                  </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <Pagination
          :currentPage="currentPage"
          :hasMore="hasMore"
          :totalPages="totalPages"
          @update:page="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useFeeStructureStore } from "../../../store/feeStructureStore";
import { useModalStore } from "../../../store/useModalStore";
import EmptyState from "../../emptyState.vue";
import ErrorScreen from "../../errorScreen.vue";
import LoadingScreen from "../../loadingScreen.vue";
import Pagination from "../../pagination.vue";
import { termOptions } from "../../../utils/utility";

const modalStore = useModalStore();
const feeStructureStore = useFeeStructureStore();

// Fee Structures Tab
const searchQuery = ref("");
const academicYearFilter = ref("");
const termFilter = ref("");

const currentPage = ref(1);
const itemsPerPage = 10;

function handlePageChange(newPage) {
  currentPage.value = newPage;
}



const showDelModal = (id, title, type) => {
  modalStore.deleteModal = true;
  modalStore.modalId = id;
  modalStore.modalTitle = title;
  modalStore.source = type;
};

const showViewDetailsModal = (fee) => {
  // Set the selected fee in the modal store for the viewFeeDetailsModal to access
  modalStore.data = fee;
  modalStore.viewFeeDetailsModal = true;
};

const showCreateFeeModal = () => {
  modalStore.data = {
    editing: false,
    feeForm: {
      academicYear: "2023-2024",
      term: "First",
      type: "Tuition",
      totalAmount: 0,
      components: [{ name: "", description: "", amount: 0 }],
      classId: "",
    },
  };

  modalStore.createFeeStructureModal = true;
};

// Computed properties
const filteredFeeStructures = computed(() => {
  // Start with all fee structures instead of just the paginated ones
  let filtered = feeStructureStore.allFeeStructures;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (fee) =>
        (fee?.academicYear?.toLowerCase() || '').includes(query) ||
        (fee?.term?.toLowerCase() || '').includes(query) ||
        (fee?.type?.toLowerCase() || '').includes(query) ||
        (fee?.description?.toLowerCase() || '').includes(query) ||
        (fee?.classes?.[0]?.name?.toLowerCase() || '').includes(query)
    );
  }
  if (academicYearFilter.value) {
    // Convert the filter value from hyphen format to slash format
    const formattedFilter = academicYearFilter.value.replace('-', '/');
    filtered = filtered.filter(
      (fee) => fee?.academicYear === formattedFilter
    );
  }

  if (termFilter.value) {
    filtered = filtered.filter((fee) => fee?.term === termFilter.value);
  }

  return filtered;
});

// Generate academic year options dynamically based on academic calendar (Sept-Aug)
const academicYearOptions = computed(() => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11 (Jan-Dec)
  const currentYear = currentDate.getFullYear();
  const years = [];

  // Previous academic year
  years.push(`${currentYear - 1}-${currentYear}`);

  // Current academic year
  // If we're in Sept-Dec, the academic year is currentYear to currentYear+1
  // If we're in Jan-Aug, the academic year is currentYear-1 to currentYear
  const isNewAcademicYear = currentMonth >= 8; // September (0-indexed, so 8)

  if (isNewAcademicYear) {
    // Sept-Dec: current academic year is this year to next year
    years.push(`${currentYear}-${currentYear + 1}`);
    // Next academic year
    years.push(`${currentYear + 1}-${currentYear + 2}`);
  } else {
    // Jan-Aug: current academic year is previous year to this year
    years.push(`${currentYear - 1}-${currentYear}`);
    // Next academic year
    years.push(`${currentYear}-${currentYear + 1}`);
  }

  // Remove duplicates
  return [...new Set(years)];
});


// Add this computed property for paginated results
const paginatedFeeStructures = computed(() => {
const start = (currentPage.value - 1) * itemsPerPage;
const end = start + itemsPerPage;
return filteredFeeStructures.value.slice(start, end);
});

// Update the totalPages computation
const totalPages = computed(() => {
return Math.ceil(filteredFeeStructures.value.length / itemsPerPage);
});

// Update the hasMore computation
const hasMore = computed(() => {
return currentPage.value < totalPages.value;
});

// Watch for filter changes to refresh the data
watch([searchQuery, academicYearFilter, termFilter], () => {
  currentPage.value = 1; // Reset to first page when filters change
});



onMounted(() => {
  // Fetch data from API when component mounts
  feeStructureStore.fetchFeeStructures({
    page: currentPage.value,
    limit: itemsPerPage,
  });
});

</script>
