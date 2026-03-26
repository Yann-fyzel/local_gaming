import { useEffect, useRef, useState } from 'react';
import { Trophy } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';

// Types alignés sur ton backend
type CellValue = 0 | 1 | 2;
interface Player { id: string; name: string; globalTimer: number; }
interface GameState {
    id: string;
    status: "waiting" | "playing" | "finished" | "timeout";
    board: CellValue[][];
    players: { [key: string]: Player };
    activePlayer: 1 | 2;
    winner: string | null;
    turnStartTime: number;
}

const Puissance4 = () => {


    const socket = useSocket();
    const hasStarted = useRef(false);
    const [game, setGame] = useState<GameState | null>(null);
    const [timeLeft, setTimeLeft] = useState(30);

    // `socket` est stable, on met les handlers une seule fois
    useEffect(() => {
        if (!socket) return;

        const onMatchFound = (id: string) => {
            socket.emit('pu4:join_game', id);       // on utilise l'id reçu
            hasStarted.current = true;
        };
        const onGameState = (s: GameState) => {
            console.log("Game State Updated:", s);
            setGame(s);
        };
        const onGameFinished = ({ winner, board }: { winner: string | null; board: CellValue[][] }) => {
            setGame(prev =>
                prev ? { ...prev, status: 'finished', winner, board } : null,
            );
        };

        const startSearch = () => {
            if (!hasStarted.current) {
                socket.emit("pu4:find_match");
                hasStarted.current = true;
            }
        };

        // Si déjà connecté, on lance, sinon on attend l'event 'connect'
        if (socket.connected) {
            startSearch();
        } else {
            socket.once("connect", startSearch);
        }
        socket.on('pu4:match_found', onMatchFound);
        socket.on('pu4:game_state', onGameState);
        socket.on('pu4:game_started', onGameState);
        socket.on('pu4:turn_skipped', onGameState);
        socket.on('pu4:game_finished', onGameFinished);
        socket.off("connect", startSearch);

        return () => {
            socket.off('pu4:match_found', onMatchFound);
            socket.off('pu4:game_state', onGameState);
            socket.off('pu4:game_started', onGameState);
            socket.off('pu4:turn_skipped', onGameState);
            socket.off('pu4:game_finished', onGameFinished);
            // on ne déconnecte pas ici ; la gestion de la connexion
            // est déléguée au hook `useSocket`
        };
    }, [socket]);

    // timer local
    useEffect(() => {
        if (game?.status !== 'playing') return;
        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - game.turnStartTime) / 1000);
            setTimeLeft(Math.max(0, 30 - elapsed));
        }, 1000);
        return () => clearInterval(interval);
    }, [game?.turnStartTime, game?.status]);
    const handleMove = (col: number) => {
        if (game?.status === "playing") {
            socket?.emit("pu4:play_move", game.id, col);
        }
    };

    if (!game) return <div className="flex justify-center p-10 text-white">Chargement...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gaming-dark p-2 sm:p-4 text-slate-100 font-sans">
            {/* Header Info - Adapté mobile */}
            <div className="flex justify-between items-center w-full max-w-md mb-8 bg-slate-900/50 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 shadow-[0_0_20px_rgba(30,41,59,0.5)]">
                <div className={`transition-all duration-300 p-2 rounded-xl ${game.activePlayer === 1 ? 'scale-105 shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-500/50 bg-red-500/5' : 'opacity-60'}`}>
                    <p className="text-[10px] uppercase tracking-widest text-red-400">P1</p>
                    <p className="font-bold truncate max-w-20 sm:max-w-none">{game.players["1"]?.name || "..."}</p>
                </div>

                <div className="flex flex-col items-center px-4">
                    <div className={`text-2xl font-mono font-black transition-colors ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`} style={{ textShadow: timeLeft < 10 ? '0 0 10px #ef4444' : '0 0 10px #22d3ee' }}>
                        {timeLeft}s
                    </div>
                </div>

                <div className={`transition-all duration-300 p-2 rounded-xl text-right ${game.activePlayer === 2 ? 'scale-105 shadow-[0_0_15px_rgba(234,179,8,0.4)] border border-yellow-500/50 bg-yellow-500/5' : 'opacity-60'}`}>
                    <p className="text-[10px] uppercase tracking-widest text-yellow-400">P2</p>
                    <p className="font-bold truncate max-w-20 sm:max-w-none">{game.players["2"]?.name || "..."}</p>
                </div>
            </div>

            {/* Le Plateau Néon - Responsive (w-[11vw] sur mobile, max w-14) */}
            <div className="relative bg-slate-900/80 p-2 sm:p-4 rounded-3xl border border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.2)] backdrop-blur-sm">
                <div className="flex gap-1 sm:gap-3">
                    {game.board[0].map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className="flex flex-col gap-1 sm:gap-3 cursor-pointer group"
                            onClick={() => handleMove(colIndex)}
                        >
                            {/* Indicateur de colonne au survol */}
                            <div className="h-1 rounded-full bg-blue-500/0 group-hover:bg-blue-500/40 transition-all mb-1 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />

                            {game.board.map((_, rowIndex) => (
                                <div
                                    key={rowIndex}
                                    className="w-[11vw] h-[11vw] max-w-14 max-h-14 sm:w-14 sm:h-14 bg-gaming-dark rounded-full border border-slate-700/50 flex items-center justify-center relative shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]"
                                >
                                    {game.board[rowIndex][colIndex] !== 0 && (
                                        <div className={`w-[85%] h-[85%] animate-bounce-down rounded-full transition-all duration-500 ${game.board[rowIndex][colIndex] === 1
                                            ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] border-b-4 border-red-700'
                                            : 'bg-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.8)] border-b-4 border-yellow-600'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Info / Hint */}
            <p className="mt-8 text-slate-500 text-xs uppercase tracking-[0.2em] animate-pulse">
                {game.status === "playing" ? `Tour du joueur ${game.activePlayer}` : "En attente..."}
            </p>

            {/* Status Modal - Style Verre dépoli */}
            {game.status === "finished" && (
                <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center backdrop-blur-xl z-50 p-4">
                    <div className="bg-slate-900 w-full max-w-xs p-8 rounded-3xl border border-white/10 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-yellow-500/20">
                            <Trophy className="text-yellow-500 drop-shadow-[0_0_10px_#eab308]" size={40} />
                        </div>
                        <h2 className="text-2xl font-black mb-2 text-white">FIN DE PARTIE</h2>
                        <p className="text-slate-400 mb-8 font-medium italic">
                            {game.winner ? `${game.winner} a dominé le terrain !` : "Une égalité parfaite."}
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.href = "/lobby"}
                            className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black tracking-widest shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-all active:scale-95"
                        >
                            RETOUR AU LOBBY
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Puissance4;
