<template>
  <div class="relative">
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      <span v-html="label"></span>
    </label>

    <!-- Dropdown Button -->
    <button
      :id="id"
      @click="toggleDropdown"
      class="w-full flex items-center justify-between px-3 py-2 border focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm text-left"
    >
      <span>{{ selectedValue || emptyLabel }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- Dropdown List - Using absolute positioning relative to the button -->
    <div
      v-if="isDropdownOpen"
      class="absolute z-50"
      :style="{ width: dropdownWidth + 'px' }"
    >
      <ul
        class="bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto w-full"
      >
        <li
          @click="selectItem('')"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
          :class="{ 'bg-indigo-100': modelValue === '' }"
        >
          <span>{{ emptyLabel }}</span>
          <svg
            v-if="modelValue === ''"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 ml-auto text-indigo-600 float-right"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </li>
        <li
          v-for="(name, index) in options"
          :key="index"
          @click="selectItem(name)"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
          :class="{ 'bg-indigo-100': modelValue === name }"
        >
          <span>{{ name }}</span>
          <svg
            v-if="modelValue === name"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 ml-auto text-indigo-600 float-right"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "Select Class",
  },
  options: {
    type: Array,
    default: () => [],
  },
  id: {
    type: String,
    default: () => `dropdown-${Math.random().toString(36).substring(2, 9)}`,
  },
  allowEmpty: {
    type: Boolean,
    default: true,
  },
  emptyLabel: {
    type: String,
    default: "No class",
  },
});

const emit = defineEmits(["update:modelValue"]);

// Reactive state
const isDropdownOpen = ref(false);
const dropdownWidth = ref(0);
const selectedValue = computed(() => props.modelValue);

// Methods
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isDropdownOpen.value) {
    // Get button element and its dimensions
    const buttonElement = document.getElementById(props.id);
    if (buttonElement) {
      dropdownWidth.value = buttonElement.offsetWidth;
    }
  }
}

function selectItem(value) {
  emit("update:modelValue", value);
  isDropdownOpen.value = false;
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (isDropdownOpen.value && !event.target.closest(`#${props.id}`)) {
    isDropdownOpen.value = false;
  }
}

// Lifecycle hooks


onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
