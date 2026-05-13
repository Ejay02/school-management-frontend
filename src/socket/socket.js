import { io } from "socket.io-client";
import { useUserStore } from "../store/userStore";

const SOCKET_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("token");
const getRefreshToken = () => localStorage.getItem("refreshToken");

const persistTokens = (token, refreshToken) => {
  if (token) {
    localStorage.setItem("token", token);
  }

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  const savedUser = localStorage.getItem("userInfo");
  if (!savedUser) {
    return;
  }

  try {
    const parsedUser = JSON.parse(savedUser);
    const nextUser = {
      ...parsedUser,
      token: token ?? parsedUser.token,
      refreshToken: refreshToken ?? parsedUser.refreshToken,
    };
    localStorage.setItem("userInfo", JSON.stringify(nextUser));
  } catch {
    localStorage.removeItem("userInfo");
  }
};

const clearStoredAuth = () => {
  try {
    const userStore = useUserStore();
    userStore.clearUser();
  } catch {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }
};

const hasSocketCredentials = () =>
  Boolean(getToken()) || Boolean(getRefreshToken());

const applySocketAuth = (overrides = {}) => {
  const token = overrides.token ?? getToken();
  const refreshToken = overrides.refreshToken ?? getRefreshToken();

  socket.auth = {
    ...(token ? { token } : {}),
    ...(refreshToken ? { refreshToken } : {}),
  };
};

let allowReconnect = false;

const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ["websocket", "polling"],
  auth: {},
});

socket.on("connect", () => {
  console.log("Socket connected with id:", socket.id);
  try {
    const userStore = useUserStore();
    const userId = userStore.userInfo?.id;
    const role = userStore.userInfo?.role;
    if (userId && role) {
      socket.emit("joinRooms", {
        role,
        classId: userStore.userInfo?.classId,
        userId,
      });
    }
  } catch {}
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected. Reason:", reason);

  if (
    reason === "io server disconnect" &&
    allowReconnect &&
    hasSocketCredentials()
  ) {
    applySocketAuth();
    socket.connect();
  }
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
  if (
    error.message?.includes("Invalid authentication token") ||
    error.message?.includes("Authentication required")
  ) {
    allowReconnect = false;
    clearStoredAuth();
  }
});

socket.on("authRefreshed", ({ accessToken, refreshToken }) => {
  persistTokens(accessToken, refreshToken);
  applySocketAuth({
    token: accessToken,
    refreshToken,
  });
});

socket.on("error", (payload) => {
  if (
    payload?.code === "TOKEN_EXPIRED" ||
    payload?.message === "Invalid authentication token" ||
    payload?.message === "Authentication required"
  ) {
    allowReconnect = false;
    clearStoredAuth();
    socket.disconnect();
  }
});

socket.on("forceLogout", () => {
  allowReconnect = false;
  clearStoredAuth();
  socket.disconnect();
  window.location.href = "/login";
});

const connectSocket = () => {
  if (!hasSocketCredentials()) {
    allowReconnect = false;
    return;
  }

  allowReconnect = true;
  applySocketAuth();
  startPingInterval();

  if (!socket.connected && !socket.active) {
    socket.connect();
  }
};

const disconnectSocket = () => {
  allowReconnect = false;
  if (socket.connected || socket.active) {
    socket.disconnect();
  }
};

const updateToken = (newToken, newRefreshToken) => {
  persistTokens(newToken, newRefreshToken);
  connectSocket();
};

let pingInterval;

function startPingInterval() {
  if (pingInterval) clearInterval(pingInterval);

  pingInterval = setInterval(() => {
    if (socket.connected) {
      socket.emit("ping", { timestamp: Date.now() });
    }
  }, 15000);
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    if (!socket.connected && allowReconnect && hasSocketCredentials()) {
      connectSocket();
    }
    startPingInterval();
  } else {
    clearInterval(pingInterval);
  }
});

export { socket, connectSocket, disconnectSocket, updateToken };
