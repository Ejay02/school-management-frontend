<template>
  <div
    :class="[
      'p-3 rounded-lg max-w-[80%]',
      message.type === 'user'
        ? 'bg-eduSky text-white self-end ml-auto'
        : 'bg-gray-200 text-gray-600 self-start mr-auto',
    ]"
  >
    {{ message.text }}
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: Object,
    required: true,
    validator: (msg) => ["user", "bot"].includes(msg.type),
  },
});
</script>
