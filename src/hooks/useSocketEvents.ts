import { useEffect } from "react";
import { useSocket } from "./useSocket.js";
import { useLogStore } from "../store/useLogStore.js";
import toast from "react-hot-toast";

interface UserJoinedData {
  userId: string;
}
export const useSocketEvents = () => {
  const socket = useSocket();
  const addLog = useLogStore((s) => s.addLog);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      addLog("Connecté au serveur de jeu", "success");
      toast.success("Serveur rejoint !");
    });

    socket.on("disconnect", () => {
      addLog("Connexion perdue avec le serveur", "error");
      toast.error("Déconnecté du réseau local");
    });

    socket.on("user_joined", (data: UserJoinedData) => {
      addLog(`Un nouveau joueur a rejoint le salon : ${data.userId}`, "info");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("user_joined");
    };
  }, [socket, addLog]);
};
