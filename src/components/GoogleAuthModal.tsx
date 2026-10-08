import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { X, Check, Award, Flame, Sparkles, LogOut, UserCheck } from 'lucide-react';
import { sound } from '../utils/audio';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [studentId, setStudentId] = useState(user.studentId);
  const [institution, setInstitution] = useState(user.institution);
  const [email, setEmail] = useState(user.email);
  const [isSimulatingGoogleLogin, setIsSimulatingGoogleLogin] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setName(user.name);
      setStudentId(user.studentId);
      setInstitution(user.institution);
      setEmail(user.email);
    }
  }, [user, isEditing]);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    sound.playClick();
    setIsSimulatingGoogleLogin(true);
    setTimeout(() => {
      setIsSimulatingGoogleLogin(false);
      const updated: UserProfile = {
        ...user,
        name: user.name || 'Hafizah Zakaria',
        email: user.email || 'hafizahzakaria@unisza.edu.my',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        studentId: user.studentId || 'CS20240501',
        institution: user.institution || 'UniSZA (Faculty of Informatics & Computing)'
      };
      onUpdateUser(updated);
      sound.playWin();
    }, 700);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    onUpdateUser({
      ...user,
      name,
      studentId,
      institution,
      email
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    sound.playClick();
    const guestUser: UserProfile = {
      name: 'Computer Science Student',
      email: 'student@unisza.edu.my',
      studentId: 'CS2024-GUEST',
      institution: 'UniSZA (Faculty of Informatics & Computing)',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=BolehCodeStudent',
      xp: 250,
      level: 1,
      streakDays: 1,
      completedTopics: [],
      completedVideos: [],
      badges: [],
      quizScores: {},
      gameHighScores: {}
    };
    onUpdateUser(guestUser);
    setName(guestUser.name);
    setEmail(guestUser.email);
    setStudentId(guestUser.studentId);
    setInstitution(guestUser.institution);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-[#0b0f19] border border-cyan-500/40 p-6 shadow-2xl relative text-slate-100 glow-cyan">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-cyber">Google Student Profile</h3>
              <p className="text-xs text-cyan-400/80 font-mono-code">OAuth 2.0 Security</p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="my-5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0b0f19] rounded-full flex items-center justify-center p-0.5 border border-cyan-400">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12c0 2.06.46 3.84 1.26 5.42l4.02-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
              <p className="text-xs text-cyan-300 font-mono-code truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                  {user.studentId}
                </span>
                <span className="truncate">{user.institution}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-center">
            <div className="p-1.5 rounded-lg bg-slate-950/60">
              <div className="flex items-center justify-center gap-1 text-cyan-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{user.xp} XP</span>
              </div>
              <span className="text-[10px] text-slate-400">Total Points</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950/60">
              <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>Level {user.level}</span>
              </div>
              <span className="text-[10px] text-slate-400">Rank Level</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-950/60">
              <div className="flex items-center justify-center gap-1 text-rose-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>{user.streakDays} Days</span>
              </div>
              <span className="text-[10px] text-slate-400">Study Streak</span>
            </div>
          </div>
        </div>

        {/* Google OAuth Quick Button */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={isSimulatingGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white text-slate-800 hover:bg-slate-100 font-semibold text-xs md:text-sm shadow transition disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12c0 2.06.46 3.84 1.26 5.42l4.02-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>{isSimulatingGoogleLogin ? 'Connecting to Google OAuth...' : 'Sign In with Google Account'}</span>
          </button>

          {!isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={() => { sound.playClick(); setIsEditing(true); }}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-slate-700 transition"
              >
                Update Student Details
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 text-xs transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Student Matric ID</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Institution / Faculty</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
