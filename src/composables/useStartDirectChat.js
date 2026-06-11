import { useRouter } from "vue-router";
import { apolloClient } from "../../apollo-client";
import { findOrCreateDirectConversation } from "../graphql/mutations";
import { useNotificationStore } from "../store/notification";

export function useStartDirectChat() {
  const router = useRouter();
  const notificationStore = useNotificationStore();

  const startDirectChat = async (participantId) => {
    if (!participantId) return null;

    try {
      const { data } = await apolloClient.mutate({
        mutation: findOrCreateDirectConversation,
        variables: { participantId },
      });

      const conversation = data?.findOrCreateDirectConversation;
      if (!conversation?.id) {
        throw new Error("Conversation could not be created");
      }

      await router.push({
        path: "/messages",
        query: { conversationId: conversation.id },
      });

      return conversation;
    } catch (error) {
      notificationStore.addNotification({
        type: "error",
        message: error?.message || "Failed to start chat.",
      });
      throw error;
    }
  };

  return { startDirectChat };
}
