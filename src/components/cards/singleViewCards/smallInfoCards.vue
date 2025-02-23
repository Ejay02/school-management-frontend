<template>
  <draggable
    v-model="localInfoCards"
    tag="div"
    class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:w-1/2 cursor-pointer"
    :itemKey="'title'"
    :options="{ animation: 200 }"
    @end="onDragEnd"
  >
    <template #item="{ element }">
      <div class="bg-white p-4 rounded-md flex gap-1">
        <img :src="element.icon" class="h-5 w-5 mt-2" :alt="element.title" />
        <div>
          <h1 class="text-lg font-semibold">{{ element.value }}</h1>
          <span class="text-sm text-gray-400">{{ element.title }}</span>
        </div>
      </div>
    </template>
  </draggable>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  infoCards: {
    type: Array,
    required: true,
  },
});

// Use a unique key for localStorage; if teacher-specific, include teacher id
const storageKey = "smallInfoCardsOrder";

// Load persisted order from localStorage if available; otherwise, use the prop order
const storedCards = localStorage.getItem(storageKey);
const localInfoCards = ref(
  storedCards ? JSON.parse(storedCards) : [...props.infoCards]
);

// Sync local copy when the parent updates infoCards
watch(
  () => props.infoCards,
  (newVal) => {
    localInfoCards.value = [...newVal];
  }
);

// Handle drag end event (optionally, emit an event to update the parent)
const onDragEnd = (event) => {
  localStorage.setItem(storageKey, JSON.stringify(localInfoCards.value));
  // Optionally, update the parent with the new order:
  // emit("update:infoCards", localInfoCards.value);
};
</script>
