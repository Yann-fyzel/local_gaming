import { create } from "zustand";

interface LogEntry {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
}

interface LogState {
  logs: LogEntry[];
  addLog: (message: string, type?: LogEntry["type"]) => void;
  clearLogs: () => void;
}

export const useLogStore = create<LogState>((set) => ({
  logs: [],
  addLog: (message, type = "info") => {
    const newLog = {
      id: Math.random().toString(36).substring(7),
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    set((state) => ({ logs: [newLog, ...state.logs].slice(0, 50) })); // Garde les 50 derniers
    console.log(`[${newLog.timestamp}] ${type.toUpperCase()}: ${message}`);
  },
  clearLogs: () => set({ logs: [] }),
}));
