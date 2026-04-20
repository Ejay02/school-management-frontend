export const extractGraphQLErrorMessage = (
  error,
  fallbackMessage = "Something went wrong"
) => {
  const directGraphQLErrorMessage = error?.graphQLErrors?.[0]?.message;
  const nestedGraphQLErrorMessage = error?.cause?.graphQLErrors?.[0]?.message;
  const networkErrorMessage =
    error?.networkError?.result?.errors?.[0]?.message ||
    error?.networkError?.message;
  const fallbackErrorMessage = error?.message;

  return (
    directGraphQLErrorMessage ||
    nestedGraphQLErrorMessage ||
    networkErrorMessage ||
    fallbackErrorMessage ||
    fallbackMessage
  );
};

export const formatAuthErrorMessage = (
  error,
  fallbackMessage = "Unable to complete this action"
) => {
  const rawMessage = extractGraphQLErrorMessage(error, fallbackMessage);
  const normalizedMessage = rawMessage.toLowerCase();

  if (normalizedMessage.includes("invalid credentials")) {
    return "Incorrect username or password";
  }

  if (normalizedMessage.includes("invalid password")) {
    return "Incorrect password";
  }

  if (normalizedMessage.includes("refresh token expired")) {
    return "Session expired. Please log in again.";
  }

  if (normalizedMessage.includes("invalid refresh token")) {
    return "Session expired. Please log in again.";
  }

  return rawMessage;
};

export const isGraphQLAuthError = (message, code) => {
  const normalizedMessage = message?.toLowerCase?.() || "";

  return (
    code === "UNAUTHENTICATED" ||
    normalizedMessage.includes("unauthorized") ||
    normalizedMessage.includes("unauthenticated")
  );
};
