import React, { useState } from 'react';
import { TabType, UserProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Trophy, 
  Gamepad2, 
  Volume2, 
  VolumeX, 
  Menu, 
  X,
  Code2,
  Sparkles,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { sound } from '../utils/audio';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  user: UserProfile;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenAuth,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const next = !isMuted;
    sound.setMuted(next);
    setIsMuted(next);
    if (!next) sound.playClick();
  };

  const navItems: { tab: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { tab: 'modules', label: 'Modules', icon: <BookOpen className="w-4 h-4" /> },
    { tab: 'pastyear', label: 'Past Year', icon: <FileText className="w-4 h-4" />, badge: 'Drive' },
    { tab: 'quiz', label: 'Interactive Quiz', icon: <HelpCircle className="w-4 h-4" /> },
    { tab: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { tab: 'games', label: '8 Mini-Games', icon: <Gamepad2 className="w-4 h-4" />, badge: 'Hot' },
    ...(user.role === 'admin'
      ? [{ tab: 'admin' as TabType, label: 'Admin Portal', icon: <ShieldCheck className="w-4 h-4 text-pink-400" />, badge: 'Admin' }]
      : []),
  ];

  const handleTabClick = (tab: TabType) => {
    sound.playClick();
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-cyan-500/20 px-3 md:px-6 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleTabClick('modules')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition">
                <div className="w-full h-full bg-[#080d1a] rounded-[10px] flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition duration-300" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-cyber font-black text-base md:text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-pink-400 group-hover:glow-text-cyan transition">
                    BolehCode
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono-code hidden sm:inline">
                    Java PWA
                  </span>
                </div>
                <p className="text-[10px] md:text-xs text-amber-300/90 font-medium tracking-wide">
                  &ldquo;Slow-slow, Lama-lama Pro&rdquo;
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800">
            {navItems.map((item) => {
              const active = currentTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleTabClick(item.tab)}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className={active ? 'text-cyan-400' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 font-mono-code font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* PWA Install Button */}
            <PWAInstallButton compact />

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 transition"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Google Sign-In Profile Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenAuth();
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 transition group focus:outline-none"
              title="Google Account & Student Profile"
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-cyan-400"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#070b14]" />
              </div>

              <div className="text-left hidden sm:block max-w-[110px] md:max-w-[130px]">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition">
                    {user.name.split(' ')[0]}
                  </span>
                  {user.role === 'admin' && (
                    <span className="px-1 py-0.2 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[8px] font-mono-code font-bold uppercase">
                      Admin
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono-code">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>{user.xp} XP</span>
                </div>
              </div>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => {
                sound.playClick();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="lg:hidden p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 hover:text-cyan-400 transition"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-2 pt-2 pb-3 border-t border-slate-800/80 space-y-1 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between px-2 py-1.5 mb-2 bg-slate-900/80 rounded-xl text-xs">
              <span className="text-slate-400 font-mono-code">{user.email}</span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Flame className="w-3.5 h-3.5" />
                Streak: {user.streakDays} Days
              </span>
            </div>

            {navItems.map((item) => {
              const active = currentTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleTabClick(item.tab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={active ? 'text-cyan-400' : 'text-slate-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar (App-like thumb bar) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070b14]/95 backdrop-blur-lg border-t border-cyan-500/20 px-2 py-1 flex items-center justify-around shadow-2xl">
        {navItems.map((item) => {
          const active = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => handleTabClick(item.tab)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition ${
                active ? 'text-cyan-400 scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg ${active ? 'bg-cyan-500/20 text-cyan-300' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-medium tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
