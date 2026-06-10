<template>
  <div class="w-full rounded border border-gray-300 bg-white p-2">
    <div class="flex h-[calc(100vh-8rem)] min-h-[600px] overflow-hidden rounded-lg shadow-sm">
      <aside class="flex w-full max-w-sm flex-col border-r border-gray-200 bg-white">
        <div class="border-b border-gray-200 p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold text-gray-800">Messages</h2>
              <p class="text-xs text-gray-500">Parents can chat with linked teachers and school admins.</p>
            </div>
            <button class="rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 px-3 py-2 text-sm font-medium text-white transition hover:from-blue-500 hover:to-purple-500" @click="showContacts = !showContacts">
              {{ showContacts ? "Close" : "New Chat" }}
            </button>
          </div>
          <div class="mt-3">
            <input v-model.trim="searchTerm" type="text" placeholder="Search conversations or contacts..." class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
        </div>

        <div v-if="showContacts" class="border-b border-gray-200 bg-indigo-50/50 p-4">
          <div class="mb-2 flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-800">Allowed Contacts</h3>
            <span class="text-xs text-gray-500">{{ filteredContacts.length }}</span>
          </div>
          <div v-if="loadingContacts" class="text-sm text-gray-500">Loading contacts...</div>
          <div v-else-if="!filteredContacts.length" class="text-sm text-gray-500">No matching contacts found.</div>
          <div v-else class="max-h-56 space-y-2 overflow-y-auto pr-1">
            <button v-for="contact in filteredContacts" :key="contact.id" class="flex w-full items-center gap-3 rounded-md bg-white px-3 py-2 text-left shadow-sm transition hover:bg-gray-50" @click="startConversation(contact)">
              <img v-if="contact.image" :src="contact.image" :alt="contact.displayName" class="h-10 w-10 rounded-full object-cover" />
              <div v-else class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white">{{ getInitials(contact) }}</div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-gray-800">{{ contact.displayName }}</p>
                <p class="truncate text-xs text-gray-500">{{ contact.subtitle }}</p>
              </div>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto bg-gray-50/40 p-2">
          <div v-if="loadingConversations" class="p-4 text-sm text-gray-500">Loading conversations...</div>
          <div v-else-if="!filteredConversations.length" class="flex h-full items-center justify-center p-6 text-center text-sm text-gray-500">Start a new chat with a teacher or admin to see conversations here.</div>
          <button v-for="conversation in filteredConversations" v-else :key="conversation.id" class="mb-2 flex w-full items-center gap-3 rounded-md px-3 py-3 text-left transition" :class="conversation.id === activeConversationId ? 'bg-indigo-100 ring-1 ring-indigo-200' : 'bg-white hover:bg-gray-100'" @click="openConversation(conversation.id)">
            <img v-if="getOtherParticipant(conversation)?.image" :src="getOtherParticipant(conversation)?.image" :alt="getOtherParticipant(conversation)?.displayName" class="h-11 w-11 rounded-full object-cover" />
            <div v-else class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white">{{ getInitials(getOtherParticipant(conversation)) }}</div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-3">
                <p class="truncate text-sm font-semibold text-gray-800">{{ getConversationTitle(conversation) }}</p>
                <span class="shrink-0 text-xs text-gray-400">{{ formatConversationTime(conversation.lastMessage?.createdAt || conversation.updatedAt) }}</span>
              </div>
              <div class="mt-1 flex items-center justify-between gap-3">
                <p class="truncate text-xs text-gray-500">{{ getConversationPreview(conversation) }}</p>
                <span v-if="conversation.unreadCount" class="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[11px] font-semibold text-white">{{ conversation.unreadCount }}</span>
              </div>
            </div>
          </button>
        </div>
      </aside>

      <section class="flex flex-1 flex-col bg-white">
        <div v-if="activeConversation" class="flex items-center gap-3 border-b border-gray-200 px-5 py-4">
          <img v-if="activeParticipant?.image" :src="activeParticipant.image" :alt="activeParticipant.displayName" class="h-11 w-11 rounded-full object-cover" />
          <div v-else class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white">{{ getInitials(activeParticipant) }}</div>
          <div class="min-w-0">
            <h3 class="truncate text-base font-semibold text-gray-800">{{ activeParticipant?.displayName || "Conversation" }}</h3>
            <p class="truncate text-sm text-gray-500">{{ activeParticipant?.subtitle || "Direct chat" }}</p>
          </div>
        </div>

        <div v-if="activeConversation" ref="messagesContainer" class="flex-1 overflow-y-auto bg-gray-50 p-5">
          <div v-if="loadingMessages" class="text-sm text-gray-500">Loading messages...</div>
          <div v-else-if="!activeMessages.length" class="flex h-full items-center justify-center text-center text-sm text-gray-500">No messages yet. Say hello to start the conversation.</div>
          <div v-else class="space-y-3">
            <div v-for="message in activeMessages" :key="message.id" class="flex" :class="isOwnMessage(message) ? 'justify-end' : 'justify-start'">
              <div class="max-w-xl">
                <div class="rounded-2xl px-4 py-3 text-sm shadow-sm" :class="isOwnMessage(message) ? 'rounded-br-md bg-indigo-500 text-white' : 'rounded-bl-md bg-white text-gray-800'">
                  <p class="whitespace-pre-wrap break-words">{{ message.content }}</p>
                </div>
                <p class="mt-1 text-xs text-gray-400" :class="isOwnMessage(message) ? 'text-right' : 'text-left'">{{ formatMessageTime(message.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeConversation" class="border-t border-gray-200 bg-white p-4">
          <form class="flex items-end gap-3" @submit.prevent="submitMessage">
            <textarea v-model="draftMessage" rows="2" placeholder="Type a message..." class="min-h-[52px] flex-1 resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" @keydown.enter.exact.prevent="submitMessage" @keydown.enter.shift.exact.stop></textarea>
            <button type="submit" class="rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-3 text-sm font-medium text-white transition hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60" :disabled="sendingMessage || !draftMessage.trim()">{{ sendingMessage ? "Sending..." : "Send" }}</button>
          </form>
        </div>

        <div v-else class="flex flex-1 items-center justify-center bg-gray-50 p-8 text-center text-gray-500">
          <p class="text-sm">Select a conversation or start a new chat.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { apolloClient } from "../../../apollo-client";
import { getChatContacts, getChatConversations, getChatMessages } from "../../graphql/queries";
import { findOrCreateDirectConversation, markChatConversationAsRead, sendChatMessage } from "../../graphql/mutations";
import { socket } from "../../socket/socket";
import { useNotificationStore } from "../../store/notification";
import { useUserStore } from "../../store/userStore";

const userStore = useUserStore();
const notificationStore = useNotificationStore();
const searchTerm = ref("");
const showContacts = ref(false);
const loadingContacts = ref(false);
const loadingConversations = ref(false);
const loadingMessages = ref(false);
const sendingMessage = ref(false);
const contacts = ref([]);
const conversations = ref([]);
const messagesByConversation = ref({});
const activeConversationId = ref(null);
const draftMessage = ref("");
const messagesContainer = ref(null);
const currentUserId = computed(() => userStore.userInfo?.id || null);
const activeConversation = computed(() => conversations.value.find((conversation) => conversation.id === activeConversationId.value) || null);
const activeParticipant = computed(() => getOtherParticipant(activeConversation.value));
const activeMessages = computed(() => messagesByConversation.value[activeConversationId.value] || []);
const filteredContacts = computed(() => filterItems(contacts.value, searchTerm.value, (contact) => [contact.displayName, contact.email, contact.subtitle]));
const filteredConversations = computed(() => {
  const sorted = [...conversations.value].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return filterItems(sorted, searchTerm.value, (conversation) => {
    const other = getOtherParticipant(conversation);
    return [other?.displayName, other?.email, other?.subtitle, getConversationPreview(conversation)];
  });
});

function filterItems(items, search, getValues) {
  const normalizedSearch = String(search || "").trim().toLowerCase();
  if (!normalizedSearch) return items;
  return items.filter((item) => getValues(item).filter(Boolean).some((value) => String(value).toLowerCase().includes(normalizedSearch)));
}

function notifyError(error, fallbackMessage) {
  notificationStore.addNotification({ type: "error", message: error?.message || fallbackMessage });
}

function normalizeConversation(conversation) {
  return {
    ...conversation,
    participants: Array.isArray(conversation?.participants) ? conversation.participants : [],
    lastMessage: conversation?.lastMessage || null,
    unreadCount: Number(conversation?.unreadCount || 0),
  };
}

function getInitials(person) {
  if (!person) return "?";
  const displayName = person.displayName || [person.name, person.surname].filter(Boolean).join(" ");
  return String(displayName).split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function getOtherParticipant(conversation) {
  return conversation?.participants?.find((participant) => participant.id !== currentUserId.value) || conversation?.participants?.[0] || null;
}

function getConversationTitle(conversation) {
  return getOtherParticipant(conversation)?.displayName || "Conversation";
}

function getConversationPreview(conversation) {
  if (!conversation?.lastMessage?.content) return "No messages yet";
  return conversation.lastMessage.sender?.id === currentUserId.value ? `You: ${conversation.lastMessage.content}` : conversation.lastMessage.content;
}

function formatConversationTime(value) {
  if (!value) return "";
  const date = new Date(value);
  const sameDay = date.toDateString() === new Date().toDateString();
  return new Intl.DateTimeFormat(undefined, sameDay ? { hour: "numeric", minute: "2-digit" } : { month: "short", day: "numeric" }).format(date);
}

function formatMessageTime(value) {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function isOwnMessage(message) {
  return message?.sender?.id === currentUserId.value;
}

async function scrollToBottom() {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

function upsertConversation(conversation) {
  const normalized = normalizeConversation(conversation);
  const index = conversations.value.findIndex((item) => item.id === normalized.id);
  if (index === -1) {
    conversations.value = [normalized, ...conversations.value];
    return normalized;
  }
  conversations.value.splice(index, 1, { ...conversations.value[index], ...normalized });
  return conversations.value[index];
}

async function fetchContacts() {
  loadingContacts.value = true;
  try {
    const { data } = await apolloClient.query({ query: getChatContacts, fetchPolicy: "network-only" });
    contacts.value = data?.getChatContacts || [];
  } catch (error) {
    notifyError(error, "Failed to load chat contacts.");
  } finally {
    loadingContacts.value = false;
  }
}

async function fetchConversations() {
  loadingConversations.value = true;
  try {
    const { data } = await apolloClient.query({ query: getChatConversations, fetchPolicy: "network-only" });
    conversations.value = (data?.getChatConversations || []).map(normalizeConversation);
    if (!activeConversationId.value && conversations.value.length) {
      activeConversationId.value = conversations.value[0].id;
      await fetchMessages(activeConversationId.value);
    }
  } catch (error) {
    notifyError(error, "Failed to load conversations.");
  } finally {
    loadingConversations.value = false;
  }
}

async function markConversationRead(conversationId) {
  if (!conversationId) return;
  try {
    await apolloClient.mutate({ mutation: markChatConversationAsRead, variables: { conversationId } });
  } catch {
    // Ignore read refresh failures in the UI.
  }
}

async function fetchMessages(conversationId) {
  if (!conversationId) return;
  loadingMessages.value = true;
  try {
    const { data } = await apolloClient.query({ query: getChatMessages, variables: { conversationId }, fetchPolicy: "network-only" });
    messagesByConversation.value = { ...messagesByConversation.value, [conversationId]: data?.getChatMessages || [] };
    await markConversationRead(conversationId);
    const currentConversation = conversations.value.find((conversation) => conversation.id === conversationId);
    if (currentConversation) {
      upsertConversation({ ...currentConversation, unreadCount: 0 });
    }
    scrollToBottom();
  } catch (error) {
    notifyError(error, "Failed to load messages.");
  } finally {
    loadingMessages.value = false;
  }
}

async function openConversation(conversationId) {
  activeConversationId.value = conversationId;
  if (!messagesByConversation.value[conversationId]) {
    await fetchMessages(conversationId);
    return;
  }
  await markConversationRead(conversationId);
  const currentConversation = conversations.value.find((conversation) => conversation.id === conversationId);
  if (currentConversation) {
    upsertConversation({ ...currentConversation, unreadCount: 0 });
  }
  scrollToBottom();
}

async function startConversation(contact) {
  try {
    const { data } = await apolloClient.mutate({ mutation: findOrCreateDirectConversation, variables: { participantId: contact.id } });
    const conversation = upsertConversation(data?.findOrCreateDirectConversation);
    showContacts.value = false;
    await openConversation(conversation.id);
  } catch (error) {
    notifyError(error, "Failed to start conversation.");
  }
}

async function submitMessage() {
  if (!activeConversationId.value || !draftMessage.value.trim()) return;
  sendingMessage.value = true;
  try {
    await apolloClient.mutate({ mutation: sendChatMessage, variables: { conversationId: activeConversationId.value, content: draftMessage.value.trim() } });
    draftMessage.value = "";
  } catch (error) {
    notifyError(error, "Failed to send message.");
  } finally {
    sendingMessage.value = false;
  }
}

function onConversationUpdated(conversation) {
  const updated = upsertConversation(conversation);
  if (updated.id === activeConversationId.value) {
    upsertConversation({ ...updated, unreadCount: 0 });
  }
}

function onMessageCreated(message) {
  const existingMessages = messagesByConversation.value[message.conversationId] || [];
  if (!existingMessages.some((item) => item.id === message.id)) {
    messagesByConversation.value = { ...messagesByConversation.value, [message.conversationId]: [...existingMessages, message] };
  }
  if (message.conversationId === activeConversationId.value) {
    scrollToBottom();
  }
}

onMounted(async () => {
  socket.on("chatConversationUpdated", onConversationUpdated);
  socket.on("chatMessageCreated", onMessageCreated);
  await Promise.all([fetchContacts(), fetchConversations()]);
});

onBeforeUnmount(() => {
  socket.off("chatConversationUpdated", onConversationUpdated);
  socket.off("chatMessageCreated", onMessageCreated);
});
</script>
