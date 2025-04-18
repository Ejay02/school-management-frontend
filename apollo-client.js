import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  from,
} from "@apollo/client/core";
import { onError } from "@apollo/client/link/error";

import { setContext } from "@apollo/client/link/context";
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

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_API_URL}/graphql`,
    // Enable file uploads by setting these options
    includeExtensions: true,
    credentials: 'same-origin',
    headers: {
      'Apollo-Require-Preflight': 'true'
    }
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache,
});

export { apolloClient };
