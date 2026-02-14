import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_BASE_URL, {
      withCredentials: true,
      autoConnect: false,
    });

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("SOCKET DISCONNECTED:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("CONNECT ERROR:", err.message);
    });

    socket.on("reconnect_attempt", () => {
      console.log("RECONNECTING...");
    });

    socket.on("reconnect_failed", () => {
      console.error("RECONNECT FAILED");
    });
  }

  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) s.connect();
};

export const disconnectSocket = () => {
  if (socket?.connected) socket.disconnect();
};
