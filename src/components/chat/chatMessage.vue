<template>
  <div
    :class="[
      'p-3 rounded-lg max-w-[80%]',
      message.type === 'user'
        ? 'bg-eduSky text-white self-end ml-auto'
        : 'bg-gray-200 text-gray-600 self-start mr-auto',
    ]"
  >
    <!-- For bot messages, render parsed HTML -->
    <div v-if="message.type === 'bot'" v-html="parsedText"></div>
    <!-- For user messages, just render plain text -->
    <div v-else>{{ message.text }}</div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import MarkdownIt from "markdown-it";

// Initialize the markdown parser
const md = new MarkdownIt();

const props = defineProps({
  message: {
    type: Object,
    required: true,
    validator: (msg) => ["user", "bot"].includes(msg.type),
  },
});

// Compute the parsed text: convert Markdown to HTML if bot message
const parsedText = computed(() => {
  if (props.message.type === "bot") {
    return md.render(props.message.text);
  }
  return props.message.text;
});
</script>
