<template>
  <div class="bg-white p-4 rounded-md mb-1 cursor-pointer">
    <h1 class="text-xl font-semibold">Shortcuts</h1>
    <div class="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
      <router-link
        v-for="(shortcut, index) in shortcuts"
        :key="index"
        :to="shortcut.link"
        :class="`p-2 text-center rounded-md ${shortcut.color}`"
      >
        {{ shortcut.text }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  shortcuts: {
    type: Array,
    required: true,
  },
});
</script>
