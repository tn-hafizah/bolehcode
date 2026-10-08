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
    setQuickActionNotice('Student profile updated successfully.');
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
    setQuickActionNotice(`Role switched to: ${newRole === 'admin' ? 'Admin (Lecturer)' : 'Student'}`);
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
    setQuickActionNotice('Signed out successfully. Guest profile active.');
    onLogoutSuccess?.();
    onClose();
  };

  const isUnauthorizedDomain = Boolean(
    authError && authError.toLowerCase().includes('unauthorized-domain')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 p-5 md:p-6 shadow-2xl relative text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-cyber">Google Student Profile</h3>
              <p className="text-xs text-indigo-600 font-mono-code font-medium">OAuth 2.0 Security &amp; Firebase</p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback notice if any */}
        {quickActionNotice && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-2 animate-in fade-in">
            <span className="flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{quickActionNotice}</span>
            </span>
            <button
              onClick={() => setQuickActionNotice(null)}
              className="text-emerald-700 hover:text-emerald-950 text-xs font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* User Card */}
        <div className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-200 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center p-0.5 border border-indigo-300 shadow-xs">
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
                <h4 className="text-sm font-bold text-slate-900 truncate">{user.name}</h4>
                {user.role === 'admin' ? (
                  <span className="px-1.5 py-0.2 rounded bg-pink-100 text-pink-700 border border-pink-200 text-[9px] font-bold font-mono-code uppercase flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" /> Admin
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 border border-indigo-200 text-[9px] font-bold font-mono-code uppercase">
                    Student
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-600 font-mono-code truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium">
                  {user.studentId}
                </span>
                <span className="truncate">{user.institution}</span>
              </div>
            </div>
          </div>

          {/* Quick Role Switcher for Testing & Admin Access */}
          <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500 font-medium">Account Role:</span>
            <div className="inline-flex rounded-lg bg-slate-200/80 p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => handleToggleRoleDirectly('student')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  user.role === 'student'
                    ? 'bg-white text-indigo-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleToggleRoleDirectly('admin')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  user.role === 'admin'
                    ? 'bg-white text-pink-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 text-center">
            <div className="p-1.5 rounded-lg bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-center gap-1 text-indigo-600 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{user.xp} XP</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Total Points</span>
            </div>
            <div className="p-1.5 rounded-lg bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-center gap-1 text-amber-600 text-xs font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>Level {user.level}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Rank Level</span>
            </div>
            <div className="p-1.5 rounded-lg bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-center gap-1 text-rose-600 text-xs font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>{user.streakDays} Days</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Study Streak</span>
            </div>
          </div>
        </div>

        {/* Google OAuth & Action Buttons */}
        <div className="space-y-3">
          {/* Main Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isSimulatingGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white text-slate-700 hover:bg-slate-50 font-semibold text-xs md:text-sm border border-slate-300 shadow-xs transition disabled:opacity-50 cursor-pointer"
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
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-left space-y-2.5 animate-in fade-in shadow-sm">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-700 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-amber-900 font-cyber">
                    Domain Authorization Needed (auth/unauthorized-domain)
                  </h5>
                  <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                    Google Auth prevents signing in from this preview URL until it is listed under <strong className="text-amber-950">Authorized domains</strong> in your Firebase Console.
                  </p>
                </div>
              </div>

              {/* Hostname Copy Box */}
              <div className="bg-white rounded-lg p-2 border border-amber-300 flex items-center justify-between gap-2 shadow-xs">
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] text-slate-500 block font-mono-code uppercase font-semibold">Domain to add:</span>
                  <code className="text-xs text-amber-800 font-mono-code font-bold truncate block">{currentDomain}</code>
                </div>
                <button
                  type="button"
                  onClick={handleCopyDomain}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition shrink-0 flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  {copiedDomain ? (
                    <>
                      <Check className="w-3 h-3 text-white" />
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
              <div className="text-[11px] text-slate-600 space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
                <p className="font-semibold text-indigo-700 flex items-center gap-1 text-[11px]">
                  <ExternalLink className="w-3 h-3" /> How to Authorize in Firebase (1 Minute):
                </p>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-600 text-[11px] pl-0.5">
                  <li>
                    Open{' '}
                    <a
                      href="https://console.firebase.google.com/project/bolehcode/authentication/settings"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline hover:text-indigo-800 font-medium"
                    >
                      Firebase Console (Authentication &gt; Settings)
                    </a>
                  </li>
                  <li>In the <strong>Authorized domains</strong> section, click <strong>Add domain</strong></li>
                  <li>Paste the domain shown above (<code className="text-amber-700 font-mono-code font-semibold">{currentDomain}</code>) and click <strong>Save</strong></li>
                </ol>
              </div>
            </div>
          )}

          {/* Standard Error Notice (if other error) */}
          {authError && !isUnauthorizedDomain && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center flex items-center justify-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Edit Profile or Form Toggle */}
          {!isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={() => { sound.playClick(); setIsEditing(true); }}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-indigo-700 border border-slate-200 transition cursor-pointer"
              >
                Update Profile Info
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs transition flex items-center justify-center cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3 pt-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 shadow-xs"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">Student Matric No.</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 shadow-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">Institution / Faculty</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 shadow-xs"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Official Student / Staff Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 shadow-xs"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      role === 'student'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      role === 'admin'
                        ? 'bg-pink-50 text-pink-700 border-pink-300 font-bold shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
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
                  className="flex-1 py-2 text-xs rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
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
