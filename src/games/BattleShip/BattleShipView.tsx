import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../hooks/useSocket.js';
import { useLogStore } from '../../store/useLogStore.js';
import { RotateCcw, Trophy } from 'lucide-react';

const SHIPS = [
    { name: "Porte-avions", size: 5 },
    { name: "Croiseur", size: 4 },
    { name: "Contre-torpilleur", size: 3 },
    { name: "Sous-marin", size: 3 },
    { name: "Torpilleur", size: 2 }
];

interface Ship {
    type: string;
    size: number;
    positions: number[];
    hits: number[];
}

interface BattleState {
    turn: string | null;
    status: "placing" | "playing" | "finished";
    winner?: string;
}

interface FireResult {
    index: number;
    hit: boolean;
    sunk: boolean;
    shipType: string | null;
    shooter: string;
    nextTurn: string | null;

}


export const BattleShipView = () => {

    const socket = useSocket();
    const addLog = useLogStore(s => s.addLog);
    const [roomId, setRoomId] = useState<string>("");
    const hasStarted = useRef(false);

    // Etats de placement
    const [direction, setDirection] = useState<'H' | 'V'>('H');
    const [selectedShipIndex, setSelectedShipIndex] = useState(0);
    const currentShip = SHIPS[selectedShipIndex];
    const [myShips, setMyShips] = useState<Ship[]>([]);


    // États de jeu (Utilisation de l'interface)
    const [gameState, setGameState] = useState<BattleState | null>(null);
    const [hits, setHits] = useState<number[]>([]); // Tirs réussis sur l'ennemi
    const [misses, setMisses] = useState<number[]>([]);

    useEffect(() => {
        if (!socket) return


        const onMatchFound = (id: string) => {
            setRoomId(id);
            socket.emit("bs:join", id);
            addLog(`Match trouvé dans ${id} !`);
        }

        const onPlaced = (data: { ships: Ship[] }) => {
            setMyShips(data.ships);
            addLog(`Navire positionné !`, "success");
            if (selectedShipIndex < SHIPS.length - 1) {
                setSelectedShipIndex(prev => prev + 1);
            }
        }

        const onInitGame = (data: { status: "placing" | "playing" | "finished" }) => {
            setGameState({
                status: data.status,
                turn: null,
            })
        }
        const onStartGame = (data: { status: "placing" | "playing" | "finished", turn: string | null }) => {
            setGameState({
                status: data.status,
                turn: data.turn,
            });
            console.log(gameState);
        }

        const onFire = (res: FireResult) => {
            if (res.shooter === socket.id) {
                // C'est mon tir qui est analysé
                if (res.hit) setHits(prev => [...prev, res.index]);
                else setMisses(prev => [...prev, res.index]);
                setGameState({
                    status: "playing", turn: res.nextTurn,
                });

            }
        }

        //  (Adversaire) ou Partie trouvee
        socket.on("bs:match_found", onMatchFound);
        socket.on("bs:ship_placed", onPlaced);
        socket.on("bs:init", onInitGame);

        // JUSTE METTRE LA GRILLE DE POSITIONNEMENT PENDANT LA PHASE 1


        //SIMULER UN CHARGEMENT POUR MONTRER QU"ON ATTEND QUE L"ADVERSAIRE FINISSE
        //socket.on("bs:ready_status",()=>{});


        // ON ACTIVE LA GRILLE ET LA PARTIE COMMENCE
        socket.on("bs:start_game", onStartGame);
        socket.on("bs:fire_result", onFire);


        const startSearch = () => {
            if (!hasStarted.current) {
                socket.emit("bs:find_match");
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
            socket.off("bs:ship_placed", onPlaced);
            socket.off("bs:start_game", onStartGame);
            socket.off("bs:match_found", onMatchFound);
            socket.off("bs:fire_result", onFire);
            socket.off("connect", startSearch);
        };
    }, [socket, addLog, selectedShipIndex, gameState]);


    // Helper pour savoir si une case contient un de mes bateaux
    const isMyShip = (index: number) => myShips.some(s => s.positions.includes(index));


    const handleAttack = (index: number) => {
        if (!gameState || gameState.status !== "playing") return;
        if (hits.includes(index) || misses.includes(index)) return; // Déjà tiré ici
        socket?.emit("bs:fire", { roomId: roomId, targetIndex: index });
    };


    const handlePlace = (index: number) => {
        if (myShips.length >= SHIPS.length) return;

        socket?.emit("bs:place", {
            roomId: roomId, // Utilise l'ID dynamique récupéré du serveur
            start: index,
            dir: direction,
            shipType: currentShip?.name
        });
    };

    return (
        <div className="min-h-screen bg-[#05080a] text-slate-100 font-sans pb-12 overflow-x-hidden">

            {/* Titre & Phase Status */}
            <div className="flex flex-col items-center mt-6 mb-8 px-4 text-center">
                <h1 className="text-3xl font-black text-cyan-500 tracking-tighter italic mb-1 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                    BATTLESHIP <span className="text-white/20">LAN</span>
                </h1>
                <div className="px-4 py-1 bg-white/5 border border-white/10 rounded-full">
                    <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400">
                        Phase: <span className="text-cyan-400">{gameState?.status === 'placing' ? 'Déploiement' : 'Combat'}</span>
                    </span>
                </div>
            </div>

            {/* Alert de Tour - Style Alarme Radar */}
            {gameState?.status === "playing" && (
                <div className="w-full max-w-sm mx-auto mb-8 px-4">
                    <div className={`flex items-center justify-center gap-3 py-3 rounded-2xl border-2 transition-all duration-500 ${gameState.turn === socket?.id
                        ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                        : 'bg-red-500/5 border-red-500/20 opacity-50'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${gameState.turn === socket?.id ? 'bg-cyan-500 animate-ping' : 'bg-red-500'}`} />
                        <span className="text-xs font-black tracking-widest uppercase">
                            {gameState.turn === socket?.id ? "Prêt à faire feu !" : "Menace ennemie..."}
                        </span>
                    </div>
                </div>
            )}

            <div className="flex flex-col items-center gap-10 px-2">
                {/* Grilles Tactiques */}
                <div className="relative group">
                    <h2 className="mb-4 font-black text-[10px] uppercase tracking-[0.3em] text-slate-500 text-center">
                        {gameState?.status === 'placing' ? "Configuration de la Flotte" : "Radar de Ciblage"}
                    </h2>

                    {/* La Grille 10x10 - Adaptée mobile (8.5vw) */}
                    <div className={`grid grid-cols-10 gap-0.5 sm:gap-1 p-2 bg-slate-900/80 rounded-xl border-2 shadow-2xl backdrop-blur-sm ${gameState?.status === 'placing' ? 'border-cyan-500/30' : 'border-red-500/30'
                        }`}>
                        {Array.from({ length: 100 }).map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => gameState?.status === 'placing' ? handlePlace(i) : handleAttack(i)}
                                disabled={gameState?.status === 'playing' && (hits.includes(i) || misses.includes(i) || gameState.turn !== socket?.id)}
                                className={`
                                w-[8.5vw] h-[8.5vw] max-w-9 max-h-9 rounded-sm transition-all duration-300 relative overflow-hidden
                                ${gameState?.status === 'placing'
                                        ? (isMyShip(i) ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] border border-cyan-400/50' : 'bg-slate-800/50 hover:bg-slate-700')
                                        : (hits.includes(i) ? 'bg-red-600 shadow-[0_0_15px_#ef4444] animate-pulse' :
                                            misses.includes(i) ? 'bg-blue-500/20' : 'bg-slate-800/40 hover:bg-red-500/20 hover:border-red-500/40 border border-transparent')
                                    }
                            `}
                            >
                                {/* Effet Scanline Radar sur les cases */}
                                <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Panel de Contrôle Placement */}
                {gameState?.status === 'placing' && myShips.length < SHIPS.length && (
                    <div className="w-full max-w-sm p-6 bg-slate-900/80 rounded-4xl border border-white/5 flex flex-col items-center shadow-2xl animate-in slide-in-from-bottom duration-500">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Unité en attente</p>
                        <h3 className="text-xl font-black text-cyan-400 italic mb-6">
                            {currentShip?.name} <span className="text-xs text-white/40 not-italic">({currentShip?.size} BLOCS)</span>
                        </h3>

                        <button
                            type='button'
                            onClick={() => setDirection(d => d === 'H' ? 'V' : 'H')}
                            className="w-full py-4 bg-white/5 border border-cyan-500/30 rounded-2xl font-black text-[11px] tracking-widest text-cyan-400 hover:bg-cyan-500/10 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                        >
                            <RotateCcw size={16} className={direction === 'V' ? 'rotate-90 transition-transform' : 'transition-transform'} />
                            Axe: {direction === 'H' ? 'Horizontal' : 'Vertical'}
                        </button>
                    </div>
                )}
            </div>

            {/* Modal de Victoire / Défaite tactique */}
            {gameState?.status === "finished" && (
                <div className="fixed inset-0 bg-[#05080a]/95 backdrop-blur-xl flex items-center justify-center z-50 p-6">
                    <div className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] text-center shadow-2xl max-w-xs w-full overflow-hidden relative">
                        <div className={`absolute top-0 left-0 w-full h-1 ${gameState.winner === socket?.id ? 'bg-cyan-500 shadow-[0_0_15px_#22d3ee]' : 'bg-red-500 shadow-[0_0_15px_#ef4444]'}`} />

                        <Trophy className={`mx-auto mb-6 ${gameState.winner === socket?.id ? 'text-cyan-400' : 'text-red-500'}`} size={56} />
                        <h2 className="text-2xl font-black text-white italic mb-2 tracking-tighter uppercase">
                            {gameState.winner === socket?.id ? "SUCCÈS NAVAL" : "FLOTTE PERDUE"}
                        </h2>
                        <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] mb-8 font-bold leading-relaxed">
                            {gameState.winner === socket?.id ? "Le secteur a été sécurisé." : "Toutes les unités sont hors service."}
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                type='button'
                                onClick={() => window.location.reload()}
                                className="w-full py-4 bg-linear-to-br from-cyan-500 to-blue-600 rounded-2xl font-black text-[11px] tracking-widest text-white shadow-lg active:scale-95 transition-all uppercase"
                            >
                                RENOUVELER L'ENGAGEMENT
                            </button>
                            <button
                                type='button'
                                onClick={() => window.location.href = "/lobby"}
                                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[11px] tracking-widest text-slate-500 active:scale-95 transition-all uppercase"
                            >
                                REPLI VERS LOBBY
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};
