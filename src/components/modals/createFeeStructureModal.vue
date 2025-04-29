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
        <div class="p-6 border-b">
          <h2 class="text-xl font-bold text-gray-800">
            {{
              modalStore.data.editing
                ? "Edit Fee Structure"
                : "Create Fee Structure"
            }}
          </h2>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveFeeStructure">
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
                  <option value="2023-2024">2023-2024</option>
                  <option value="2024-2025">2024-2025</option>
                </select>
              </div>

              <!-- Term Selection -->
              <div>
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
                  <option value="first">First Term</option>
                  <option value="second">Second Term</option>
                  <option value="third">Third Term</option>
                  <option value="year">Year</option>
                </select>
              </div>

              <!-- Fee Type -->
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
                >
                  <option value="Tuition">Tuition</option>
                  <option value="Development">Development Levy</option>
                  <option value="Uniform">Uniform</option>
                  <option value="Books">Books</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <!-- Class Selection -->
              <!-- <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Class</label
                >
                <select
                  v-model="modalStore.data.feeForm.classId"
                  required
                  class="w-full border rounded-lg px-3 py-2 focus:ring-eduPurple focus:border-eduPurple"
                >
                  <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                    {{ cls.name }}
                  </option>
                </select>
              </div> -->
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
                      >Amount (₦)</label
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
                type="submit"
                class="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-md shadow-sm text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
import { createFeeStructure } from "@/graphql/mutations";
import { useModalStore } from "@/store/useModalStore";
import { useMutation } from "@vue/apollo-composable";
import { computed, ref, watch, onMounted } from 'vue';
import { useClassStore } from "../../store/classStore";
import { useNotificationStore } from "../../store/notification";
import Dropdown from "../dropdowns/dropdown.vue";

const modalStore = useModalStore();
const classStore = useClassStore();
const notificationStore = useNotificationStore();

const isModalVisible = ref(modalStore.createFeeStructureModal);

const selectedClass = ref("");

const classOptions = computed(() => {
  return classStore.getClassNames?.map((classItem) => classItem.name) || [];
});

// Fee Structure Form
const feeForm = ref({
  academicYear: "2023-2024",
  term: "First",
  type: "Tuition",
  totalAmount: 0,
  components: [{ name: "", description: "", amount: 0 }],
  classId: "",
});

const handleCancel = () => {
  modalStore.createFeeStructureModal = false;
};

const { mutate: createFee } = useMutation(createFeeStructure);

const saveFeeStructure = async () => {
  try {
    const { data } = await createFee({
      input: modalStore.data.feeForm,
    });

    console.log("Fee structure created:", data.createFeeStructure);

    //  notificationStore.addNotification({
    //         type: "success",
    //         message: "Fee structure created!",
    //       });
    // Add logic to refresh fee structures list if needed
  } catch (error) {
    notificationStore.addNotification({
      type: "error",
      message: "Error creating fee structure:",
      error,
    });
    console.error("Error creating fee structure:", error);
  }
};

watch(
  () => modalStore.createFeeStructureModal,
  (newVal) => {
    isModalVisible.value = newVal;
  },
  { immediate: true }
);

onMounted(async () => {
  await Promise.all([classStore.fetchClasses()]);
});
</script>
