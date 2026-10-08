import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  X, 
  Check, 
  Award, 
  Flame, 
  Sparkles, 
  LogOut, 
  UserCheck, 
  ShieldCheck, 
  AlertTriangle, 
  Copy, 
  ExternalLink, 
  Zap,
  RefreshCw
} from 'lucide-react';
import { sound } from '../utils/audio';
import { loginWithGoogle, logoutUser, checkIsAdmin, ADMIN_EMAIL } from '../firebase/authService';
import { syncOrCreateStudentProfile, saveStudentProgress } from '../firebase/studentService';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onLoginSuccess?: () => void;
  onLogoutSuccess?: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLoginSuccess,
  onLogoutSuccess,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [studentId, setStudentId] = useState(user.studentId);
  const [institution, setInstitution] = useState(user.institution);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<'student' | 'admin'>(user.role);
  const [isSimulatingGoogleLogin, setIsSimulatingGoogleLogin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [quickActionNotice, setQuickActionNotice] = useState<string | null>(null);

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'run.app';

  useEffect(() => {
    if (!isEditing) {
      setName(user.name);
      setStudentId(user.studentId);
      setInstitution(user.institution);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user, isEditing]);

  if (!isOpen) return null;

  const handleCopyDomain = () => {
    sound.playClick();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentDomain);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }
  };

  const handleGoogleSignIn = async () => {
    sound.playClick();
    setIsSimulatingGoogleLogin(true);
    setAuthError(null);
    setQuickActionNotice(null);
    try {
      const firebaseUser = await loginWithGoogle();
      const studentDoc = await syncOrCreateStudentProfile(firebaseUser, {
        studentId,
        institution,
        initialXP: user.xp,
      });
      const isAdmin = await checkIsAdmin(firebaseUser);
      const updated: UserProfile = {
        ...user,
        uid: firebaseUser.uid,
        name: studentDoc.name || firebaseUser.displayName || 'Computer Science Student',
        email: studentDoc.email || firebaseUser.email || '',
        avatar: studentDoc.avatar || firebaseUser.photoURL || user.avatar,
        studentId: studentDoc.studentId || user.studentId,
        institution: studentDoc.institution || user.institution,
        role: isAdmin ? 'admin' : (studentDoc.role || 'student'),
        xp: studentDoc.xp ?? user.xp,
        level: studentDoc.level ?? user.level,
        streakDays: studentDoc.streakDays ?? user.streakDays,
        completedTopics: studentDoc.completedTopics ?? user.completedTopics,
        completedVideos: studentDoc.completedVideos ?? user.completedVideos,
        badges: studentDoc.badges ?? user.badges,
      };
      onUpdateUser(updated);
      sound.playWin();
      onLoginSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      if (error?.code !== 'auth/popup-closed-by-user') {
        const errorMsg = error?.message || 'Authentication error. Please try again.';
        setAuthError(errorMsg);
      }
    } finally {
      setIsSimulatingGoogleLogin(false);
    }
  };

  const handleQuickLoginAsAdmin = async () => {
    sound.playClick();
    setAuthError(null);
    const adminUser: UserProfile = {
      ...user,
      uid: user.uid && !user.uid.startsWith('guest') ? user.uid : 'admin-dr-hafizah',
      name: 'Ts. Dr. Tuan Norhafizah Tuan Zakaria',
      email: ADMIN_EMAIL,
      studentId: 'STAFF-FIK-01',
      institution: 'UniSZA (Faculty of Informatics & Computing)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      xp: Math.max(user.xp || 0, 1478),
      level: Math.max(user.level || 0, 10),
      streakDays: Math.max(user.streakDays || 0, 5),
      completedTopics: user.completedTopics.length > 0 ? user.completedTopics : [1, 2, 3, 4, 5, 6, 7, 8],
      completedVideos: user.completedVideos.length > 0 ? user.completedVideos : ['t1-dt-1', 't2-dt-1', 't3-dt-1', 't4-dt-1'],
      badges: user.badges.length > 0 ? user.badges : ['badge-problemsolver', 'badge-modular', 'badge-master', 'badge-champion'],
      quizScores: Object.keys(user.quizScores || {}).length > 0 ? user.quizScores : { 1: 100, 2: 95, 3: 90, 4: 100 },
      gameHighScores: user.gameHighScores || { flowchart: 500 },
    };
    onUpdateUser(adminUser);
    setName(adminUser.name);
    setEmail(adminUser.email);
    setStudentId(adminUser.studentId);
    setInstitution(adminUser.institution);
    setRole('admin');
    setQuickActionNotice('Berjaya log masuk sebagai Pengajar / Admin (Ts. Dr. Norhafizah)! Portal Admin kini boleh diakses.');

    try {
      await saveStudentProgress(adminUser.uid!, {
        name: adminUser.name,
        email: adminUser.email,
        studentId: adminUser.studentId,
        institution: adminUser.institution,
        role: 'admin',
        xp: adminUser.xp,
        level: adminUser.level,
        streakDays: adminUser.streakDays,
        completedTopics: adminUser.completedTopics,
      });
    } catch (e) {
      console.warn('Sync admin profile warning:', e);
    }
    sound.playWin();
    onLoginSuccess?.();
    onClose();
  };

  const handleQuickLoginAsStudent = async () => {
    sound.playClick();
    setAuthError(null);
    const studentUser: UserProfile = {
      ...user,
      uid: user.uid && !user.uid.startsWith('admin') ? user.uid : 'stud-cs-001',
      name: 'Ahmad Faiz bin Rosli',
      email: 'faiz.rosli@student.unisza.edu.my',
      studentId: 'CS20230101',
      institution: 'UniSZA (Faculty of Informatics & Computing)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'student',
      xp: 680,
      level: 5,
      streakDays: 7,
      completedTopics: [1, 2, 3, 4, 5],
      completedVideos: ['t1-dt-1', 't2-dt-1', 't3-dt-1'],
      badges: ['badge-problemsolver', 'badge-modular'],
      quizScores: { 1: 90, 2: 85, 3: 95 },
      gameHighScores: { flowchart: 450 },
    };
    onUpdateUser(studentUser);
    setName(studentUser.name);
    setEmail(studentUser.email);
    setStudentId(studentUser.studentId);
    setInstitution(studentUser.institution);
    setRole('student');
    setQuickActionNotice('Berjaya log masuk mod Pelajar! Kemajuan kuiz dan latihan akan direkodkan.');

    try {
      await saveStudentProgress(studentUser.uid!, {
        name: studentUser.name,
        email: studentUser.email,
        studentId: studentUser.studentId,
        institution: studentUser.institution,
        role: 'student',
        xp: studentUser.xp,
        level: studentUser.level,
        streakDays: studentUser.streakDays,
        completedTopics: studentUser.completedTopics,
      });
    } catch (e) {
      console.warn('Sync student profile warning:', e);
    }
    sound.playWin();
    onLoginSuccess?.();
    onClose();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    sound.playClick();
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name,
      studentId,
      institution,
      email,
      role,
    };
    onUpdateUser(updated);
    if (user.uid) {
      try {
        await saveStudentProgress(user.uid, { name, studentId, institution, email, role });
      } catch (err) {
        console.error('Failed to sync profile changes to Firestore:', err);
      }
    }
    setIsEditing(false);
    setQuickActionNotice('Profil pelajar berjaya dikemaskini.');
  };

  const handleToggleRoleDirectly = async (newRole: 'student' | 'admin') => {
    sound.playClick();
    setRole(newRole);
    const updated: UserProfile = {
      ...user,
      role: newRole,
    };
    onUpdateUser(updated);
    if (user.uid) {
      try {
        await saveStudentProgress(user.uid, { role: newRole });
      } catch (err) {
        console.warn('Role update warning:', err);
      }
    }
    setQuickActionNotice(`Peranan ditukar kepada: ${newRole === 'admin' ? 'Admin (Pengajar)' : 'Student (Pelajar)'}`);
  };

  const handleLogout = async () => {
    sound.playClick();
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Logout warning:', e);
    }
    const guestUser: UserProfile = {
      name: 'Computer Science Student',
      email: 'student@unisza.edu.my',
      studentId: 'CS2024-GUEST',
      institution: 'UniSZA (Faculty of Informatics & Computing)',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=BolehCodeStudent',
      role: 'student',
      xp: 250,
      level: 1,
      streakDays: 1,
      completedTopics: [],
      completedVideos: [],
      badges: [],
      quizScores: {},
      gameHighScores: {},
    };
    onUpdateUser(guestUser);
    setName(guestUser.name);
    setEmail(guestUser.email);
    setStudentId(guestUser.studentId);
    setInstitution(guestUser.institution);
    setRole('student');
    setAuthError(null);
    setQuickActionNotice('Log keluar berjaya. Profil tetamu diaktifkan.');
    onLogoutSuccess?.();
    onClose();
  };

  const isUnauthorizedDomain = Boolean(
    authError && authError.toLowerCase().includes('unauthorized-domain')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0b0f19] border border-cyan-500/40 p-5 md:p-6 shadow-2xl relative text-slate-100 glow-cyan">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-cyber">Google Student Profile</h3>
              <p className="text-xs text-cyan-400/80 font-mono-code">OAuth 2.0 Security &amp; Firebase</p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback notice if any */}
        {quickActionNotice && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-2 animate-in fade-in">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{quickActionNotice}</span>
            </span>
            <button
              onClick={() => setQuickActionNotice(null)}
              className="text-emerald-400 hover:text-white text-xs"
            >
              ×
            </button>
          </div>
        )}

        {/* User Card */}
        <div className="my-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
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
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
                {user.role === 'admin' ? (
                  <span className="px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[9px] font-bold font-mono-code uppercase flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" /> Admin
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-bold font-mono-code uppercase">
                    Student
                  </span>
                )}
              </div>
              <p className="text-xs text-cyan-300 font-mono-code truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                  {user.studentId}
                </span>
                <span className="truncate">{user.institution}</span>
              </div>
            </div>
          </div>

          {/* Quick Role Switcher for Testing & Admin Access */}
          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400">Account Role:</span>
            <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
              <button
                type="button"
                onClick={() => handleToggleRoleDirectly('student')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                  user.role === 'student'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleToggleRoleDirectly('admin')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                  user.role === 'admin'
                    ? 'bg-pink-500/20 text-pink-300 font-bold border border-pink-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center">
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

        {/* Google OAuth & Action Buttons */}
        <div className="space-y-3">
          {/* Main Google Sign-In Button */}
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

          {/* Unauthorized Domain Explainer Banner */}
          {isUnauthorizedDomain && (
            <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/50 text-slate-100 text-left space-y-2.5 animate-in fade-in shadow-xl">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-amber-300 font-cyber">
                    Domain Authorization Needed (auth/unauthorized-domain)
                  </h5>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    Google Auth prevents signing in from this preview URL because it needs to be listed under <strong className="text-white">Authorized domains</strong> in your Firebase Console.
                  </p>
                </div>
              </div>

              {/* Hostname Copy Box */}
              <div className="bg-black/70 rounded-lg p-2 border border-amber-500/30 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] text-slate-400 block font-mono-code uppercase">Domain to add:</span>
                  <code className="text-xs text-amber-200 font-mono-code font-bold truncate block">{currentDomain}</code>
                </div>
                <button
                  type="button"
                  onClick={handleCopyDomain}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition shrink-0 flex items-center gap-1 shadow"
                >
                  {copiedDomain ? (
                    <>
                      <Check className="w-3 h-3 text-slate-950" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Domain</span>
                    </>
                  )}
                </button>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="text-[11px] text-slate-300 space-y-1 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <p className="font-semibold text-cyan-300 flex items-center gap-1 text-[11px]">
                  <ExternalLink className="w-3 h-3" /> How to Authorize in Firebase (1 Minute):
                </p>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-300 text-[11px] pl-0.5">
                  <li>
                    Open{' '}
                    <a
                      href="https://console.firebase.google.com/project/bolehcode/authentication/settings"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 underline hover:text-cyan-300 font-medium"
                    >
                      Firebase Console (Authentication &gt; Settings)
                    </a>
                  </li>
                  <li>In the <strong>Authorized domains</strong> section, click <strong>Add domain</strong></li>
                  <li>Paste the domain shown above (<code className="text-amber-300 font-mono-code">{currentDomain}</code>) and click <strong>Save</strong></li>
                </ol>
              </div>

              {/* Instant Bypass Buttons */}
              <div className="pt-1 border-t border-amber-500/30">
                <p className="text-[10px] font-bold text-emerald-400 mb-1.5 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Instant Bypass (Continue Immediately Without Waiting):
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleQuickLoginAsAdmin}
                    className="py-1.5 px-2 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-[11px] transition shadow flex items-center justify-center gap-1 text-center"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Enter as Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickLoginAsStudent}
                    className="py-1.5 px-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-[11px] transition shadow flex items-center justify-center gap-1 text-center"
                  >
                    <UserCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Enter as Student</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Standard Error Notice (if other error) */}
          {authError && !isUnauthorizedDomain && (
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs text-center flex items-center justify-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Quick 1-Click Fast Login Options (Always available) */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-mono-code font-bold uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Instant Demo Access:
              </span>
              <span className="text-[10px] text-slate-500">Fast Testing</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickLoginAsAdmin}
                className="py-2 px-2.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 hover:border-pink-500/60 text-pink-300 font-semibold text-xs transition flex items-center justify-center gap-1.5 text-center"
                title="Sign in as Ts. Dr. Norhafizah (Admin)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span className="truncate">Admin (Dr. Norhafizah)</span>
              </button>
              <button
                type="button"
                onClick={handleQuickLoginAsStudent}
                className="py-2 px-2.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-300 font-semibold text-xs transition flex items-center justify-center gap-1.5 text-center"
                title="Sign in as Demo Student"
              >
                <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">Student Demo</span>
              </button>
            </div>
          </div>

          {/* Edit Profile or Form Toggle */}
          {!isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={() => { sound.playClick(); setIsEditing(true); }}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-slate-700 transition"
              >
                Update Profile Info
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 text-xs transition flex items-center justify-center"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3 pt-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
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
                  <label className="text-[11px] text-slate-400 block mb-1">Student Matric No.</label>
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
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Official Student / Staff Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                      role === 'student'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                      role === 'admin'
                        ? 'bg-pink-500/20 text-pink-300 border-pink-400 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Admin (Instructor)
                  </button>
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
                  Save Profile
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
