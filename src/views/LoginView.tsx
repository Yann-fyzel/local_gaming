import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import { useLogStore } from '../store/useLogStore.js';
import api from '../api/axios.js';
import axios from 'axios';
import { ShieldCheck, Lock, User, Zap, Terminal } from 'lucide-react';

export const LoginView = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const setAuth = useAuthStore((s) => s.setAuth);
    const setLog = useLogStore((s) => s.addLog);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post('/api/auth/login', { username, password });
            setAuth(res.data.user, res.data.token);
            localStorage.setItem('token', res.data.token);
            setLog(`Accès autorisé : Bienvenue ${res.data.user.username}`, "success");
            navigate('/lobby');
        } catch (err) {
            let errorMsg = "Liaison serveur rompue (Vérifie l'IP LAN)";
            if (axios.isAxiosError(err)) errorMsg = err.response?.data.message || err.message;
            setLog(`Échec d'authentification : ${errorMsg}`, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex h-screen w-full items-center justify-center bg-[#05080a] overflow-hidden p-4">

            {/* --- EFFETS D'ARRIÈRE-PLAN --- */}
            {/* Scanlines (Lignes horizontales style vieux moniteur) */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]"></div>

            {/* Orbes de lumière mouvantes */}
            <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px] animate-pulse delay-1000"></div>

            <form
                onSubmit={handleSubmit}
                className="group relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 pt-12 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-cyan-500/30"
            >
                {/* Bordure de progression supérieure */}
                <div className="absolute top-0 left-0 h-1.5 w-full bg-slate-800">
                    <div className={`h-full bg-linear-to-r from-cyan-500 to-blue-600 transition-all duration-1000 ${isLoading ? 'w-full' : 'w-0'}`}></div>
                </div>

                <header className="mb-10 text-center relative">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                        <Terminal className="text-cyan-400" size={32} />
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter text-white">
                        GAME<span className="text-cyan-500 drop-shadow-[0_0_10px_#06b6d4]">HUB</span>
                    </h1>
                    <div className="mt-2 flex items-center justify-center gap-2">
                        <span className="h-px w-8 bg-slate-700"></span>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Protocol Auth 2.0</p>
                        <span className="h-px w-8 bg-slate-700"></span>
                    </div>
                </header>

                <div className="space-y-6">
                    {/* INPUT PSEUDO */}
                    <div className="relative group/input">
                        <label className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase text-slate-500 tracking-widest group-focus-within/input:text-cyan-400 transition-colors">
                            <User size={12} /> Identifiant Pilote
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-2xl bg-black/40 border border-white/5 p-4 text-sm text-white outline-none transition-all focus:border-cyan-500/50 focus:bg-black/60 focus:ring-4 focus:ring-cyan-500/5"
                            placeholder="Entrez votre pseudo..."
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {/* INPUT PASSWORD */}
                    <div className="relative group/input">
                        <label className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase text-slate-500 tracking-widest group-focus-within/input:text-cyan-400 transition-colors">
                            <Lock size={12} /> Clé Cryptographique
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full rounded-2xl bg-black/40 border border-white/5 p-4 text-sm text-white outline-none transition-all focus:border-cyan-500/50 focus:bg-black/60 focus:ring-4 focus:ring-cyan-500/5"
                            placeholder="••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 cursor-pointer uppercase tracking-tighter hover:text-slate-300 transition-colors">
                        <input type="checkbox" className="h-3 w-3 rounded border-white/10 bg-slate-800 accent-cyan-500" />
                        Maintenir la liaison
                    </label>
                    <a href="#" className="text-[10px] font-bold text-slate-600 hover:text-cyan-400 transition-colors uppercase italic">Oubli ?</a>
                </div>

                {/* BOUTON D'ACTION */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative mt-10 w-full overflow-hidden rounded-2xl py-4 transition-all active:scale-95 disabled:opacity-50"
                >
                    {/* Fond du bouton avec dégradé animé */}
                    <div className="absolute inset-0 bg-linear-to-r from-cyan-600 via-blue-600 to-cyan-600 bg-size-[200%_100%] transition-all duration-500 group-hover:bg-position-[100%_0%]"></div>

                    {/* Lueur au survol */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(6,182,212,0.6)]"></div>

                    <span className="relative flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-white">
                        {isLoading ? (
                            <>
                                <Zap className="animate-spin text-cyan-200" size={16} />
                                Synchronisation...
                            </>
                        ) : (
                            <>
                                <ShieldCheck size={18} />
                                Initialiser l'accès
                            </>
                        )}
                    </span>
                </button>

                <p className="mt-10 text-center text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    Pas encore de matricule ?{' '}
                    <Link to="/register" className="text-white hover:text-cyan-400 transition-all border-b border-white/20 hover:border-cyan-400 pb-0.5 ml-1">
                        Créer un profil
                    </Link>
                </p>
            </form>
        </div>
    );
};
