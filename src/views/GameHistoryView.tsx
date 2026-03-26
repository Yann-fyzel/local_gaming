import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import { Calendar, History, Clock, Gamepad2, ShieldCheck, Skull, Swords, Trophy } from 'lucide-react';
import { type StatSGames, type IGame } from '../types/games.js';
import { useAuthStore } from '../store/useAuthStore.js';

export const HistoryView = () => {
    const [history, setHistory] = useState([]);
    const user = useAuthStore(s => s.user);
    const [stats, setStats] = useState<StatSGames>();


    useEffect(() => {
        api.get('/api/auth/me/history').then(res => {
            setHistory(res.data);
            const stats: StatSGames = {
                total: res.data.length,
                win: res.data.filter((g: IGame) => g.winner === user?.id).length,
                ratio: res.data.length > 0 ? Math.round((res.data.filter((g: IGame) => g.winner === user?.id).length / res.data.length) * 100) : 0
            };
            setStats(stats);
        });
    }, [user?.id]);

    return (
        <div className="min-h-screen bg-[#05080a] text-slate-100 font-sans pb-20">
            <div className="max-w-5xl mx-auto p-4 sm:p-8">

                {/* --- HEADER & DASHBOARD --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                                <History className="text-cyan-400" size={28} />
                            </div>
                            <h1 className="text-3xl font-black italic tracking-tighter uppercase">
                                Journal <span className="text-cyan-500">LAN</span>
                            </h1>
                        </div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] ml-1">Archive des opérations réseau</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex gap-3 w-full md:w-auto">
                        {[
                            { label: 'Missions', val: stats?.total, icon: <Gamepad2 size={14} />, color: 'text-slate-400' },
                            { label: 'Victoires', val: stats?.win, icon: <Trophy size={14} />, color: 'text-yellow-500' },
                            { label: 'Efficacité', val: `${stats?.ratio}%`, icon: <ShieldCheck size={14} />, color: 'text-cyan-400' }
                        ].map((s, i) => (
                            <div key={i} className="flex-1 md:w-28 bg-slate-900/40 border border-white/5 p-3 rounded-2xl backdrop-blur-sm">
                                <div className={`flex items-center gap-1.5 mb-1 ${s.color} opacity-80`}>
                                    {s.icon} <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{s.label}</span>
                                </div>
                                <p className={`text-xl font-black italic ${s.color.includes('slate') ? 'text-white' : s.color}`}>{s.val}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- LISTE DES PARTIES --- */}
                <div className="space-y-3">
                    {history.length > 0 ? history.map((game: IGame) => {
                        const isWinner = game.winner === user?.id;
                        const isDraw = game.winner === null;

                        return (
                            <div key={game.id} className="group relative flex flex-col sm:flex-row items-center justify-between bg-slate-900/30 border border-white/5 hover:border-white/10 p-4 rounded-3xl transition-all duration-300 gap-4 overflow-hidden">

                                {/* Status Glow Bar */}
                                <div className={`absolute left-0 top-0 h-full w-1 ${isDraw ? 'bg-slate-700' : isWinner ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />

                                <div className="flex items-center gap-5 w-full sm:w-auto">
                                    {/* Game Type Badge */}
                                    <div className="text-center p-3 bg-black/40 rounded-2xl min-w-20 border border-white/5">
                                        <p className="text-[8px] uppercase font-black text-slate-500 tracking-widest mb-1">Système</p>
                                        <p className="font-black text-[10px] text-cyan-400 uppercase italic tracking-tighter">{game.gameType}</p>
                                    </div>

                                    {/* Player Info */}
                                    <div className="grow">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-tight">
                                            <span className={game.players[0]?.username === user?.username ? 'text-cyan-400' : 'text-white'}>
                                                {game.players[0]?.username}
                                            </span>
                                            {game.players.length > 1 ? (
                                                <>
                                                    <Swords size={12} className="text-slate-700" />
                                                    <span className={game.players[1]?.username === user?.username ? 'text-cyan-400' : 'text-white'}>
                                                        {game.players[1]?.username}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-[8px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500 border border-white/5">SOLO_MODE</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="flex items-center gap-1 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                                                <Calendar size={10} /> {new Date(game.playedAt).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                                                <Clock size={10} /> {Math.floor(game.duration / 60)}m {game.duration % 60}s
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Résultat Final */}
                                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                                    {game.resultData.score !== undefined && (
                                        <div className="text-right">
                                            <p className="text-[8px] font-black text-slate-600 uppercase">Score</p>
                                            <p className="text-sm font-black text-white">{game.resultData.score}s</p>
                                        </div>
                                    )}

                                    <div className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase italic border-2 transition-all ${isDraw
                                        ? 'border-slate-800 text-slate-500 bg-slate-800/10'
                                        : isWinner
                                            ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                            : 'border-red-500/30 text-red-500 bg-red-500/5'
                                        }`}>
                                        {isDraw ? "NUL" : isWinner ? "VICTOIRE" : "DÉFAITE"}
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 rounded-[2.5rem] border-2 border-dashed border-white/5">
                            <Skull className="text-slate-800 mb-4" size={48} />
                            <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-xs italic">Aucune donnée de combat</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
