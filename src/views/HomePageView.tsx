import { Gamepad2, Zap, Users, Trophy, ChevronRight, Play, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BoardGameLanding = () => {
    return (
        <div className="min-h-screen bg-[#05080a] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
            {/* --- DYNAMIC BACKGROUND --- */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-cyan-500/10 blur-[120px] rounded-full opacity-50"></div>
            </div>

            {/* --- NAVIGATION --- */}
            <nav className="z-50 sticky top-0 border-b border-white/5 bg-[#0a0f12]/80 backdrop-blur-xl px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:rotate-12 transition-transform">
                            <Gamepad2 className="text-slate-950" size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase italic">
                            Dice<span className="text-cyan-500">Link</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <a href="#games" className="hover:text-cyan-400 transition-colors">Tactical Library</a>
                        <a href="#intel" className="hover:text-cyan-400 transition-colors">Server Intel</a>
                        <div className="h-4 w-px bg-white/10"></div>
                        <Link to="/login" className="hover:text-white transition-colors">Access Terminal</Link>
                        <Link to="/register" className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95">
                            Enlist Now
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="relative z-10 pt-24 pb-32 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 border border-cyan-500/30 bg-cyan-500/5 rounded-full text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] animate-bounce">
                        <Server size={12} /> Local Network Optimized
                    </div>

                    <h1 className="text-6xl md:text-9xl font-black mb-8 leading-[0.85] tracking-tighter italic uppercase">
                        Master the<br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                            Digital Board
                        </span>
                    </h1>

                    <p className="text-slate-400 text-sm md:text-lg max-w-2xl mb-12 leading-relaxed font-medium uppercase tracking-wide">
                        Connect with friends over LAN. No lag, no latency, just pure strategy.
                        From Battleship to Minesweeper, the arena is ready.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <Link to="/register" className="group relative px-12 py-5 bg-white text-slate-950 font-black rounded-2xl transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-[0.3em] overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2 italic"><Play size={14} fill="currentColor" /> Initiate Protocol</span>
                            <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </Link>
                        <button className="px-12 py-5 bg-slate-900/50 text-white font-black rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-xs uppercase tracking-[0.3em] backdrop-blur-sm">
                            View Intel
                        </button>
                    </div>
                </div>
            </header>

            {/* --- FEATURES GRID --- */}
            <section id="intel" className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: <Zap className="text-yellow-400" />, title: "Zero Latency", desc: "Built for LAN. Every move is synchronized in real-time with millisecond precision." },
                        { icon: <Users className="text-cyan-400" />, title: "Squad Play", desc: "Private lobbies for your team. Challenge your friends sitting right next to you." },
                        { icon: <Trophy className="text-purple-500" />, title: "Live Ranks", desc: "Climb the local leaderboard. Every win is archived in the global registry." }
                    ].map((feat, i) => (
                        <div key={i} className="group p-10 rounded-[2.5rem] bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 transition-all duration-500 backdrop-blur-md">
                            <div className="mb-6 w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform shadow-inner">
                                {feat.icon}
                            </div>
                            <h3 className="text-xl font-black mb-4 uppercase italic tracking-tighter">{feat.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium tracking-tight">{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- RECENT ACTIVITY MOCK --- */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <div className="bg-linear-to-br from-cyan-900/20 to-transparent p-1 rounded-[3rem] border border-white/5 overflow-hidden">
                    <div className="bg-[#0a0f12]/90 rounded-[2.8rem] p-12 text-center backdrop-blur-3xl">
                        <h2 className="text-4xl font-black mb-4 italic uppercase tracking-tighter">Ready to Deploy?</h2>
                        <p className="text-slate-500 mb-10 text-xs uppercase tracking-[0.4em] font-bold">The DiceLink servers are active on your network.</p>
                        <Link to="/register" className="inline-flex items-center gap-4 px-14 py-5 bg-cyan-600 hover:bg-cyan-500 rounded-2xl font-black text-xs tracking-[0.3em] uppercase transition-all shadow-[0_20px_40px_rgba(6,182,212,0.2)] active:scale-95 group">
                            Create Player Profile <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="relative z-10 py-12 text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.5em] border-t border-white/5 bg-black/20">
                <p>© 2026 DICELINK OPERATIONAL TERMINAL. SECURE LAN PROTOCOL.</p>
            </footer>
        </div>
    );
};


export default BoardGameLanding;
