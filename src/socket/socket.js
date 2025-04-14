import { io } from "socket.io-client";

// Update this URL to match your backend's socket endpoint.
const SOCKET_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("token");

// Initialize socket connection with improved configuration
const socket = io(SOCKET_URL, {
  autoConnect: true, // Changed to true for immediate connection
  reconnection: true,
  reconnectionAttempts: Infinity, // Changed to Infinity to keep trying
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000, // Added max delay
  timeout: 20000, // Added connection timeout
  transports: ["websocket", "polling"],
  auth: {
    token: getToken(),
  },
});

socket.on("connect", () => {
  console.log("Socket connected with id:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected. Reason:", reason);
  
  // Automatically reconnect if the server disconnected us
  if (reason === "io server disconnect") {
    socket.connect();
  }
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);

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
  
  // Only reconnect if we're not already connected
  if (!socket.connected) {
    socket.connect();
  }
};

// More intelligent ping mechanism
let pingInterval;

function startPingInterval() {
  // Clear any existing interval
  if (pingInterval) clearInterval(pingInterval);
  
  pingInterval = setInterval(() => {
    if (socket.connected) {
      // Send a ping to keep the connection alive
      socket.emit("ping", { timestamp: Date.now() });
    } else {
      console.log("Socket is disconnected, attempting to reconnect...");
      socket.connect();
    }
  }, 15000); // Check every 15 seconds (reduced from 30)
}

// Start ping on initial load
startPingInterval();

// Handle page visibility changes to reconnect when user returns to the app
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    if (!socket.connected) {
      console.log("Page became visible, reconnecting socket...");
      socket.connect();
    }
    startPingInterval(); // Restart ping interval
  } else {
    // Optionally reduce ping frequency when tab is not visible
    clearInterval(pingInterval);
  }
});

export { socket, updateToken };
