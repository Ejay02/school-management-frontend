import { io } from "socket.io-client";

// Update this URL to match your backend's socket endpoint.
const SOCKET_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("token");

// Initialize socket connection
const socket = io(SOCKET_URL, {
  // Optional configuration
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ["websocket", "polling"],
  auth: {
    token: getToken(),
  },
});

socket.on("connect", () => {
  console.log("Socket connected with id:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);

  if (error.message === "Invalid token") {
    // Handle invalid token (e.g., redirect to login)
    console.log("Invalid token, please login again");
  }
});

// Add a test listener to check if any event is being received
socket.onAny((eventName, ...args) => {
  console.log(`Received event: ${eventName}`, args);
});

const updateToken = (newToken) => {
  socket.auth = { token: newToken };
  socket.connect();
};

// Ping the server periodically to check connection
setInterval(() => {
  if (socket.connected) {
    console.log("Socket is still connected");
  } else {
    console.log("Socket is disconnected, attempting to reconnect...");
    socket.connect();
  }
}, 30000); // Check every 30 seconds

export { socket, updateToken };
