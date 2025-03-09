import { io } from "socket.io-client";

// Update this URL to match your backend's socket endpoint.
const SOCKET_URL = import.meta.env.VITE_API_URL;

// Initialize socket connection
const socket = io(SOCKET_URL, {
  // Optional configuration
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("Socket connected with id:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

// Add a test listener to check if any event is being received
socket.onAny((eventName, ...args) => {
  console.log(`Received event: ${eventName}`, args);
});

// Ping the server periodically to check connection
setInterval(() => {
  if (socket.connected) {
    console.log('Socket is still connected');
  } else {
    console.log('Socket is disconnected, attempting to reconnect...');
    socket.connect();
  }
}, 30000); // Check every 30 seconds

export default socket;
