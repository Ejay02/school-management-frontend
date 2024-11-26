<template>
  <div class="flex items-center justify-between">
    <h1 class="hidden md:block text-lg font-semibold">{{ txt }}</h1>
    <div class="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
      <TableSearch />
      <div class="flex items-center gap-4 self-end">
        <button>
          <img
            src="/filter.png"
            alt="filter icon"
            class="p-2 h-8 w-8 flex items-center justify-center rounded-full bg-eduYellow"
          />
        </button>
        <button>
          <img
            src="/sort.png"
            alt="filter icon"
            class="p-2 h-8 w-8 flex items-center justify-center rounded-full bg-eduYellow"
          />
        </button>
        <button>
          <img
            src="/plus.png"
            alt="filter icon"
            class="p-2 h-8 w-8 flex items-center justify-center rounded-full bg-eduYellow"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import TableSearch from "../tableSearch.vue";

const props = defineProps({
  txt: {
    type: String,
    required: true,
  },
});
</script>

<style scoped></style>
