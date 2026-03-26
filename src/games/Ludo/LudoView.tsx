import { Trophy, User, Swords } from 'lucide-react';
//import  { useState } from 'react';

const LudoView = () => {
    // 0: Empty, 1-4: Players, S: Safe Zone, H: Home
    //const [board] = useState(Array(15).fill(null).map(() => Array(15).fill(0)));

    return (
        <div className="min-h-screen bg-[#05080a] flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden">
            {/* Header: Score & Phase */}
            <div className="w-full max-w-[90vmin] flex justify-between items-center mb-4 bg-slate-900/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                        <Swords className="text-cyan-400" size={20} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest italic text-white">Ludo <span className="text-cyan-500">Arena</span></span>
                </div>
                <div className="flex items-center gap-4 text-cyan-400 font-mono font-bold">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-[10px]">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> LAN ACTIVE
                    </div>
                </div>
            </div>

            {/* THE RESPONSIVE BOARD */}
            <div className="relative w-[90vmin] h-[90vmin] max-w-200 max-h-200 bg-slate-950 rounded-3xl p-1 shadow-2xl border border-white/10 overflow-hidden">
                <div className="grid grid-cols-15 grid-rows-15 w-full h-full gap-0.5">
                    {/* 
                        Logic: 
                        Rows 0-5: Red/Green Bases + Path
                        Rows 6-8: The Central Cross Path
                        Rows 9-14: Blue/Yellow Bases + Path
                    */}
                    {Array.from({ length: 225 }).map((_, i) => {
                        const r = Math.floor(i / 15);
                        const c = i % 15;

                        // Style Logic for Bases (6x6 corners)
                        const isRedBase = r < 6 && c < 6;
                        const isGreenBase = r < 6 && c > 8;
                        const isYellowBase = r > 8 && c > 8;
                        const isBlueBase = r > 8 && c < 6;
                        const isCenter = r >= 6 && r <= 8 && c >= 6 && c <= 8;

                        return (
                            <div
                                key={i}
                                className={`
                                    flex items-center justify-center rounded-sm transition-all duration-300
                                    ${isRedBase ? 'bg-red-500/20 border border-red-500/30' :
                                        isGreenBase ? 'bg-green-500/20 border border-green-500/30' :
                                            isYellowBase ? 'bg-yellow-500/20 border border-yellow-500/30' :
                                                isBlueBase ? 'bg-blue-500/20 border border-blue-500/30' :
                                                    isCenter ? 'bg-slate-900 border border-cyan-500/20' : 'bg-slate-800/40'}
                                `}
                            >
                                {/* Safe Zones or Home Indicators */}
                                {(r === 7 && c === 7) && <Trophy size={20} className="text-yellow-500 animate-bounce" />}
                            </div>
                        );
                    })}
                </div>

                {/* OVERLAY DICE - Optimized for TV/Touch */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <button className="w-16 h-16 sm:w-24 sm:h-24 bg-linear-to-br from-cyan-500 to-blue-600 rounded-3xl shadow-[0_0_40px_rgba(6,182,212,0.4)] flex items-center justify-center text-4xl font-black text-white hover:scale-110 active:scale-95 transition-all">
                        6
                    </button>
                </div>
            </div>

            {/* Player Controls - Bottom Bar */}
            <div className="mt-8 flex gap-4 w-full max-w-[90vmin] overflow-x-auto pb-4 no-scrollbar">
                {[1, 2, 3, 4].map((p) => (
                    <div key={p} className="flex-1 min-w-30 bg-slate-900/60 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full border-2 ${p === 1 ? 'border-red-500 bg-red-500/20' : 'border-slate-700 bg-slate-800'} flex items-center justify-center`}>
                            <User size={14} className="text-slate-400" />
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-tighter">
                            <p className="text-slate-500 leading-none mb-1">Player {p}</p>
                            <p className="text-white">WAITING...</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LudoView;
