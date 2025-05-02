<template>
  <div class="p-4 flex items-center justify-between text-gray-500">
    <button
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
      class="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Prev
    </button>
    <span class="text-sm text-gray-500">Showing {{ currentPage }} to {{ totalPages }} of {{totalPages}} results</span>
    <button
      :disabled="!hasMore"
      @click="changePage(currentPage + 1)"
      class="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  hasMore: {
    type: Boolean,
    default: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:page"]);

function changePage(page) {
  if (page < 1) return;
  emit("update:page", page);
}
</script>

<style scoped></style>
