<template>
  <div class="w-full rounded border border-gray-300 bg-white p-2">
    <div
      class="flex h-[calc(100vh-8rem)] min-h-[600px] overflow-hidden rounded-lg shadow-sm"
    >
      <aside
        class="flex w-full max-w-sm flex-col border-r border-gray-200 bg-white"
      >
        <div class="border-b border-gray-200 p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold text-gray-800">Messages</h2>
              <p class="text-xs text-gray-500">{{ bannerText }}</p>
            </div>
            <button
              class="rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 px-3 py-2 text-sm font-medium text-white transition hover:from-blue-500 hover:to-purple-500"
              @click="showContacts = !showContacts"
            >
              {{ showContacts ? "Close" : "New Chat" }}
            </button>
          </div>
          <div class="mt-3">
            <input
              v-model.trim="searchTerm"
              type="text"
              placeholder="Search conversations or contacts..."
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <div
          v-if="showContacts"
          class="border-b border-gray-200 bg-indigo-50/50 p-4"
        >
          <div class="mb-2 flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-800">
              Allowed Contacts
            </h3>
            <span class="text-xs text-gray-500">{{
              filteredContacts.length
            }}</span>
          </div>
          <div v-if="loadingContacts" class="text-sm text-gray-500">
            Loading contacts...
          </div>
          <div
            v-else-if="!filteredContacts.length"
            class="text-sm text-gray-500"
          >
            No matching contacts found.
          </div>
          <div v-else class="max-h-56 space-y-2 overflow-y-auto pr-1">
            <button
              v-for="contact in filteredContacts"
              :key="contact.id"
              class="flex w-full items-center gap-3 rounded-md bg-white px-3 py-2 text-left shadow-sm transition hover:bg-gray-50"
              @click="startConversation(contact)"
            >
              <img
                v-if="contact.image"
                :src="contact.image"
                :alt="contact.displayName"
                class="h-10 w-10 rounded-full object-cover"
              />
              <div
                v-else
                class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white"
              >
                {{ getInitials(contact) }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-gray-800">
                  {{ contact.displayName }}
                </p>
                <p class="truncate text-xs text-gray-500">
                  {{ contact.subtitle }}
                </p>
              </div>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto bg-gray-50/40 p-2">
          <div v-if="loadingConversations" class="p-4 text-sm text-gray-500">
            Loading conversations...
          </div>
          <div
            v-else-if="!filteredConversations.length"
            class="flex h-full items-center justify-center p-6 text-center text-sm text-gray-500"
          >
            Start a new chat with a teacher or admin to see conversations here.
          </div>
          <button
            v-for="conversation in filteredConversations"
            v-else
            :key="conversation.id"
            class="mb-2 flex w-full items-center gap-3 rounded-md px-3 py-3 text-left transition"
            :class="
              conversation.id === activeConversationId
                ? 'bg-indigo-100 ring-1 ring-indigo-200'
                : 'bg-white hover:bg-gray-100'
            "
            @click="openConversation(conversation.id)"
          >
            <img
              v-if="getOtherParticipant(conversation)?.image"
              :src="getOtherParticipant(conversation)?.image"
              :alt="getOtherParticipant(conversation)?.displayName"
              class="h-11 w-11 rounded-full object-cover"
            />
            <div
              v-else
              class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white"
            >
              {{ getInitials(getOtherParticipant(conversation)) }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-3">
                <p class="truncate text-sm font-semibold text-gray-800">
                  {{ getConversationTitle(conversation) }}
                </p>
                <span class="shrink-0 text-xs text-gray-400">{{
                  formatConversationTime(
                    conversation.lastMessage?.createdAt ||
                      conversation.updatedAt,
                  )
                }}</span>
              </div>
              <div class="mt-1 flex items-center justify-between gap-3">
                <div class="flex min-w-0 items-center gap-2">
                  <img
                    v-if="getConversationPreviewThumbnail(conversation)"
                    :src="getConversationPreviewThumbnail(conversation)"
                    alt="Attachment preview"
                    class="h-6 w-6 rounded object-cover"
                  />
                  <i
                    v-else-if="getConversationPreviewIcon(conversation)"
                    :class="getConversationPreviewIcon(conversation)"
                    class="shrink-0 text-indigo-500"
                  ></i>
                  <p class="truncate text-xs text-gray-500">
                    {{ getConversationPreview(conversation) }}
                  </p>
                </div>
                <span
                  v-if="conversation.unreadCount"
                  class="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[11px] font-semibold text-white"
                  >{{ conversation.unreadCount }}</span
                >
              </div>
            </div>
          </button>
        </div>
      </aside>

      <section class="flex flex-1 flex-col bg-white">
        <div
          v-if="activeConversation"
          class="flex items-center gap-3 border-b border-gray-200 px-5 py-4"
        >
          <img
            v-if="activeParticipant?.image"
            :src="activeParticipant.image"
            :alt="activeParticipant.displayName"
            class="h-11 w-11 rounded-full object-cover"
          />
          <div
            v-else
            class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white"
          >
            {{ getInitials(activeParticipant) }}
          </div>
          <div class="min-w-0">
            <h3 class="truncate text-base font-semibold text-gray-800">
              {{ activeParticipant?.displayName || "Conversation" }}
            </h3>
            <p class="truncate text-sm text-gray-500">
              {{ activeParticipant?.subtitle || "Direct chat" }}
            </p>
          </div>
        </div>

        <div
          v-if="activeConversation"
          ref="messagesContainer"
          class="flex-1 overflow-y-auto bg-gray-50 p-5"
        >
          <div v-if="loadingMessages" class="text-sm text-gray-500">
            Loading messages...
          </div>
          <div
            v-else-if="!activeMessages.length"
            class="flex h-full items-center justify-center text-center text-sm text-gray-500"
          >
            No messages yet. Say hello to start the conversation.
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="message in activeMessages"
              :key="message.id"
              class="flex"
              :class="isOwnMessage(message) ? 'justify-end' : 'justify-start'"
            >
              <div class="group relative max-w-xl">
                <div
                  class="rounded-2xl px-4 py-3 text-sm shadow-sm"
                  :class="
                    isOwnMessage(message)
                      ? 'rounded-br-md bg-indigo-500 text-white'
                      : 'rounded-bl-md bg-white text-gray-800'
                  "
                >
                  <div
                    v-if="message.attachments?.length"
                    class="mb-2 space-y-2"
                  >
                    <div
                      v-for="(attachment, index) in message.attachments"
                      :key="`${message.id}-attachment-${index}`"
                    >
                      <img
                        v-if="attachment.kind === 'image'"
                        :src="attachment.url"
                        :alt="attachment.name"
                        class="max-h-64 w-full rounded-lg object-cover"
                      />
                      <a
                        v-else
                        :href="attachment.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white/80 px-3 py-2 text-left text-sm text-gray-700"
                      >
                        <i
                          :class="getAttachmentIconClass(attachment)"
                          class="text-indigo-500"
                        ></i>
                        <span class="truncate">{{ attachment.name }}</span>
                      </a>
                    </div>
                  </div>
                  <p
                    v-if="message.content"
                    class="whitespace-pre-wrap break-words"
                  >
                    {{ message.content }}
                  </p>
                </div>
                <button
                  v-if="canDeleteMessage(message)"
                  type="button"
                  class="absolute -right-2 -top-2 hidden h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm ring-1 ring-gray-200 transition hover:text-red-500 group-hover:flex"
                  @click="deleteMessage(message)"
                >
                  <i class="fa-solid fa-trash-can"></i>
                </button>
                <p
                  class="mt-1 text-xs text-gray-400"
                  :class="isOwnMessage(message) ? 'text-right' : 'text-left'"
                >
                  {{ formatMessageTime(message.createdAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="activeConversation && typingText"
          class="bg-gray-50 px-5 pb-2 text-xs text-gray-500"
        >
          {{ typingText }}
        </div>

        <div
          v-if="activeConversation"
          class="relative border-t border-gray-200 bg-white p-4"
          @dragenter.prevent="onDragEnter"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
        >
          <div
            v-if="isDraggingFiles"
            class="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-indigo-50/90 text-sm font-medium text-indigo-700 ring-2 ring-indigo-200"
          >
            Drop files to attach
          </div>
          <input
            ref="attachmentInput"
            type="file"
            multiple
            class="hidden"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            @change="handleAttachmentChange"
          />
          <form class="flex items-end gap-3" @submit.prevent="submitMessage">
            <div class="flex-1 space-y-3">
              <div
                v-if="pendingAttachments.length"
                class="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3"
              >
                <div
                  v-for="attachment in pendingAttachments"
                  :key="attachment.id"
                  class="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs text-gray-600 shadow-sm"
                >
                  <img
                    v-if="attachment.kind === 'image'"
                    :src="attachment.previewUrl"
                    :alt="attachment.name"
                    class="h-10 w-10 rounded object-cover"
                  />
                  <i
                    v-else
                    :class="getAttachmentIconClass(attachment)"
                    class="text-indigo-500"
                  ></i>
                  <div class="min-w-0">
                    <p class="max-w-[180px] truncate font-medium text-gray-700">
                      {{ attachment.name }}
                    </p>
                    <p class="text-[11px] text-gray-400">
                      {{ formatAttachmentSize(attachment.size) }}
                    </p>
                  </div>
                  <button
                    type="button"
                    class="text-gray-400 transition hover:text-red-500"
                    @click="removePendingAttachment(attachment.id)"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>

              <div class="flex items-end gap-3">
                <button
                  type="button"
                  class="rounded-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600"
                  @click="openAttachmentPicker"
                >
                  <i class="fa-solid fa-paperclip"></i>
                </button>
                <textarea
                  v-model="draftMessage"
                  rows="2"
                  placeholder="Type a message..."
                  class="min-h-[52px] flex-1 resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  @input="handleDraftInput"
                  @blur="stopTyping"
                  @keydown.enter.exact.prevent="submitMessage"
                  @keydown.enter.shift.exact.stop
                ></textarea>
              </div>
            </div>
            <button
              type="submit"
              class="rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-3 text-sm font-medium text-white transition hover:from-blue-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="
                sendingMessage ||
                (!draftMessage.trim() && !pendingAttachments.length)
              "
            >
              {{ sendingMessage ? "Sending..." : "Send" }}
            </button>
          </form>
        </div>

        <div
          v-else
          class="flex flex-1 items-center justify-center bg-gray-50 p-8 text-center text-gray-500"
        >
          <p class="text-sm">Select a conversation or start a new chat.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { apolloClient } from "../../../apollo-client";
import {
  getChatContacts,
  getChatConversations,
  getChatMessages,
} from "../../graphql/queries";
import {
  findOrCreateDirectConversation,
  deleteChatMessage,
  markChatConversationAsRead,
  sendChatMessage,
} from "../../graphql/mutations";
import { socket } from "../../socket/socket";
import { useNotificationStore } from "../../store/notification";
import { useUserStore } from "../../store/userStore";
import { useModalStore } from "../../store/useModalStore";

const userStore = useUserStore();
const notificationStore = useNotificationStore();
const modalStore = useModalStore();
const route = useRoute();
const router = useRouter();
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
const attachmentInput = ref(null);
const pendingAttachments = ref([]);
const isDraggingFiles = ref(false);
const dragDepth = ref(0);
const typingFromUserId = ref(null);
let typingClearTimeout;
let typingStopEmitTimeout;
let typingSent = false;
const currentUserId = computed(() => userStore.userInfo?.id || null);
const currentRole = computed(() =>
  String(userStore.userInfo?.role || "")
    .trim()
    .toLowerCase(),
);
const bannerText = computed(() => {
  if (currentRole.value === "teacher") {
    return "Teachers can chat with related parents and school admins.";
  }
  if (currentRole.value === "parent") {
    return "Parents can chat with linked teachers and school admins.";
  }
  if (currentRole.value === "admin" || currentRole.value === "super_admin") {
    return "Admins can chat with teachers and parents.";
  }
  return "Chat with your school contacts.";
});
const activeConversation = computed(
  () =>
    conversations.value.find(
      (conversation) => conversation.id === activeConversationId.value,
    ) || null,
);
const activeParticipant = computed(() =>
  getOtherParticipant(activeConversation.value),
);
const activeMessages = computed(
  () => messagesByConversation.value[activeConversationId.value] || [],
);
const typingText = computed(() => {
  if (!activeConversationId.value) return "";
  if (!typingFromUserId.value) return "";

  const participant = activeParticipant.value;
  if (participant?.displayName) {
    return `${participant.displayName} is typing...`;
  }
  return "Typing...";
});
const filteredContacts = computed(() =>
  filterItems(contacts.value, searchTerm.value, (contact) => [
    contact.displayName,
    contact.email,
    contact.subtitle,
  ]),
);
const filteredConversations = computed(() => {
  const sorted = [...conversations.value].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );
  return filterItems(sorted, searchTerm.value, (conversation) => {
    const other = getOtherParticipant(conversation);
    return [
      other?.displayName,
      other?.email,
      other?.subtitle,
      getConversationPreview(conversation),
    ];
  });
});

function filterItems(items, search, getValues) {
  const normalizedSearch = String(search || "")
    .trim()
    .toLowerCase();
  if (!normalizedSearch) return items;
  return items.filter((item) =>
    getValues(item)
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedSearch)),
  );
}

function notifyError(error, fallbackMessage) {
  notificationStore.addNotification({
    type: "error",
    message: error?.message || fallbackMessage,
  });
}

function normalizeConversation(conversation) {
  return {
    ...conversation,
    participants: Array.isArray(conversation?.participants)
      ? conversation.participants
      : [],
    lastMessage: conversation?.lastMessage || null,
    unreadCount: Number(conversation?.unreadCount || 0),
  };
}

function getInitials(person) {
  if (!person) return "?";
  const displayName =
    person.displayName ||
    [person.name, person.surname].filter(Boolean).join(" ");
  return String(displayName)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getOtherParticipant(conversation) {
  return (
    conversation?.participants?.find(
      (participant) => participant.id !== currentUserId.value,
    ) ||
    conversation?.participants?.[0] ||
    null
  );
}

function getConversationTitle(conversation) {
  return getOtherParticipant(conversation)?.displayName || "Conversation";
}

function getConversationPreview(conversation) {
  if (
    typingFromUserId.value &&
    conversation?.id === activeConversationId.value &&
    getOtherParticipant(conversation)?.id === typingFromUserId.value
  ) {
    return "Typing...";
  }

  if (!conversation?.lastMessage?.content) {
    if (conversation?.lastMessage?.attachments?.length) {
      return conversation.lastMessage.attachments.length === 1
        ? "Attachment"
        : `${conversation.lastMessage.attachments.length} attachments`;
    }
    return "No messages yet";
  }
  return conversation.lastMessage.sender?.id === currentUserId.value
    ? `You: ${conversation.lastMessage.content}`
    : conversation.lastMessage.content;
}

function getConversationPreviewThumbnail(conversation) {
  const attachments = conversation?.lastMessage?.attachments;
  const first = Array.isArray(attachments) ? attachments[0] : null;
  if (first?.kind === "image" && first?.url) {
    return first.url;
  }
  return "";
}

function getConversationPreviewIcon(conversation) {
  if (
    typingFromUserId.value &&
    conversation?.id === activeConversationId.value &&
    getOtherParticipant(conversation)?.id === typingFromUserId.value
  ) {
    return "";
  }

  const attachments = conversation?.lastMessage?.attachments;
  const first = Array.isArray(attachments) ? attachments[0] : null;
  if (!first) return "";
  if (first.kind === "image") return "fa-solid fa-image";
  return getAttachmentIconClass(first);
}

function formatConversationTime(value) {
  if (!value) return "";
  const date = new Date(value);
  const sameDay = date.toDateString() === new Date().toDateString();
  return new Intl.DateTimeFormat(
    undefined,
    sameDay
      ? { hour: "numeric", minute: "2-digit" }
      : { month: "short", day: "numeric" },
  ).format(date);
}

function formatMessageTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function isOwnMessage(message) {
  return message?.sender?.id === currentUserId.value;
}

function isWithinDeleteWindow(message) {
  if (!message?.createdAt) return false;
  const createdAtMs = new Date(message.createdAt).getTime();
  const ageMs = Date.now() - createdAtMs;
  return ageMs <= 30 * 60 * 1000;
}

function canDeleteMessage(message) {
  if (!message?.id) return false;
  return isOwnMessage(message) && isWithinDeleteWindow(message);
}

function getAttachmentIconClass(attachment) {
  const mimeType = String(attachment?.mimeType || "").toLowerCase();
  const name = String(attachment?.name || "").toLowerCase();

  if (mimeType.startsWith("image/")) return "fa-solid fa-image";
  if (mimeType.includes("pdf") || name.endsWith(".pdf"))
    return "fa-solid fa-file-pdf";
  if (
    mimeType.includes("word") ||
    name.endsWith(".doc") ||
    name.endsWith(".docx")
  ) {
    return "fa-solid fa-file-word";
  }
  if (
    mimeType.includes("excel") ||
    mimeType.includes("spreadsheet") ||
    name.endsWith(".xls") ||
    name.endsWith(".xlsx")
  ) {
    return "fa-solid fa-file-excel";
  }
  if (
    mimeType.includes("powerpoint") ||
    name.endsWith(".ppt") ||
    name.endsWith(".pptx")
  ) {
    return "fa-solid fa-file-powerpoint";
  }
  if (mimeType.startsWith("text/") || name.endsWith(".txt"))
    return "fa-solid fa-file-lines";
  return "fa-solid fa-paperclip";
}

function formatAttachmentSize(size) {
  const value = Number(size || 0);
  if (value >= 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (value >= 1024) {
    return `${Math.round(value / 1024)} KB`;
  }
  return `${value} B`;
}

async function scrollToBottom() {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

function upsertConversation(conversation) {
  const normalized = normalizeConversation(conversation);
  const index = conversations.value.findIndex(
    (item) => item.id === normalized.id,
  );
  if (index === -1) {
    conversations.value = [normalized, ...conversations.value];
    return normalized;
  }
  conversations.value.splice(index, 1, {
    ...conversations.value[index],
    ...normalized,
  });
  return conversations.value[index];
}

async function fetchContacts() {
  loadingContacts.value = true;
  try {
    const { data } = await apolloClient.query({
      query: getChatContacts,
      fetchPolicy: "network-only",
    });
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
    const { data } = await apolloClient.query({
      query: getChatConversations,
      fetchPolicy: "network-only",
    });
    conversations.value = (data?.getChatConversations || []).map(
      normalizeConversation,
    );
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
    await apolloClient.mutate({
      mutation: markChatConversationAsRead,
      variables: { conversationId },
    });
  } catch {
    // Ignore read refresh failures in the UI.
  }
}

async function fetchMessages(conversationId) {
  if (!conversationId) return;
  loadingMessages.value = true;
  try {
    const { data } = await apolloClient.query({
      query: getChatMessages,
      variables: { conversationId },
      fetchPolicy: "network-only",
    });
    messagesByConversation.value = {
      ...messagesByConversation.value,
      [conversationId]: data?.getChatMessages || [],
    };
    await markConversationRead(conversationId);
    const currentConversation = conversations.value.find(
      (conversation) => conversation.id === conversationId,
    );
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
  stopTyping();
  typingFromUserId.value = null;
  pendingAttachments.value = [];
  activeConversationId.value = conversationId;
  if (!messagesByConversation.value[conversationId]) {
    await fetchMessages(conversationId);
    return;
  }
  await markConversationRead(conversationId);
  const currentConversation = conversations.value.find(
    (conversation) => conversation.id === conversationId,
  );
  if (currentConversation) {
    upsertConversation({ ...currentConversation, unreadCount: 0 });
  }
  scrollToBottom();
}

async function startConversation(contact) {
  try {
    const { data } = await apolloClient.mutate({
      mutation: findOrCreateDirectConversation,
      variables: { participantId: contact.id },
    });
    const conversation = upsertConversation(
      data?.findOrCreateDirectConversation,
    );
    showContacts.value = false;
    await openConversation(conversation.id);
  } catch (error) {
    notifyError(error, "Failed to start conversation.");
  }
}

async function handleConversationQuery() {
  const conversationId = String(route.query?.conversationId || "").trim();
  if (!conversationId) return;

  const conversationExists = conversations.value.some(
    (conversation) => conversation.id === conversationId,
  );

  if (!conversationExists) return;

  if (activeConversationId.value !== conversationId) {
    await openConversation(conversationId);
  }

  router.replace({ path: route.path, query: {} });
}

async function submitMessage() {
  if (
    !activeConversationId.value ||
    (!draftMessage.value.trim() && !pendingAttachments.value.length)
  ) {
    return;
  }
  sendingMessage.value = true;
  try {
    stopTyping();
    await apolloClient.mutate({
      mutation: sendChatMessage,
      variables: {
        conversationId: activeConversationId.value,
        content: draftMessage.value.trim() || null,
        attachments: pendingAttachments.value.map((attachment) => ({
          name: attachment.name,
          mimeType: attachment.mimeType,
          size: attachment.size,
          dataUrl: attachment.dataUrl,
        })),
      },
    });
    draftMessage.value = "";
    pendingAttachments.value = [];
  } catch (error) {
    notifyError(error, "Failed to send message.");
  } finally {
    sendingMessage.value = false;
  }
}

function openAttachmentPicker() {
  attachmentInput.value?.click();
}

function removePendingAttachment(attachmentId) {
  pendingAttachments.value = pendingAttachments.value.filter(
    (attachment) => attachment.id !== attachmentId,
  );
}

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read attachment"));
    reader.readAsDataURL(file);
  });
}

async function handleFiles(files) {
  const selectedFiles = Array.isArray(files) ? files : [];
  if (!selectedFiles.length) return;

  const nextTotal = pendingAttachments.value.length + selectedFiles.length;
  if (nextTotal > 5) {
    notifyError(null, "You can attach up to 5 files per message.");
    return;
  }

  const prepared = [];

  for (const file of selectedFiles) {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`${file.name} exceeds the 5MB limit.`);
    }

    const dataUrl = await fileToDataUrl(file);
    prepared.push({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      name: file.name,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      dataUrl,
      previewUrl: dataUrl,
      kind: file.type?.startsWith("image/") ? "image" : "file",
    });
  }

  pendingAttachments.value = [...pendingAttachments.value, ...prepared];
}

async function handleAttachmentChange(event) {
  const files = Array.from(event?.target?.files || []);
  if (!files.length) return;

  try {
    await handleFiles(files);
  } catch (error) {
    notifyError(error, "Failed to attach file.");
  } finally {
    event.target.value = "";
  }
}

function onDragEnter() {
  dragDepth.value += 1;
  isDraggingFiles.value = true;
}

function onDragOver() {
  isDraggingFiles.value = true;
}

function onDragLeave() {
  dragDepth.value = Math.max(0, dragDepth.value - 1);
  if (!dragDepth.value) {
    isDraggingFiles.value = false;
  }
}

async function onDrop(event) {
  dragDepth.value = 0;
  isDraggingFiles.value = false;

  const files = Array.from(event?.dataTransfer?.files || []);
  if (!files.length) return;

  try {
    await handleFiles(files);
  } catch (error) {
    notifyError(error, "Failed to attach file.");
  }
}

function removeMessageLocally(conversationId, messageId) {
  const existingMessages = messagesByConversation.value[conversationId] || [];
  messagesByConversation.value = {
    ...messagesByConversation.value,
    [conversationId]: existingMessages.filter((item) => item.id !== messageId),
  };
}

function deleteMessage(message) {
  if (!message?.id) return;

  const title = String(message.content || "").trim();
  modalStore.deleteModal = true;
  modalStore.modalId = message.id;
  modalStore.modalTitle = title || "this message";
  modalStore.source = "chatMessage";
  modalStore.data = {
    conversationId: message.conversationId,
  };
}

function emitTyping(isTyping) {
  if (!socket?.connected) return;
  if (!activeConversationId.value) return;
  socket.emit("chatTyping", {
    conversationId: activeConversationId.value,
    isTyping: Boolean(isTyping),
  });
}

function stopTyping() {
  if (typingStopEmitTimeout) {
    clearTimeout(typingStopEmitTimeout);
    typingStopEmitTimeout = null;
  }

  if (typingSent) {
    emitTyping(false);
    typingSent = false;
  }
}

function handleDraftInput() {
  if (!activeConversationId.value) return;

  if (!typingSent) {
    emitTyping(true);
    typingSent = true;
  }

  if (typingStopEmitTimeout) {
    clearTimeout(typingStopEmitTimeout);
  }

  typingStopEmitTimeout = setTimeout(() => {
    stopTyping();
  }, 1200);
}

function onChatTyping(payload) {
  const conversationId = payload?.conversationId;
  const userId = payload?.userId;
  const isTyping = Boolean(payload?.isTyping);

  if (!conversationId || conversationId !== activeConversationId.value) return;
  if (!userId || userId === currentUserId.value) return;

  if (!isTyping) {
    if (typingFromUserId.value === userId) {
      typingFromUserId.value = null;
    }
    return;
  }

  typingFromUserId.value = userId;

  if (typingClearTimeout) {
    clearTimeout(typingClearTimeout);
  }

  typingClearTimeout = setTimeout(() => {
    typingFromUserId.value = null;
  }, 2000);
}

function onConversationUpdated(conversation) {
  const updated = upsertConversation(conversation);
  if (updated.id === activeConversationId.value) {
    upsertConversation({ ...updated, unreadCount: 0 });
  }
}

function onMessageCreated(message) {
  const existingMessages =
    messagesByConversation.value[message.conversationId] || [];
  if (!existingMessages.some((item) => item.id === message.id)) {
    messagesByConversation.value = {
      ...messagesByConversation.value,
      [message.conversationId]: [...existingMessages, message],
    };
  }
  if (message.conversationId === activeConversationId.value) {
    scrollToBottom();
  }
}

function onMessageDeleted(payload) {
  const conversationId = payload?.conversationId;
  const messageId = payload?.messageId;
  if (!conversationId || !messageId) return;
  removeMessageLocally(conversationId, messageId);
}

onMounted(async () => {
  socket.on("chatConversationUpdated", onConversationUpdated);
  socket.on("chatMessageCreated", onMessageCreated);
  socket.on("chatMessageDeleted", onMessageDeleted);
  socket.on("chatTyping", onChatTyping);
  await Promise.all([fetchContacts(), fetchConversations()]);
  await handleConversationQuery();
});

onBeforeUnmount(() => {
  stopTyping();
  socket.off("chatConversationUpdated", onConversationUpdated);
  socket.off("chatMessageCreated", onMessageCreated);
  socket.off("chatMessageDeleted", onMessageDeleted);
  socket.off("chatTyping", onChatTyping);
});

watch(
  () => route.query?.conversationId,
  async () => {
    await handleConversationQuery();
  },
);
</script>
