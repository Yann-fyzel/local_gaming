import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../hooks/useSocket.js';
import { useLogStore } from '../../store/useLogStore.js';
import { Trophy } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';

interface GameState {
    board: (string | null)[];
    xIsNext: boolean;
    players: string[];
    status: "waiting" | "playing" | "finished";
    winner: string | null;
}

export const TicTacToeView = () => {
    const socket = useSocket();
    const hasJoined = useRef(false);
    const user = useAuthStore(s => s.user)
    const addLog = useLogStore((s) => s.addLog);
    const [game, setGame] = useState<GameState | null>(null);
    const [gameMode, setGameMode] = useState<'pvp' | 'ai' | null>(null);

    const [roomId, setRoomId] = useState<string>("");
    const myTurn = (game?.xIsNext && game?.players[0] === socket?.id) ||
        (!game?.xIsNext && game?.players[1] === socket?.id);




    useEffect(() => {
        // On n'exécute rien tant que le socket n'est pas là ET connecté
        if (!socket) return;

        const onMatchFound = (id: string) => {
            setRoomId(id);
            socket.emit("ttt:join", id);
            addLog(`Match trouvé dans ${id} !`);
        };

        const onUpdate = (updatedGame: GameState) => {
            setGame(updatedGame);
        };

        // On attache les écouteurs
        socket.on("ttt:match_found", onMatchFound);
        socket.on("ttt:update", onUpdate);
        socket.on("ttt:player_ready", onUpdate);



        return () => {
            socket.off("ttt:match_found", onMatchFound);
            socket.off("ttt:update", onUpdate);
            socket.off("ttt:player_ready", onUpdate);
            // On ne remet pas la ref à false pour bloquer le StrictMode
        };
    }, [addLog, socket]);
    // ✅ La fonction qui émet
    const startPvP = () => {
        setGameMode('pvp');
        socket?.emit("ttt:find_match", false);
    }


    const startAI = () => {
        setGameMode('ai');
        socket?.emit("ttt:find_match", true)
    }


    if (!gameMode) return (<div className="menu flex flex-col gap-3">
        <h2>Choisir le mode de jeu</h2>
        <button type="button"
            onClick={startPvP}
            className="w-full py-4 bg-linear-to-r from-cyan-500 to-blue-600 rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase text-white shadow-[0_10px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_10px_25px_rgba(6,182,212,0.5)] active:scale-95 transition-all">
            Jouer contre un Humain</button>
        <button type="button"
            onClick={startAI}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase text-slate-400 hover:bg-white/10 hover:text-white active:scale-95 transition-all">
            Jouer contre l'IA</button>
    </div>)


    if (!game) return (
        <div className="flex flex-col items-center justify-center h-screen bg-gaming-dark">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mb-4"></div>
            <p className="text-primary animate-pulse">Recherche d'un adversaire...</p>
        </div>
    );




    const handleCellClick = (index: number) => {
        if (!socket || !game || game.status !== "playing") return;

        // On envoie le coup au serveur
        socket.emit("ttt:move", { roomId, index });
    };

    if (!game) return <div className="p-10 text-center">Chargement du terrain...</div>;

    return (
        <div className="min-h-screen flex flex-col items-center bg-[#0b0e14] text-slate-100 font-sans p-4 sm:p-8">

            {/* Section Duel - Responsive (Flex-col sur mobile, Flex-row sur PC) */}
            <div className="w-full max-w-md mt-6 flex flex-col items-center gap-6">
                <div className="flex items-center justify-between w-full px-2 gap-4">
                    {/* Joueur X */}
                    <div className={`flex-1 flex flex-col items-center p-3 rounded-2xl border transition-all duration-500 ${game.xIsNext ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-white/5 opacity-30'}`}>
                        <span className="text-xs font-black tracking-widest text-cyan-400 truncate w-full text-center">
                            {game.players[0] === user?.id ? "MOI (X)" : "RIVAL (X)"}
                        </span>
                        {game.xIsNext && <span className="text-[9px] mt-1 animate-pulse font-bold tracking-tighter">REFLEXION...</span>}
                    </div>

                    <div className="text-xl font-black italic text-white/10">VS</div>

                    {/* Joueur O */}
                    <div className={`flex-1 flex flex-col items-center p-3 rounded-2xl border transition-all duration-500 ${!game.xIsNext ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'border-white/5 opacity-30'}`}>
                        <span className="text-xs font-black tracking-widest text-pink-400 truncate w-full text-center">
                            {game.players[1] === user?.id ? "MOI (O)" : "RIVAL (O)"}
                        </span>
                        {!game.xIsNext && <span className="text-[9px] mt-1 animate-pulse font-bold tracking-tighter">REFLEXION...</span>}
                    </div>
                </div>

                {/* Badge de Tour - Style Capsule Neon */}
                <div className={`px-6 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] border transition-all duration-500 shadow-lg ${myTurn ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-slate-900 border-white/10 text-white/30'
                    }`}>
                    {myTurn ? ">> TON TOUR <<" : "ATTENTE..."}
                </div>
            </div>

            {/* Grille de Jeu - Adaptative (w-24 sur PC, 26vw sur mobile) */}
            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4 p-3 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                {game.board.map((cell, i) => (
                    <button
                        type='button'
                        key={i}
                        onClick={() => handleCellClick(i)}
                        disabled={cell !== null || game.status !== "playing"}
                        className={`
            w-[26vw] h-[26vw] max-w-25 max-h-25 sm:w-24 sm:h-24
            bg-[#151a24] rounded-2xl flex items-center justify-center 
            text-4xl sm:text-5xl font-black transition-all duration-200 
            active:scale-90 active:bg-slate-700
            ${!cell && game.status === "playing" ? 'hover:bg-slate-800' : 'cursor-default'}
            border-b-4 border-black/40
          `}
                    >
                        <span className={`
            ${cell === 'X' ? 'text-cyan-400 drop-shadow-[0_0_10px_#06b6d4]' : 'text-pink-500 drop-shadow-[0_0_10px_#ec4899]'}
            ${cell ? 'scale-100' : 'scale-0'} transition-transform duration-300
          `}>
                            {cell}
                        </span>
                    </button>
                ))}
            </div>

            {/* Message de Victoire - Overlay de fin */}
            {game.status === "finished" && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-6">
                    <div className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-xs w-full backdrop-blur-sm">
                        {/* Icône et Texte */}
                        <div className="mb-8">
                            <Trophy className={`mx-auto mb-4 ${game.winner === 'draw' ? 'text-slate-500' : 'text-yellow-500 animate-bounce'}`} size={48} />
                            <h2 className="text-2xl font-black text-white italic mb-1 tracking-tighter uppercase">
                                {game.winner === 'draw' ? "ÉGALITÉ" : "MISSION RÉUSSIE"}
                            </h2>
                            <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                                {game.winner === 'draw' ? "Match nul détecté" : `Candidat ${game.winner} a gagné`}
                            </p>
                        </div>

                        {/* Groupe de Boutons */}
                        <div className="flex flex-col gap-3">
                            {/* Action Principale : Rejouer */}
                            <button
                                type='button'
                                onClick={() => { setGame(null); setGameMode(null); hasJoined.current = false; }}
                                className="w-full py-4 bg-linear-to-r from-cyan-500 to-blue-600 rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase text-white shadow-[0_10px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_10px_25px_rgba(6,182,212,0.5)] active:scale-95 transition-all"
                            >
                                RECHARGER LA PARTIE
                            </button>

                            {/* Action Secondaire : Lobby (Style Outline/Ghost) */}
                            <button
                                type='button'
                                onClick={() => { setGame(null); hasJoined.current = false; window.location.href = "/lobby"; }}
                                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase text-slate-400 hover:bg-white/10 hover:text-white active:scale-95 transition-all"
                            >
                                RETOUR AU LOBBY
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );

};
