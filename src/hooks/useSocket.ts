import { useSocketStore } from "../store/useSocketStore";

export const useSocket = () => {
  const socket = useSocketStore((s) => s.socket);

  return socket;
};
