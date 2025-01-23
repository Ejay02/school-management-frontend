<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:w-1/2 cursor-pointer">
    <div
      v-for="(card, index) in infoCards"
      :key="index"
      class="bg-white p-4 rounded-md flex gap-1"
    >
      <img :src="card.icon" class="h-5 w-5 mt-2" :alt="card.title" />
      <div>
        <h1 class="text-lg font-semibold">{{ card.value }}</h1>
        <span class="text-sm text-gray-400">{{ card.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  infoCards: {
    type: Array,
    required: true,
  },
});
</script>
