<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white p-4 rounded-lg max-w-4xl w-full">
      <div class="aspect-video">
        <!-- -->
        <iframe
          src="/campus_tour.mp4"
          frameborder="0"
          allowfullscreen
          class="w-full h-full"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
});

defineEmits(["close"]);
</script>
