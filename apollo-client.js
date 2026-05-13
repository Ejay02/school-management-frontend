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
import { isGraphQLAuthError } from "./src/utils/graphqlError";
import router from "./src/router";

const AUTH_EXEMPT_OPERATIONS = new Set([
  "Login",
  "AdminSignup",
  "TeacherSignup",
  "StudentSignup",
  "ParentSignup",
  "RefreshTokens",
  "Logout",
  "ResetPassword",
]);

// Error handling link
const errorLink = onError(({ graphQLErrors, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      // Check for authentication errors
      if (isGraphQLAuthError(message, extensions?.code)) {
        const hasSession = Boolean(localStorage.getItem("token"));
        const isPublicAuthRoute = ["/login", "/signup"].includes(
          router.currentRoute.value.path,
        );
        const isExemptOperation = AUTH_EXEMPT_OPERATIONS.has(
          operation?.operationName,
        );

        if (!hasSession || isPublicAuthRoute || isExemptOperation) {
          return;
        }

        const userStore = useUserStore();
        const notificationStore = useNotificationStore();

        // Clear user data
        userStore.clearUser();

        const normalizedMessage = String(message || "").toLowerCase();
        const displayMessage = normalizedMessage.includes("suspend")
          ? "⚠️Account has been suspended, contact your admin for more info"
          : "Session expired. Please log in again.";

        // Show notification
        notificationStore.addNotification({
          type: "error",
          message: displayMessage,
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
  credentials: "same-origin",
  headers: {
    "Apollo-Require-Preflight": "true",
  },
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache,
});

export { apolloClient };
