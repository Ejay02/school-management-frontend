<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Chatbot Icon/Trigger -->
    <div
      @click="toggleChat"
      class="bg-eduPurple text-gray-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg cursor-pointer hover:bg-eduPurpleLight transition-colors"
    >
      <i class="fa-solid fa-headset"></i>
    </div>

    <!-- Chatbot Modal -->
    <div
      v-if="isChatOpen"
      class="fixed bottom-24 right-6 w-96 bg-eduYellowLight rounded-lg shadow-xl border border-gray-200 flex flex-col max-h-[500px]"
    >
      <!-- Chat Header -->
      <div
        class="bg-eduPurple text-white p-4 rounded-t-lg flex justify-between items-center"
      >
        <h3 class="text-lg font-semibold">School Assistant</h3>
      </div>

      <!-- Chat Messages -->
      <div
        ref="chatContainer"
        class="flex-grow overflow-y-auto p-4 space-y-3"
        style="max-height: 350px"
      >
        <ChatMessage
          v-for="(message, index) in messages"
          :key="index"
          :message="message"
        />
      </div>

      <!-- Chat Input -->
      <div class="p-4 border-t">
        <div class="flex space-x-2">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="Type your message..."
            class="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            @click="sendMessage"
            class="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-300 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import ChatMessage from "./ChatMessage.vue";

const isChatOpen = ref(false);
const messages = ref([{ type: "bot", text: "Hi! How can I help you today?" }]);
const newMessage = ref("");
const chatContainer = ref(null);

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
};

const sendMessage = async () => {
  if (newMessage.value.trim() === "") return;

  // Add user message
  messages.value.push({ type: "user", text: newMessage.value });

  // Simulate bot response (replace with actual AI/backend logic)
  const userMessage = newMessage.value;
  newMessage.value = "";

  // Simulated bot response
  setTimeout(async () => {
    messages.value.push({
      type: "bot",
      text: `You said: "${userMessage}". I'm a school assistant bot!`,
    });

    await nextTick();
    scrollToBottom();
  }, 1000);
};

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};
</script>
