import { defineStore } from "pinia";
import { apolloClient } from "../../apollo-client";
import { getChatConversations } from "../graphql/queries";

export const useChatStore = defineStore("chat", {
  state: () => ({
    conversationsById: {},
    loading: false,
    error: null,
  }),
  getters: {
    unreadCount: (state) => {
      return Object.values(state.conversationsById).reduce((total, conversation) => {
        return total + Number(conversation?.unreadCount || 0);
      }, 0);
    },
    unreadCountLabel() {
      const count = this.unreadCount;
      if (count > 99) return "99+";
      return String(count);
    },
  },
  actions: {
    upsertConversation(conversation) {
      if (!conversation?.id) return;
      this.conversationsById = {
        ...this.conversationsById,
        [conversation.id]: conversation,
      };
    },
    removeConversation(conversationId) {
      if (!conversationId) return;
      const { [conversationId]: _removed, ...rest } = this.conversationsById;
      this.conversationsById = rest;
    },
    clear() {
      this.conversationsById = {};
      this.loading = false;
      this.error = null;
    },
    async fetchConversations() {
      this.loading = true;
      this.error = null;
      try {
        const res = await apolloClient.query({
          query: getChatConversations,
          fetchPolicy: "network-only",
        });
        const conversations = res?.data?.getChatConversations || [];
        const next = {};
        conversations.forEach((conversation) => {
          if (!conversation?.id) return;
          next[conversation.id] = conversation;
        });
        this.conversationsById = next;
        return conversations;
      } catch (error) {
        this.error = error?.message || "Failed to fetch conversations";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});

