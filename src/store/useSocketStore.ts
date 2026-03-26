import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface SocketState {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  connect: () => {
    const token = localStorage.getItem("token");
    if (!token || get().socket?.connected) return;

    const newSocket = io(SOCKET_URL, {
      path: "/socket.io/",
      transports: ["websocket"],
      autoConnect: true,
      auth: { token },
    });

    set({ socket: newSocket });
  },
  disconnect: () => {
    get().socket?.disconnect();
    set({ socket: null });
  },
}));
