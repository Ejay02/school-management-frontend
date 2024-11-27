<template>
  <div
    class="bg-eduSky py-4 px-4 rounded-md flex-1 flex gap-4 lg:w-2/3 cursor-pointer"
  >
    <div class="">
      <img
        :src="profileImage"
        :alt="`${name} image`"
        class="w-24 h-24 rounded-full object-cover"
      />
    </div>
    <div class="w-2/3 flex flex-col justify-between gap-4">
      <div class="text-xl font-semibold">{{ name }}</div>
      <p class="text-sm text-gray-500">{{ description }}</p>
      <div
        class="flex items-center justify-between gap-2 flex-wrap text-xs font-medium"
      >
        <div
          v-for="(detail, index) in details"
          :key="index"
          class="w-full md:w-1/3 lg:w-1/3 2xl:w-1/3 flex items-center gap-1"
        >
          <img
            :src="detail.icon"
            :alt="`${detail.label} icon`"
            class="h-3 w-3"
          />
          <span class=""> {{ detail.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  profileImage: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  details: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped></style>
