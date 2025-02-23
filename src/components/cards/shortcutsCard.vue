<template>
  <div class="bg-white p-4 rounded-md mb-1 cursor-pointer">
    <h1 class="text-xl font-semibold">Shortcuts</h1>
    <!-- Wrap the shortcuts list with draggable, using a div container -->
    <draggable
      v-model="localShortcuts"
      tag="div"
      class="mt-4 flex gap-4 flex-wrap text-xs text-gray-500"
      :options="{ animation: 200 }"
      :itemKey="'link'"
      @end="onDragEnd"
    >
      <template #item="{ element }">
        <router-link
          :to="element.link"
          :class="`p-2 text-center rounded-md ${element.color}`"
        >
          {{ element.text }}
        </router-link>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  shortcuts: {
    type: Array,
    required: true,
  },
});

// Use a unique key for localStorage; if teacher-specific, include teacher id
const storageKey = "shortcutCardsOrder";

// Load persisted order from localStorage if available; otherwise, use the prop order
const storedCards = localStorage.getItem(storageKey);
const localShortcuts = ref(
  storedCards ? JSON.parse(storedCards) : [...props.shortcuts]
);

// If the parent updates the shortcuts, sync the local copy
watch(
  () => props.shortcuts,
  (newVal) => {
    localShortcuts.value = [...newVal];
  }
);

// Optionally, can emit an event to update the parent.
const onDragEnd = (event) => {
  localStorage.setItem(storageKey, JSON.stringify(localShortcuts.value));
  // For example, if you want to notify the parent component of the new order:
  // emit('update:shortcuts', localShortcuts.value);
};
</script>

<style scoped></style>
