import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { User, Mail, Shield, Camera, Save, HardDrive, Zap, LogOut } from 'lucide-react';

export const ProfileView = () => {
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        bio: "Système de combat DiceLink activé."
    });

    const handleSave = () => {
        // Logic to push to Fastify API via Axios
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-[#05080a] text-slate-100 p-4 sm:p-8 font-sans relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 blur-[120px] rounded-full"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* --- HEADER TACTIQUE --- */}
                <header className="mb-10 flex flex-col md:flex-row items-center gap-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-3xl bg-linear-to-br from-cyan-500 to-blue-600 p-1 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={48} className="text-cyan-500/50" />
                                )}
                            </div>
                        </div>
                        <button title='Take Picture' className="absolute -bottom-2 -right-2 p-3 bg-slate-800 border border-white/10 rounded-xl text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all shadow-xl">
                            <Camera size={18} />
                        </button>
                    </div>

                    <div className="text-center md:text-left grow">
                        <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-1">
                            {user?.username} <span className="text-cyan-500 text-sm not-italic ml-2 opacity-50">#ID-{user?.id?.slice(0, 5)}</span>
                        </h1>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Statut: Opérateur Certifié</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[9px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1">
                                <Zap size={10} /> Liaison Active
                            </span>
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <HardDrive size={10} /> Serveur LAN-01
                            </span>
                        </div>
                    </div>
                </header>

                {/* --- FORMULAIRE DE MODIFICATION --- */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-sm">
                            <h2 className="text-lg font-black italic mb-8 uppercase tracking-widest flex items-center gap-3">
                                <Shield className="text-cyan-500" size={20} /> Paramètres d'Accès
                            </h2>

                            <div className="space-y-6">
                                <div className="group">
                                    <label htmlFor='username' className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Nom d'Utilisateur</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                        <input
                                            id='username'
                                            type="text"
                                            value={formData.username}
                                            disabled={!isEditing}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-cyan-500/50 outline-none transition-all disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label htmlFor='email' className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Liaison Réseau (Email)</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                        <input
                                            id='email'
                                            type="email"
                                            value={formData.email}
                                            disabled={!isEditing}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-cyan-500/50 outline-none transition-all disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 flex gap-4">
                                {!isEditing ? (
                                    <button type='button'
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all"
                                    >
                                        Éditer le Profil
                                    </button>
                                ) : (
                                    <>
                                        <button type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 py-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="flex-1 py-4 bg-cyan-600 text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-[0_10px_20px_rgba(6,182,212,0.2)] hover:bg-cyan-500 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Save size={16} /> Sauvegarder
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- SIDEBAR INFOS --- */}
                    <div className="space-y-6">
                        <div className="bg-linear-to-br from-indigo-600 to-purple-700 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-2 opacity-80">Sécurité</h3>
                                <p className="text-xl font-black italic mb-6 leading-tight">Clé d'accès chiffrée</p>
                                <button className="w-full py-3 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-all">
                                    Changer de Mot de Passe
                                </button>
                            </div>
                            <Shield className="absolute -bottom-4 -right-4 text-white/10" size={120} />
                        </div>

                        <button className="w-full flex items-center justify-center gap-3 p-6 bg-red-500/5 border border-red-500/10 rounded-4xl text-red-500 font-black text-xs tracking-widest uppercase hover:bg-red-500/10 transition-all active:scale-95">
                            <LogOut size={18} /> Déconnexion Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
