
import { useAuthStore } from '../store/useAuthStore.js';
import { useNavigate, Link } from 'react-router-dom';



import { useState } from 'react';
import {
  Gamepad2, Trophy, History, User, LogOut,
  Menu, X, ShoppingBag, Settings, ChevronRight
} from 'lucide-react';

export const Navbar = () => {

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navLinks = [
    { to: "/leaderboard", icon: <Trophy size={20} />, label: "Classement", color: "text-yellow-400" },
    { to: "/history", icon: <History size={20} />, label: "Mon Historique", color: "text-blue-400" },
    { to: "/shop", icon: <ShoppingBag size={20} />, label: "Boutique Skins", color: "text-pink-500" },
    { to: "/settings", icon: <Settings size={20} />, label: "Paramètres", color: "text-slate-400" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-60 border-b border-white/5 bg-[#0a0f12]/80 backdrop-blur-xl px-4 sm:px-8 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          {/* LOGO */}
          <Link to="/lobby" className="flex items-center gap-3 group">
            <div className="bg-cyan-500 p-2 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:rotate-12 transition-all duration-300">
              <Gamepad2 className="text-slate-900" size={22} />
            </div>
            <span className="text-xl font-black tracking-tighter text-white hidden xs:block">
              GAME<span className="text-cyan-500">HUB</span>
            </span>
          </Link>

          {/* DESKTOP NAV (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-8 bg-white/5 px-6 py-2 rounded-2xl border border-white/5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                title={link.label}
                className={`transition-all hover:scale-110 ${link.color} filter drop-shadow-[0_0_8px_currentColor] opacity-80 hover:opacity-100`}
              >
                {link.icon}
              </Link>
            ))}
          </div>

          {/* USER PROFILE & MOBILE TOGGLE */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-white uppercase tracking-tighter">{user?.username || "Guest"}</p>
              <div className="flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest">Online</span>
              </div>
            </div>

            {/* AVATAR */}
            <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-slate-800 to-slate-900 border border-white/10 p-0.5 shadow-lg group cursor-pointer overflow-hidden"
              onClick={() => navigate("/profile")}>
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-[14px]" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-cyan-500/10 text-cyan-500 rounded-[14px]">
                  <User size={20} />
                </div>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button title='Open' type='button'
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
            >
              <Menu size={24} />
            </button>

            {/* LOGOUT (Desktop only) */}
            <button title='logout'
              onClick={handleLogout} type='button'
              className="hidden md:block p-2 text-white/20 hover:text-red-500 transition-all hover:scale-110"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER (Menu Latéral) */}
      <div className={`fixed inset-0 z-70 transition-all duration-500 ${isDrawerOpen ? 'visible' : 'invisible'}`}>
        {/* Overlay sombre */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsDrawerOpen(false)}
        />

        {/* Drawer Content */}
        <div className={`absolute right-0 top-0 h-full w-72 bg-gaming-dark border-l border-white/10 shadow-2xl p-6 transition-transform duration-500 flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between mb-10">
            <span className="font-black italic text-cyan-500 tracking-widest">MENU</span>
            <button title='Drawer' type='button' onClick={() => setIsDrawerOpen(false)} className="p-2 bg-white/5 rounded-xl text-white/40"><X size={20} /></button>
          </div>

          <div className="flex flex-col gap-2 grow">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className={`${link.color}`}>{link.icon}</span>
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white">{link.label}</span>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-cyan-500" />
              </Link>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center justify-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 font-black text-xs tracking-widest uppercase active:scale-95 transition-all"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </div>
    </>
  );
};
