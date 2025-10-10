// frontend/src/socketClient.js
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_EMS_Base_URL.replace(/\/$/, ""), {
  autoConnect: false, // we’ll connect manually
  transports: ["websocket"],
  reconnectionAttempts: 5,
});

export default socket;
