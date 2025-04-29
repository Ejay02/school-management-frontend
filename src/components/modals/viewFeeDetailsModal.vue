<template>
  <transition name="fade">
        <div
      v-if="isModalVisible"
      class="fixed top-0 left-0 w-full h-full bg-gray-900/80 flex justify-center items-center z-50"
      @click.self="handleCancel"
      :key="isModalVisible"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <!-- Modal Header -->
        <div class="p-4 sm:p-6 border-b flex justify-between items-center">
          <h2 class="text-lg sm:text-xl font-bold text-gray-800">Fee Structure Details</h2>
          <button
            @click="showFeeDetailsModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-4 sm:p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
  </transition>
</template>

<script setup></script>
