import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  from,
} from "@apollo/client/core";
import { onError } from "@apollo/client/link/error";

import { useUserStore } from "./src/store/userStore";
import { useNotificationStore } from "./src/store/notification";
import router from "./src/router";

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      // Check for authentication errors
      if (
        extensions?.code === "UNAUTHENTICATED" ||
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("unauthenticated")
      ) {
        const userStore = useUserStore();
        const notificationStore = useNotificationStore();

        // Clear user data
        userStore.clearUser();

        // Show notification
        notificationStore.addNotification({
          type: "error",
          message: "Session expired. Please log in again.",
        });

        // Redirect to login
        router.push("/login");
      }
    });
  }
});

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_API_URL}/graphql`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache,
});

export { apolloClient };
