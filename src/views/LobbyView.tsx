import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Play,
    Hash, Bomb, Anchor, Brain, Signal
} from 'lucide-react';
import type { Player } from '../types/games';

const GAMES = [
    { id: 'tictactoe', name: 'Tic-Tac-Toe', icon: <Hash size={32} />, color: 'from-cyan-500 to-blue-600', players: 2, difficulty: 'Easy', desc: 'Classic 3x3 strategic duel.' },
    { id: 'minesweeper', name: 'Mine Sweeper', icon: <Bomb size={32} />, color: 'from-red-500 to-orange-600', players: 1, difficulty: 'Hard', desc: 'Clear the minefield without detonating.' },
    { id: 'battleship', name: 'Battleship', icon: <Anchor size={32} />, color: 'from-indigo-600 to-purple-600', players: 2, difficulty: 'Medium', desc: 'Tactical naval warfare on LAN.' },
    { id: 'puissance4', name: 'Puissance 4', icon: <Anchor size={32} />, color: 'from-indigo-600 to-purple-600', players: 2, difficulty: 'Medium', desc: 'Tactical Battle to align 4 piece.' },
    { id: 'ludo', name: 'Ludo', icon: <Brain size={32} />, color: 'from-amber-500 to-yellow-600', players: 4, difficulty: 'Mental', desc: 'Finish first' },
];

export const LobbyView = ({ user }: { user: Player | null }) => {
    const navigate = useNavigate();
    const [hoveredGame, setHoveredGame] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-[#05080a] text-slate-100 overflow-hidden font-sans">
            {/* Background Grid & Glows */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]"></div>
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse"></div>

            <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-10">

                {/* --- TOP BAR --- */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="animate-in slide-in-from-left duration-700">
                        <div className="flex items-center gap-3 mb-2">
                            <Signal className="text-cyan-500 animate-pulse" size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500/60">Server Status: Online</span>
                        </div>
                        <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                            Game<span className="text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">Selection</span>
                        </h1>
                        <p className="mt-4 text-slate-500 text-xs font-bold uppercase tracking-widest max-w-md">
                            Welcome back, <span className="text-white underline decoration-cyan-500/50">{user?.username}</span>. Select a protocol to initiate game session.
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="hidden lg:flex gap-4">
                        <div className="bg-slate-900/40 border border-white/5 p-4 rounded-3xl backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Players</p>
                                    <p className="text-xl font-black italic text-white">128</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- GAME GRID --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {GAMES.map((game) => (
                        <div
                            key={game.id}
                            onMouseEnter={() => setHoveredGame(game.id)}
                            onMouseLeave={() => setHoveredGame(null)}
                            onClick={() => navigate(`/game/${game.id}/`)}
                            className="group relative cursor-pointer"
                        >
                            {/* Outer Card */}
                            <div className={`relative h-96 w-full rounded-[2.5rem] bg-slate-900/40 border border-white/5 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-white/20 hover:shadow-2xl`}>

                                {/* Visual Background (Gradient Glow) */}
                                <div className={`absolute inset-0 bg-linear-to-br ${game.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                {/* Content Container */}
                                <div className="absolute inset-0 p-8 flex flex-col items-center justify-between">
                                    {/* Icon Frame */}
                                    <div className={`mt-8 h-24 w-24 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:-translate-y-2`}>
                                        <div className={`transition-colors duration-500 ${hoveredGame === game.id ? 'text-white' : 'text-slate-500'}`}>
                                            {game.icon}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="text-center w-full">
                                        <h2 className="text-xl font-black italic uppercase tracking-tight text-white mb-2">{game.name}</h2>
                                        <div className="flex items-center justify-center gap-3 mb-4">
                                            <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-widest border border-white/5">
                                                {game.difficulty}
                                            </span>
                                            <span className="flex items-center gap-1 text-[9px] font-bold text-cyan-500 uppercase tracking-widest italic">
                                                <Users size={10} /> {game.players}P
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {game.desc}
                                        </p>
                                    </div>

                                    {/* Action Button */}
                                    <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 group-hover:bg-white group-hover:text-black transition-all duration-300">
                                        <Play size={16} fill="currentColor" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Launch</span>
                                    </button>
                                </div>

                                {/* Scanline Effect (Only on hover) */}
                                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-size-[100%_4px,3px_100%] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- FOOTER / NEWS FEED --- */}
                <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom duration-1000">
                    <div className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                            Recent News: <span className="text-white ml-2">New battleship map added to LAN server.</span>
                        </p>
                    </div>
                    <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-cyan-400 transition-all">
                        Server Changelog
                    </button>
                </div>
            </div>
        </div>
    );
};
