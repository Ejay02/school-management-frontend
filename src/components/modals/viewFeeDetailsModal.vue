<template>
  <transition name="fade">
    <div
      v-if="isModalVisible"
      class="fixed top-0 left-0 w-full h-full bg-gray-900/80 flex justify-center items-center z-50 p-4"
      @click.self="handleCancel"
      :key="isModalVisible"
    >
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-all duration-300 transform"
      >
        <!-- Modal Header with gradient background -->
        <div class="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 p-5 rounded-t-xl flex justify-between items-center">
          <h2 class="text-xl font-bold text-white">
            Fee Structure Details
          </h2>
          <button
            @click="handleCancel"
            class="text-white hover:text-gray-200 transition-colors duration-200 h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/20"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6">
          <div v-if="feeStructureStore.loading" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-indigo-600"></div>
          </div>
          
          <div v-else-if="feeStructureStore.error" class="text-red-500 text-center py-8 bg-red-50 rounded-lg p-4">
            <i class="fas fa-exclamation-circle mr-2"></i>
            {{ feeStructureStore.error }}
          </div>
          
          <div v-else class="space-y-8">
            <!-- Summary Card -->
            <div class="cursor-pointer bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <p class="text-sm text-gray-500 font-medium">Academic Year</p>
                  <p class="text-lg font-semibold text-gray-800">{{ selectedFee?.academicYear }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm text-gray-500 font-medium">Term</p>
                  <p class="text-lg font-semibold text-gray-800">{{ selectedFee?.term ?? "NA" }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm text-gray-500 font-medium">Fee Type</p>
                  <p class="text-lg font-semibold text-gray-800">{{ selectedFee?.type ?? "NA" }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm text-gray-500 font-medium">Total Amount</p>
                  <p class="text-xl font-bold text-indigo-600">
                    ₦{{ formatCurrency(selectedFee?.totalAmount) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Fee Components Section -->
            <div class="space-y-4 cursor-pointer">
              <div class="flex items-center">
                <h3 class="text-lg font-semibold text-gray-800">Fee Components</h3>
                <div class="ml-3 h-px flex-grow bg-gray-200"></div>
              </div>
              
              <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div v-if="selectedFee?.components && selectedFee.components.length > 0">
                  <div v-for="(component, index) in selectedFee.components" :key="index" 
                       class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-150">
                    <div class="flex justify-between p-4">
                      <div>
                        <p class="font-medium text-gray-800">{{ component.name }}</p>
                        <p class="text-sm text-gray-500 mt-1">{{ component.description }}</p>
                      </div>
                      <p class="font-semibold text-indigo-600">₦{{ formatCurrency(component.amount) }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="p-8 text-center">
                  <div class="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <i class="fas fa-file-invoice-dollar text-gray-400 text-xl"></i>
                  </div>
                  <p class="text-gray-500">No components available</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end pt-4">
              <button
                @click="editFeeStructure"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <i class="fas fa-edit mr-2"></i> Edit Fee Structure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from "vue";
import { useModalStore } from "../../store/useModalStore";
import { useFeeStructureStore } from "../../store/feeStructureStore";

const modalStore = useModalStore();
const feeStructureStore = useFeeStructureStore();

const isModalVisible = computed(() => modalStore.viewFeeDetailsModal);
const selectedFee = computed(() => modalStore.data);

const handleCancel = () => {
  modalStore.viewFeeDetailsModal = false;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat().format(value || 0);
};

const editFeeStructure = () => {
  // Set up data for edit modal
  modalStore.data = {
    editing: true,
    feeForm: { ...selectedFee.value },
  };
  
  // Close this modal and open the edit modal
  modalStore.viewFeeDetailsModal = false;
  modalStore.createFeeStructureModal = true;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
