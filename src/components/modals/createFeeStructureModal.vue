<template>
  <transition name="fade">
    <div
      v-if="isModalVisible"
      class="fixed top-0 left-0 w-full h-full bg-gray-900/80 flex justify-center items-center z-50"
      @click.self="handleCancel"
      :key="isModalVisible"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div
          class="p-6 border-b bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 relative"
        >
        <div class="absolute inset-0 pattern-dots opacity-10"></div>
          <h2 class="text-xl font-bold text-gray-800">
            {{
              modalStore.data.editing
                ? "Edit Fee Structure"
                : "Create Fee Structure"
            }}
          </h2>
        </div>
        <div class="p-6">
          <form @submit.prevent="">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <!-- Academic Year -->
              <div>
                <label
                  for="academicYear"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Academic Year <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="modalStore.data.feeForm.academicYear"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                >
                  <option
                    v-for="year in academicYearOptions"
                    :key="year"
                    :value="year"
                  >
                    {{ year }}
                  </option>
                </select>
              </div>

              <!-- Fee Type Selection (YEARLY or TERM) -->
              <div>
                <label
                  for="feeType"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Fee Type <span class="text-red-500">*</span></label
                >
                <select
                  v-model="modalStore.data.feeForm.type"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                  @change="handleFeeTypeChange"
                >
                  <option
                    v-for="option in feeTypeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <!-- Term Selection (only shown if Fee Type is TERM) -->
              <div v-if="modalStore.data.feeForm.type === 'TERM'">
                <label
                  for="term"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Term <span class="text-red-500">*</span></label
                >
                <select
                  v-model="modalStore.data.feeForm.term"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                >
                  <option
                    v-for="option in termOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <!-- Fee Description -->
              <div>
                <label
                  for="feeDescription"
                  class="block text-sm font-medium text-gray-700 mb-1"
                  >Fee Description <span class="text-red-500">*</span></label
                >
                <select
                  v-model="modalStore.data.feeForm.description"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                >
                  <option
                    v-for="option in feeDescriptionOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <!-- Class Selection -->

              <Dropdown
                v-model="selectedClass"
                label="Select Class <span class='text-red-500'>*</span>"
                :options="classOptions"
                emptyLabel="Select a class"
              />
            </div>

            <!-- Fee Components -->
            <div class="mb-4">
              <h3 class="text-lg font-medium text-gray-800 mb-2">
                Fee Components
              </h3>
              <div
                v-for="(component, index) in modalStore.data.feeForm.components"
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
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
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
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                      placeholder="e.g. Basic tuition fee"
                    />
                  </div>
                  <div>
                    <label
                      for="amount"
                      class="block text-sm font-medium text-gray-700 mb-1"
                      >Amount ($)</label
                    >
                    <input
                      type="number"
                      v-model.number="component.amount"
                      required
                      min="0"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                    />
                  </div>
                </div>
                <button
                  v-if="modalStore.data.feeForm.components.length > 1"
                  @click="modalStore.data.feeForm.components.splice(index, 1)"
                  type="button"
                  class="mt-2 text-red-600 hover:text-red-800 text-sm"
                >
                  <i class="fas fa-trash mr-1"></i> Remove Component
                </button>
              </div>
              <button
                @click="
                  modalStore.data.feeForm.components.push({
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

              <!-- Total Amount Display -->
              <div class="mt-4 p-4 border rounded-lg bg-gray-50">
                <div class="flex justify-between items-center">
                  <h4 class="font-medium text-gray-800">Total Amount</h4>
                  <div class="text-lg font-bold">
                    ${{ calculateTotalAmount() }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-between items-center mt-6">
              <button
                type="button"
                @click="handleCancel"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                @click="saveFeeStructure"
                type="submit"
                :disabled="!isFormValid"
                class="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-md shadow-sm text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ modalStore.data.editing ? "Update" : "Create" }} Fee
                Structure
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useModalStore } from "@/store/useModalStore";
import { computed, onMounted, ref, watch } from "vue";
import { useClassStore } from "../../store/classStore";
import { useFeeStructureStore } from "../../store/feeStructureStore";
import { useNotificationStore } from "../../store/notification";
import {
  feeDescriptionOptions,
  feeTypeOptions,
  termOptions,
} from "../../utils/utility";
import Dropdown from "../dropdowns/dropdown.vue";

const modalStore = useModalStore();
const classStore = useClassStore();
const notificationStore = useNotificationStore();
const feeStructureStore = useFeeStructureStore();

const isModalVisible = ref(modalStore.createFeeStructureModal);

const selectedClass = ref("");

const classOptions = computed(() => {
  return classStore.getClassNames?.map((classItem) => classItem.name) || [];
});

// Generate academic year options dynamically based on academic calendar (Sept-Aug)
const academicYearOptions = computed(() => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11 (Jan-Dec)
  const currentYear = currentDate.getFullYear();
  const years = [];

  // Previous academic year (needed for terms that haven't completed yet)
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

  // Remove duplicates (in case previous year equals current year in Jan-Aug)
  return [...new Set(years)];
});

// Handle fee type change
const handleFeeTypeChange = () => {
  if (modalStore.data.feeForm.type === "YEARLY") {
    // If type is YEARLY, clear the term field
    modalStore.data.feeForm.term = null;
  } else {
    // If type is TERM, set a default term if it's null
    modalStore.data.feeForm.term = "FIRST";
  }
};

// Default form values
const defaultFormValues = computed(() => ({
  academicYear: academicYearOptions.value[0], // Current academic year
  term: "FIRST", // Default term for TERM type
  type: "TERM", // Default fee type
  description: "TUITION", // Default fee description
  totalAmount: 0,
  components: [{ name: "", description: "", amount: 0 }],
  classId: "",
}));

// Initialize the form with default values and handle existing data
const initializeForm = () => {
  if (!modalStore.data) {
    modalStore.data = { feeForm: { ...defaultFormValues.value } };
  } else if (!modalStore.data.feeForm) {
    modalStore.data.feeForm = { ...defaultFormValues.value };
  } else if (!modalStore.data.editing) {
    // Only set defaults for new forms, not when editing
    modalStore.data.feeForm.academicYear = academicYearOptions.value[0];
    modalStore.data.feeForm.term = "FIRST";
    modalStore.data.feeForm.description = "TUITION";
    modalStore.data.feeForm.type = "TERM";
  } else {
    // Create a deep copy of the form data to avoid modifying read-only objects
    modalStore.data.feeForm = JSON.parse(
      JSON.stringify(modalStore.data.feeForm)
    );

    // When editing, ensure type is set correctly and apply fee type logic
    if (modalStore.data.feeForm.type === "YEARLY") {
      modalStore.data.feeForm.term = null;
    } else {
      modalStore.data.feeForm.type = "TERM";
      if (!modalStore.data.feeForm.term) {
        modalStore.data.feeForm.term = "FIRST";
      }
    }

    // Make sure components are properly initialized with writable properties
    if (modalStore.data.feeForm.components) {
      modalStore.data.feeForm.components =
        modalStore.data.feeForm.components.map((comp) => ({
          name: comp.name || "",
          description: comp.description || "",
          amount: parseFloat(comp.amount) || 0,
        }));
    }

    if (
      modalStore.data.feeForm.classes &&
      modalStore.data.feeForm.classes.length > 0
    ) {
      selectedClass.value = modalStore.data.feeForm.classes[0].name;
    }
  }
};

const handleCancel = () => {
  modalStore.createFeeStructureModal = false;
};

// Calculate total amount from components
const calculateTotalAmount = () => {
  return modalStore.data.feeForm.components
    .reduce(
      (total, component) => total + (parseFloat(component.amount) || 0),
      0
    )
    .toFixed(2);
};

const saveFeeStructure = async () => {
  try {
    // Create a clean copy of the form data to modify before sending
    const formData = {};

    // Copy only the fields we need,
    formData.academicYear = modalStore.data.feeForm.academicYear;
    formData.type = modalStore.data.feeForm.type;
    formData.description = modalStore.data.feeForm.description;

    // If type is YEARLY, ensure term is null
    if (formData.type === "YEARLY") {
      formData.term = null;
    } else {
      formData.term = modalStore.data.feeForm.term;
    }

    // Set the classId from selectedClass
    // Get the class ID from the class name
    const selectedClassObj = classStore.getClassNames.find(
      (cls) => cls.name === selectedClass.value
    );
    if (selectedClassObj) {
      formData.classId = selectedClassObj.id;
    }

    // Clean and copy components
    formData.components = modalStore.data.feeForm.components.map(
      (component) => ({
        name: component.name,
        description: component.description || "",
        amount: parseFloat(component.amount) || 0,
      })
    );

    // Calculate total amount from components
    formData.totalAmount = parseFloat(calculateTotalAmount());

    if (modalStore.data.editing && modalStore.data.feeForm.id) {
      // Update existing fee structure
      await feeStructureStore.updateExistingFeeStructure(
        modalStore.data.feeForm.id,
        formData
      );
      notificationStore.addNotification({
        type: "success",
        message: "Fee structure updated successfully!",
      });
    } else {
      // Create new fee structure
      await feeStructureStore.createNewFeeStructure(formData);
      notificationStore.addNotification({
        type: "success",
        message: "Fee structure created successfully!",
      });
    }
    await feeStructureStore.refreshFeeStructures();
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: "Error creating fee structure:" + error.message,
    });
  } finally {
    // Close the modal regardless of success or failure
    modalStore.createFeeStructureModal = false;
  }
};

// Add this computed property to check if the form is valid
const isFormValid = computed(() => {
  // Check if class is selected
  if (!selectedClass.value) return false;

  // Check if all fee components have name and valid amount
  const componentsValid = modalStore.data.feeForm.components.every(
    (component) =>
      component.name.trim() !== "" &&
      component.amount !== null &&
      component.amount !== undefined &&
      component.amount >= 0
  );

  // Check if all required fields are filled
  const requiredFieldsValid =
    modalStore.data.feeForm.academicYear &&
    modalStore.data.feeForm.type &&
    modalStore.data.feeForm.description &&
    (modalStore.data.feeForm.type !== "TERM" || modalStore.data.feeForm.term);

  return componentsValid && requiredFieldsValid;
});

// Watch for modal visibility changes
watch(
  () => modalStore.createFeeStructureModal,
  (newVal) => {
    isModalVisible.value = newVal;
    if (newVal) {
      // Initialize form when modal becomes visible
      initializeForm();
    }
  },
  { immediate: true }
);

onMounted(() => {
  // Initialize form on component mount
  initializeForm();
  // Fetch classes
  classStore.fetchClasses();
});
</script>
