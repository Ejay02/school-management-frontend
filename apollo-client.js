import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";

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
  link: httpLink,
  cache,
});

export { apolloClient };
