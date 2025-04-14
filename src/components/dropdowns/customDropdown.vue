<template>
  <div class="relative">
    <label :for="id" class="block text-sm text-gray-600 mb-1">
      <span v-html="label"></span>
    </label>

    <button
      :id="id"
      @click="toggleDropdown"
      class="w-full flex items-center justify-between px-3 py-2 border focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm text-left focus:outline-none focus:ring-0"
    >
      <span>{{ selectedValue || placeholder }}</span>
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

    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
    >
      <ul>
        <li
          v-for="(option, index) in options"
          :key="index"
          @click="selectOption(option)"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
          :class="{ 'bg-indigo-100': modelValue === option.value }"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "Select an option",
  },
  id: {
    type: String,
    default: () =>
      `custom-dropdown-${Math.random().toString(36).substring(2, 9)}`,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);

const selectedValue = computed(() => {
  const selectedOption = props.options.find(
    (option) => option.value === props.modelValue
  );
  return selectedOption ? selectedOption.label : "";
});

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function selectOption(option) {
  emit("update:modelValue", option.value);
  isOpen.value = false;
}
</script>
