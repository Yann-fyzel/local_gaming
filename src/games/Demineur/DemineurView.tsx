import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../hooks/useSocket.js';
import { useLogStore } from '../../store/useLogStore.js';
import { Bomb, Timer, AlertTriangle, Trophy } from 'lucide-react';
import Confetti from 'react-confetti';

interface MSUpdate {
    grid: (number | string)[];
    status: "playing" | "won" | "lost";
    time?: number;
}

export const MinesweeperView = () => {
    const socket = useSocket();
    const addLog = useLogStore((s) => s.addLog);
    const [roomId, setRoomId] = useState<string>("");
    const hasStarted = useRef(false);


    const [gameState, setGameState] = useState<MSUpdate | null>(null);


    const [timer, setTimer] = useState(0);


    useEffect(() => {
        let interval: number | undefined;

        if (gameState?.status === "playing") {
            interval = window.setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        } else {

            if (interval) clearInterval(interval);
        }

        //  Nettoyage au démontage ou changement de statut
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [gameState?.status]); // ✅ Une seule dépendance propre



    useEffect(() => {
        if (!socket) return;

        const onMatchFound = (id: string) => {
            setRoomId(id);
            setTimer(0);
            socket.emit("ms:start", { roomId: id, size: 9, mines: 10 });
            addLog(`Match trouvé dans ${id} !`);
        };

        const onUpdate = (data: MSUpdate) => {
            setGameState(data);
        };

        socket.on("ms:match_found", onMatchFound);
        socket.on("ms:update", onUpdate);

        // Lancer une partie (9x9 avec 10 mines par défaut)
        const startSearch = () => {
            if (!hasStarted.current) {
                socket.emit("ms:find_match");
                hasStarted.current = true;
            }
        };

        // Si déjà connecté, on lance, sinon on attend l'event 'connect'
        if (socket.connected) {
            startSearch();
        } else {
            socket.once("connect", startSearch);
        }


        return () => {
            socket.off("ms:update", onUpdate);
            socket.off("ms:match_found", onMatchFound);
            socket.off("connect", startSearch);
        };
    }, [socket, addLog, roomId]);

    const handleReveal = (index: number) => {
        if (!socket || gameState?.status !== "playing") return;
        socket.emit("ms:reveal", { roomId, index });
    };

    const getNumberColor = (num: number | string) => {
        const colors: Record<number, string> = {
            1: "text-blue-400", 2: "text-green-400", 3: "text-red-400",
            4: "text-purple-400", 5: "text-yellow-400", 6: "text-cyan-400"
        };
        return typeof num === 'number' ? colors[num] || "text-white" : "";
    };

    if (!gameState) return (
        <div className="min-h-screen bg-[#0a0f12] flex items-center justify-center">
            <div className="text-cyan-500 font-black tracking-[0.3em] animate-pulse uppercase italic text-sm">
                Initialisation des charges...
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0f12] text-slate-100 font-sans pb-10">

            <div className="flex flex-col items-center p-4 sm:p-8">
                {/* Header Tactique : Status & Timer */}
                <div className="flex justify-between w-full max-w-sm mb-8 bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-3 text-red-500 font-black text-xs uppercase tracking-tighter shadow-red-500/20">
                        <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                            <Bomb size={18} className="drop-shadow-[0_0_8px_#ef4444]" />
                        </div>
                        <span>10 Mines</span>
                    </div>

                    <div className="flex items-center gap-3 text-cyan-400 font-black text-xs uppercase tracking-tighter">
                        <span>{gameState.status === "playing" ? `${timer}s` : `${gameState.time || timer}s`}</span>
                        <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                            <Timer size={18} className="drop-shadow-[0_0_8px_#22d3ee]" />
                        </div>
                    </div>
                </div>

                {/* Grille 9x9 - Responsive (Cellules de ~9vw sur mobile) */}
                <div className="inline-grid grid-cols-9 gap-1 sm:gap-1.5 bg-slate-950 p-2 sm:p-3 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                    {gameState.grid.map((cell, i) => (
                        <button
                            type='button'
                            key={i}
                            onClick={() => handleReveal(i)}
                            disabled={cell !== -1 || gameState.status !== "playing"}
                            className={`
                            w-[9.2vw] h-[9.2vw] max-w-10.5 max-h-10.5 sm:w-11 sm:h-11
                            flex items-center justify-center font-black text-sm sm:text-lg rounded-md transition-all duration-200
                            ${cell === -1
                                    ? "bg-slate-800 hover:bg-slate-700 border-b-2 border-slate-950 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] active:border-b-0 active:translate-y-0.5"
                                    : "bg-[#070a0f] border border-white/5 cursor-default shadow-inner"
                                }
                            ${cell === 'M' ? "bg-red-600 shadow-[0_0_20px_#ef4444] z-10 scale-110" : ""}
                        `}
                        >
                            {cell !== -1 && cell !== 0 && (
                                <span className={`
                                ${cell === 'M' ? "animate-pulse" : getNumberColor(cell)}
                                drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]
                            `}>
                                    {cell === 'M' ? <Bomb size={16} /> : cell}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Modal de Fin - Même structure que les autres jeux */}
                {gameState.status !== "playing" && (
                    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
                        {gameState.status === 'won' && <Confetti recycle={false} numberOfPieces={500} gravity={0.2} />}

                        <div className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] text-center shadow-[0_0_60px_rgba(0,0,0,0.4)] max-w-xs w-full">
                            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center border-2 
                            ${gameState.status === 'won' ? 'border-cyan-500 bg-cyan-500/10' : 'border-red-500 bg-red-500/10'}`}>
                                {gameState.status === 'won' ? (
                                    <Trophy className="text-cyan-400 drop-shadow-[0_0_10px_#22d3ee]" size={40} />
                                ) : (
                                    <AlertTriangle className="text-red-500 drop-shadow-[0_0_10px_#ef4444]" size={40} />
                                )}
                            </div>

                            <h2 className={`text-2xl font-black italic mb-2 tracking-tighter uppercase
                            ${gameState.status === 'won' ? 'text-cyan-400' : 'text-red-500'}`}>
                                {gameState.status === 'won' ? "ZONE SÉCURISÉE" : "DÉTONATION !"}
                            </h2>

                            <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] mb-8 font-bold">
                                {gameState.status === 'won' ? "Toutes les mines ont été neutralisées" : "Protocole de survie échoué"}
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    type='button'
                                    onClick={() => { hasStarted.current = false; window.location.reload(); }}
                                    className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl font-black text-[11px] tracking-widest text-white shadow-xl active:scale-95 transition-all"
                                >
                                    RÉARMER LE TERRAIN
                                </button>

                                <button
                                    type='button'
                                    onClick={() => window.location.href = "/lobby"}
                                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[11px] tracking-widest text-slate-400 active:scale-95 transition-all"
                                >
                                    QUITTER LA ZONE
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

};
