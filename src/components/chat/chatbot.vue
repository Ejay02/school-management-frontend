<template>
  <div class="fixed bottom-6 right-6 z-50 cursor-pointer">
    <div
      @click="toggleChat"
      class="bg-eduPurple text-gray-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg cursor-pointer hover:bg-eduPurpleLight transition-colors"
    >
      <i class="fa-solid fa-headset"></i>
    </div>

    <div
      v-if="isChatOpen"
      class="fixed bottom-24 right-6 w-96 bg-eduYellowLight rounded-lg shadow-xl border border-gray-200 flex flex-col max-h-[500px]"
    >
      <div
        class="bg-eduPurple text-white p-4 rounded-t-lg flex justify-between items-center"
      >
        <h3 class="text-lg font-semibold">Eduhub Assistant</h3>
      </div>

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
        <div v-if="isLoading" class="text-center text-gray-500 font-serif">
          Thinking deeply 🤔...
        </div>
      </div>

      <div class="p-4 border-t">
        <div class="flex space-x-2">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="Type your message..."
            class="cursor-pointer flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-500"
          />
          <button
            @click="sendMessage"
            class="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-300 transition-colors"
            :disabled="isLoading"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { nextTick, ref } from "vue";
import ChatMessage from "../../components/chat/chatMessage.vue";
import { generateSchoolPrompt, schoolProfile } from "../../utils/aiResponse";

const isChatOpen = ref(false);
const messages = ref([
  { type: "bot", text: "Hi! I'm your Eduhub assistant. \n How can I help?" },
]);
const newMessage = ref("");
const chatContainer = ref(null);
const isLoading = ref(false);

const checkLocalData = (userMessage) => {
  // Convert user message to lowercase for better matching
  const lowercaseMessage = userMessage.toLowerCase();

  // Check for school name mentions
  if (lowercaseMessage.includes(schoolProfile.name.toLowerCase())) {
    return `${schoolProfile.name} is a ${schoolProfile.about.type} school located in ${schoolProfile.about.location}, founded in ${schoolProfile.about.founded}.`;
  }

  // Check for about/general info queries
  if (
    lowercaseMessage.includes("about") ||
    lowercaseMessage.includes("tell me more")
  ) {
    return `We are a ${schoolProfile.about.type} school with ${schoolProfile.about.totalStudents} student capacity and a student-teacher ratio of ${schoolProfile.about.studentTeacherRatio}.`;
  }

  // Check for academic/curriculum queries
  if (
    lowercaseMessage.includes("academic") ||
    lowercaseMessage.includes("study")
  ) {
    return `We offer classes from ${
      schoolProfile.academicDetails.classRange
    } with a focus on ${schoolProfile.academicDetails.curriculum.join(", ")}.`;
  }

  // Check common queries using the existing findResponse method
  const matchedQuery = schoolProfile.commonQueries.find((item) =>
    item.keywords.some((keyword) => lowercaseMessage.includes(keyword))
  );

  // Only return if we have a specific match
  return matchedQuery ? matchedQuery.response : null;
};

const sendMessage = async () => {
  if (newMessage.value.trim() === "" || isLoading.value) return;

  const userMessage = newMessage.value;
  messages.value.push({ type: "user", text: userMessage });
  newMessage.value = "";
  isLoading.value = true;

  try {
    // First check if we have a local response
    const localResponse = checkLocalData(userMessage);

    if (localResponse) {
      // If we have a local response, use it
      messages.value.push({ type: "bot", text: localResponse });
    } else {
      // If no local response, make API call
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/google/gemma-2-2b-it",
        {
          inputs: `<start_of_turn>user\n${generateSchoolPrompt(
            userMessage
          )}<end_of_turn>\n<start_of_turn>model\n`,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            top_p: 0.95,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const fullResponse = response.data[0].generated_text;
      const botResponse = fullResponse
        .replace(
          `<start_of_turn>user\n${generateSchoolPrompt(
            userMessage
          )}<end_of_turn>\n<start_of_turn>model\n`,
          ""
        )
        .trim();

      messages.value.push({ type: "bot", text: botResponse });
    }
  } catch (error) {
    messages.value.push({
      type: "bot",
      text: "Sorry, I encountered an error.",
    });
  } finally {
    isLoading.value = false;
    await nextTick();
    scrollToBottom();
  }
};

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
};

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};
</script>
