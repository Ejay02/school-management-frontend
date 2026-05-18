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
  const code =
    error?.graphQLErrors?.[0]?.extensions?.code ||
    error?.cause?.graphQLErrors?.[0]?.extensions?.code ||
    error?.networkError?.result?.errors?.[0]?.extensions?.code;

  if (
    code === "INTERNAL_SERVER_ERROR" ||
    normalizedMessage.includes("cannot read properties") ||
    normalizedMessage.includes("undefined") ||
    normalizedMessage.includes("typeerror") ||
    normalizedMessage.includes("syntaxerror") ||
    normalizedMessage.includes("findunique") ||
    normalizedMessage.includes("getmetadata") ||
    normalizedMessage.includes("reflect-metadata")
  ) {
    return fallbackMessage;
  }

  if (
    normalizedMessage.includes("account is deactivated") ||
    normalizedMessage.includes("account has been suspended") ||
    normalizedMessage.includes("suspend")
  ) {
    return "⚠️Account has been suspended, contact your admin for more info";
  }

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
