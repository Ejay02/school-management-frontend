<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Pulsing Chat Floating Action Button -->
    <div
      @click="toggleChat"
      class="relative bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg cursor-pointer hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
    >
      <i class="fa-solid fa-headset text-xl"></i>
      <!-- Pulsing Notification Dot -->
      <span class="absolute top-1 right-1 flex h-3 w-3">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
      </span>
    </div>

    <!-- Chat Dialog Window Box -->
    <Transition name="fade-slide">
      <div
        v-if="isChatOpen"
        class="fixed bottom-24 right-6 w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[520px] overflow-hidden transition-all duration-300 z-50"
      >
        <!-- Glassmorphism Header Layout -->
        <header class="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white p-4 flex justify-between items-center shadow-sm">
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center text-sm ring-1 ring-white/20">
              <i class="fa-solid fa-robot"></i>
            </div>
            <div>
              <h3 class="text-sm font-semibold tracking-wide">EduHub Support</h3>
              <p class="text-[10px] text-indigo-100 flex items-center gap-1.5">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                AI Assistant Online
              </p>
            </div>
          </div>
          <button @click="toggleChat" class="text-white/80 hover:text-white transition">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </header>

        <!-- Messages scroll area container -->
        <div
          ref="chatContainer"
          class="flex-grow overflow-y-auto p-4 space-y-4"
          style="max-height: 330px"
        >
          <ChatMessage
            v-for="(message, index) in messages"
            :key="index"
            :message="message"
            class="animate-message"
          />
          
          <!-- Thinking indicator spinner -->
          <div v-if="isLoading" class="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 self-start mr-auto max-w-[80%] animate-pulse">
            <i class="fa-solid fa-circle-notch fa-spin text-xs text-indigo-500"></i>
            <span class="text-xs font-medium">Assistant is writing...</span>
          </div>
        </div>

        <!-- Quick actions suggestion chips -->
        <div class="flex gap-2 overflow-x-auto px-4 py-2 border-t border-gray-100 bg-gray-50/50 scrollbar-none flex-nowrap">
          <button
            v-for="action in quickActions"
            :key="action.text"
            @click="triggerQuickAction(action)"
            class="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-650 hover:bg-indigo-50/20 transition-all duration-200"
          >
            {{ action.text }}
          </button>
        </div>

        <!-- Footer Input Layout panel -->
        <footer class="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="Ask anything..."
            class="flex-grow p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm text-gray-700 transition"
            :disabled="isLoading"
          />
          <button
            @click="sendMessage"
            class="h-9 w-9 flex items-center justify-center bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading || !newMessage.trim()"
          >
            <i class="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </footer>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useQuery } from "@vue/apollo-composable";
import ChatMessage from "../../components/chat/chatMessage.vue";
import { schoolProfile } from "../../utils/aiResponse";
import { useUserStore } from "../../store/userStore";
import { getSetupStateQuery } from "../../graphql/queries";

const userStore = useUserStore();

// Query school setup state to ensure phone/email is loaded
const { onResult } = useQuery(getSetupStateQuery, null, {
  fetchPolicy: "cache-first",
});

onResult((queryResult) => {
  const state = queryResult?.data?.getSetupState;
  if (state) {
    userStore.setSchoolInfo(state);
  }
});

const isChatOpen = ref(false);
const messages = ref([]);
const newMessage = ref("");
const chatContainer = ref(null);
const isLoading = ref(false);

const userName = computed(() => {
  const name = userStore.userInfo?.name;
  return name ? name.trim() : "";
});

const greetingText = computed(() => {
  const name = userName.value;
  return name
    ? `Hi ${name}! I'm your school assistant.\nHow can I help you today?`
    : "Hi! I'm your school assistant.\nHow can I help you today?";
});

const quickActions = [
  { text: "📅 Events Calendar", query: "What are the upcoming school events?" },
  { text: "💸 Billing Summary", query: "How do I check my invoices and fee details?" },
  { text: "📚 Homework Checks", query: "Where are assignment grades displayed?" },
  { text: "📞 Office Details", query: "What is the school office address and phone?" },
];

const getFallbackResponse = (userMessage) => {
  const queryResponse = schoolProfile.findResponse(userMessage);
  if (queryResponse) return queryResponse;

  const phone = userStore.schoolInfo?.schoolPhone || "";
  const email = userStore.schoolInfo?.schoolEmail || "";

  let contactInfo = "";
  if (phone && email) {
    contactInfo = ` on ${phone} or email ${email}`;
  } else if (phone) {
    contactInfo = ` on ${phone}`;
  } else if (email) {
    contactInfo = ` via email ${email}`;
  }

  return `I may not have specific information about that. Could you please contact the school office${contactInfo} for detailed inquiries?`;
};

const checkLocalData = (userMessage) => {
  const lowercaseMessage = userMessage.toLowerCase();

  if (lowercaseMessage.includes(schoolProfile.name.toLowerCase())) {
    return `${schoolProfile.name} is a ${schoolProfile.about.type} school located in ${schoolProfile.about.location}, founded in ${schoolProfile.about.founded}.`;
  }

  if (
    lowercaseMessage.includes("about") ||
    lowercaseMessage.includes("tell me more")
  ) {
    return `We are a ${schoolProfile.about.type} school with ${schoolProfile.about.totalStudents} student capacity and a student-teacher ratio of ${schoolProfile.about.studentTeacherRatio}.`;
  }

  if (
    lowercaseMessage.includes("academic") ||
    lowercaseMessage.includes("study")
  ) {
    return `We offer classes from ${
      schoolProfile.academicDetails.classRange
    } with a focus on ${schoolProfile.academicDetails.curriculum.join(", ")}.`;
  }

  const matchedQuery = schoolProfile.commonQueries.find((item) =>
    item.keywords.some((keyword) => lowercaseMessage.includes(keyword)),
  );

  return matchedQuery ? matchedQuery.response : null;
};

const sendMessage = async () => {
  if (newMessage.value.trim() === "" || isLoading.value) return;

  const userMessage = newMessage.value;
  messages.value.push({ type: "user", text: userMessage });
  newMessage.value = "";
  isLoading.value = true;

  // Scroll to typing indicator
  await nextTick();
  scrollToBottom();

  try {
    const localResponse = checkLocalData(userMessage);

    if (localResponse) {
      messages.value.push({ type: "bot", text: localResponse });
    } else {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ai/chat`,
        { message: userMessage },
      );

      const botResponse = response.data?.text?.trim();

      messages.value.push({
        type: "bot",
        text: botResponse || getFallbackResponse(userMessage),
      });
    }
  } catch (error) {
    console.error("Chatbot request failed:", error);
    messages.value.push({
      type: "bot",
      text: getFallbackResponse(userMessage),
    });
  } finally {
    isLoading.value = false;
    await nextTick();
    scrollToBottom();
  }
};

const triggerQuickAction = async (action) => {
  if (isLoading.value) return;
  newMessage.value = action.query;
  await sendMessage();
};

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
};

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

onMounted(() => {
  messages.value = [
    { type: "bot", text: greetingText.value },
  ];
});

watch(isChatOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    scrollToBottom();
  }
});
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Slide Entry Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.animate-message {
  animation: messageSlideIn 0.25s ease-out forwards;
}
@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
