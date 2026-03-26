import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLogStore } from '../store/useLogStore.js';
import api from '../api/axios.js';
import axios from 'axios';
import { UserPlus, Lock, User, Mail, ShieldAlert, Cpu } from 'lucide-react';

export const RegisterView = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);

    const setLog = useLogStore((s) => s.addLog);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setLog("Les clés d'accès ne correspondent pas", "error");
        }

        setIsLoading(true);
        try {
            await api.post('/api/auth/register', formData);
            setLog("Matricule créé avec succès ! Connectez-vous.", "success");
            navigate('/login');
        } catch (err) {
            let errorMsg = "Échec de l'enrôlement réseau";
            if (axios.isAxiosError(err)) errorMsg = err.response?.data.message || err.message;
            setLog(errorMsg, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex h-screen w-full items-center justify-center bg-[#05080a] overflow-hidden p-4">
            {/* --- BACKGROUND FX (Identique Login) --- */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%] opacity-50"></div>
            <div className="absolute top-1/3 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px] animate-pulse"></div>

            <form
                onSubmit={handleSubmit}
                className="group relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 p-8 pt-10 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-purple-500/30"
            >
                {/* Barre de scan animée */}
                <div className="absolute top-0 left-0 h-1 w-full bg-slate-800">
                    <div className={`h-full bg-linear-to-r from-purple-500 to-cyan-500 transition-all duration-1000 ${isLoading ? 'w-full' : 'w-0'}`}></div>
                </div>

                <header className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        <UserPlus className="text-purple-400" size={28} />
                    </div>
                    <h1 className="text-3xl font-black italic tracking-tighter text-white">
                        NEW<span className="text-purple-500 drop-shadow-[0_0_10px_#a855f7]">PLAYER</span>
                    </h1>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">Création de profil biométrique</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* PSEUDO */}
                    <div className="space-y-1">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2"><User size={10} /> Pseudo</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-2xl bg-black/40 border border-white/5 p-3.5 text-xs text-white outline-none focus:border-purple-500/50 transition-all"
                            placeholder="ShadowWalker"
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="space-y-1">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2"><Mail size={10} /> Réseau (Email)</label>
                        <input
                            type="email"
                            required
                            className="w-full rounded-2xl bg-black/40 border border-white/5 p-3.5 text-xs text-white outline-none focus:border-purple-500/50 transition-all"
                            placeholder="pilote@lan.com"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="space-y-1">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2"><Lock size={10} /> Clé d'accès</label>
                        <input
                            type="password"
                            required
                            className="w-full rounded-2xl bg-black/40 border border-white/5 p-3.5 text-xs text-white outline-none focus:border-purple-500/50 transition-all"
                            placeholder="••••••••"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {/* CONFIRM */}
                    <div className="space-y-1">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2"><ShieldAlert size={10} /> Confirmation</label>
                        <input
                            type="password"
                            required
                            className="w-full rounded-2xl bg-black/40 border border-white/5 p-3.5 text-xs text-white outline-none focus:border-purple-500/50 transition-all"
                            placeholder="••••••••"
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative mt-8 w-full overflow-hidden rounded-2xl py-4 transition-all active:scale-95 disabled:opacity-50"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-purple-600 via-indigo-600 to-purple-600 bg-size-[200%_100%] group-hover:bg-position-[100%_0%] transition-all duration-700"></div>
                    <span className="relative flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-white">
                        {isLoading ? <Cpu className="animate-spin" size={16} /> : "GÉNÉRER LE PROFIL"}
                    </span>
                </button>

                <p className="mt-8 text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                    Déjà enrôlé ? <Link to="/login" className="text-white hover:text-purple-400 transition-colors underline underline-offset-4 ml-1">Accéder au terminal</Link>
                </p>
            </form>
        </div>
    );
};
