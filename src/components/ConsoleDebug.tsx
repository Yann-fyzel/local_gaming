import { useLogStore } from "../store/useLogStore";

export const GameConsole = () => {
    const logs = useLogStore((s) => s.logs);

    return (
        <div className="bg-black/80 p-4 rounded-lg font-mono text-xs h-40 overflow-y-auto border border-gaming-neon/20">
            {logs.map((log) => (
                <div key={log.id} className={`mb-1 ${log.type === 'error' ? 'text-red-400' : 'text-gaming-neon'}`}>
                    <span className="opacity-50">[{log.timestamp}]</span> {log.message}
                </div>
            ))}
        </div>
    );
};
