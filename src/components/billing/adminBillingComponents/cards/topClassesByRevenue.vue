<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">
      Top Classes by Revenue
    </h3>
    <div class="space-y-4">
      <div v-for="(cls, index) in topClasses" :key="cls.id">
        <div class="flex justify-between items-center">
          <span class="font-medium">{{ cls.name }}</span>
          <span class="text-gray-700">${{ cls.revenue }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            class="bg-eduPurple h-2 rounded-full"
            :style="{
              width: `${(cls.revenue / topClasses[0].revenue) * 100}%`,
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const topClasses = ref([
  { id: "1", name: "Primary 6", revenue: 750000 },
  { id: "2", name: "JSS 1", revenue: 600000 },
  { id: "3", name: "JSS 2", revenue: 450000 },
  { id: "4", name: "JSS 3", revenue: 350000 },
  { id: "5", name: "JSS 4", revenue: 30000 },
]);
</script>
