/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { TabType, UserProfile, VideoItem } from './types';
import { Navbar } from './components/Navbar';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { VideoModal } from './components/VideoModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { GetStartedScreen } from './components/landing/GetStartedScreen';
import { FeaturesHubTab } from './components/tabs/FeaturesHubTab';
import { TopicModulesTab } from './components/tabs/TopicModulesTab';
import { PastYearTab } from './components/tabs/PastYearTab';
import { QuizTab } from './components/tabs/QuizTab';
import { LeaderboardTab } from './components/tabs/LeaderboardTab';
import { GamesHubTab } from './components/tabs/GamesHubTab';
import { AdminDashboardTab } from './components/tabs/AdminDashboardTab';
import { subscribeToAuthChanges, checkIsAdmin, ADMIN_EMAIL } from './firebase/authService';
import { syncOrCreateStudentProfile, saveStudentProgress } from './firebase/studentService';
import { sound } from './utils/audio';
import { Sparkles, Heart, ArrowLeft, LayoutGrid } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'bolehcode_user_profile_v1';
const AUTH_STATE_KEY = 'bolehcode_is_authenticated';

const DEFAULT_USER: UserProfile = {
  name: 'Ahmad Faiz bin Rosli',
  email: 'faiz.rosli@student.unisza.edu.my',
  studentId: 'CS20230101',
  institution: 'UniSZA (Faculty of Informatics & Computing)',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  role: 'student',
  xp: 680,
  level: 5,
  streakDays: 7,
  completedTopics: [1, 2, 3],
  completedVideos: ['t1-dt-1', 't2-dt-1'],
  badges: ['badge-problemsolver', 'badge-modular'],
  quizScores: { 1: 90, 2: 85 },
  gameHighScores: { flowchart: 450 },
};

const getInitialTab = (): TabType => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('/admin') || hash.includes('admin')) {
      return 'admin';
    }
  }
  return 'hub';
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>(getInitialTab);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [xpToast, setXpToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STATE_KEY);
      if (savedAuth !== null) return savedAuth === 'true';
    } catch {
      // ignore
    }
    return false; // Start on clean Get Started screen on first visit
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_USER;
  });

  const handleSelectTab = (tab: TabType) => {
    setCurrentTab(tab);
    if (typeof window !== 'undefined') {
      try {
        if (tab === 'admin') {
          window.history.pushState(null, '', '/admin');
        } else if (window.location.pathname === '/admin') {
          window.history.pushState(null, '', '/');
        }
      } catch {
        // ignore iframe history restriction
      }
    }
  };

  // URL route sync (/admin)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/admin') || hash.includes('admin')) {
        setCurrentTab('admin');
        setIsLoggedIn(true);
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Firebase auth state subscription
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (fbUser) => {
      if (fbUser) {
        setIsLoggedIn(true);
        try {
          localStorage.setItem(AUTH_STATE_KEY, 'true');
        } catch {}

        try {
          const studentDoc = await syncOrCreateStudentProfile(fbUser);
          const isAdminUser = await checkIsAdmin(fbUser);
          setUser((prev) => ({
            ...prev,
            uid: fbUser.uid,
            name: studentDoc.name || fbUser.displayName || prev.name,
            email: studentDoc.email || fbUser.email || prev.email,
            avatar: studentDoc.avatar || fbUser.photoURL || prev.avatar,
            studentId: studentDoc.studentId || prev.studentId,
            institution: studentDoc.institution || prev.institution,
            role: isAdminUser ? 'admin' : (studentDoc.role || 'student'),
            xp: studentDoc.xp ?? prev.xp,
            level: studentDoc.level ?? prev.level,
            streakDays: studentDoc.streakDays ?? prev.streakDays,
            completedTopics: studentDoc.completedTopics ?? prev.completedTopics,
            completedVideos: studentDoc.completedVideos ?? prev.completedVideos,
            badges: studentDoc.badges ?? prev.badges,
          }));
        } catch (err) {
          console.warn('Firebase auth sync warning:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Save user profile state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  // Award XP and optionally unlock an achievement badge
  const handleAwardXP = (amount: number, badgeId?: string) => {
    setUser((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 150) + 1;
      const newBadges = [...prev.badges];

      let unlockedBadge = false;
      if (badgeId && !newBadges.includes(badgeId)) {
        newBadges.push(badgeId);
        unlockedBadge = true;
      }

      // Show toast
      const toastMsg = unlockedBadge
        ? `+${amount} XP & Lencana Baharu Dibuka! 🏆`
        : `+${amount} XP Diperoleh! ⚡`;
      setXpToast({ message: toastMsg, visible: true });
      setTimeout(() => setXpToast((t) => ({ ...t, visible: false })), 2600);

      if (unlockedBadge) {
        sound.playWin();
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      }

      const updated = {
        ...prev,
        xp: newXP,
        level: newLevel,
        badges: newBadges,
      };

      const uidToSave = prev.uid || `stud-${prev.studentId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'guest'}`;
      saveStudentProgress(uidToSave, { 
        name: prev.name,
        email: prev.email,
        studentId: prev.studentId,
        institution: prev.institution,
        role: prev.role,
        xp: newXP, 
        level: newLevel, 
        badges: newBadges 
      });

      return updated;
    });
  };

  // Toggle chapter complete
  const handleToggleTopicComplete = (topicId: number) => {
    setUser((prev) => {
      const isAlready = prev.completedTopics.includes(topicId);
      const nextTopics = isAlready
        ? prev.completedTopics.filter((id) => id !== topicId)
        : [...prev.completedTopics, topicId];

      if (!isAlready) {
        handleAwardXP(50);
      }

      const uidToSave = prev.uid || `stud-${prev.studentId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'guest'}`;
      saveStudentProgress(uidToSave, { 
        name: prev.name,
        email: prev.email,
        studentId: prev.studentId,
        completedTopics: nextTopics 
      });

      return {
        ...prev,
        completedTopics: nextTopics,
      };
    });
  };

  // Mark video as watched
  const handleMarkVideoWatched = (videoId: string) => {
    setUser((prev) => {
      if (prev.completedVideos.includes(videoId)) return prev;
      handleAwardXP(20);
      const nextVideos = [...prev.completedVideos, videoId];

      const uidToSave = prev.uid || `stud-${prev.studentId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'guest'}`;
      saveStudentProgress(uidToSave, { 
        name: prev.name,
        email: prev.email,
        studentId: prev.studentId,
        completedVideos: nextVideos 
      });

      return {
        ...prev,
        completedVideos: nextVideos,
      };
    });
  };

  // Handle Logout
  const handleLogout = () => {
    sound.playClick();
    setIsLoggedIn(false);
    try {
      localStorage.removeItem(AUTH_STATE_KEY);
    } catch {}
    setCurrentTab('hub');
  };

  const getFeatureTitle = (tab: TabType) => {
    switch (tab) {
      case 'modules': return 'Learning Modules (8 Chapters & Videos)';
      case 'pastyear': return 'Past Year Exam Bank (Google Drive)';
      case 'quiz': return 'Interactive Quizzes & Exercises';
      case 'leaderboard': return 'Student Cohort Leaderboard';
      case 'games': return 'Java Code Arcade (8 Mini-Games)';
      case 'admin': return 'Admin Dashboard (Lecturer Portal)';
      default: return 'Feature Portal';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans relative selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Background Soft Glow Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-pink-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-sky-500/5 rounded-full blur-[140px]" />
      </div>

      {/* Offline Toast */}
      <OfflineIndicator />

      {/* Floating XP & Badge Toast */}
      {xpToast.visible && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600 text-white font-black text-xs md:text-sm shadow-xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 fill-current" />
          <span>{xpToast.message}</span>
        </div>
      )}

      {/* Top Navigation Bar with Logo, Tagline & Google Sign-In */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-4 md:pt-6 relative z-10">
        {/* STEP 1: GET STARTED SCREEN (if user has not logged in yet) */}
        {!isLoggedIn ? (
          <GetStartedScreen
            onGetStarted={() => setIsAuthModalOpen(true)}
          />
        ) : (
          <>
            {/* STEP 3: PROFILE & LIST OF FEATURES (Central Hub) */}
            {currentTab === 'hub' && (
              <FeaturesHubTab
                user={user}
                onSelectFeature={handleSelectTab}
                onOpenProfileModal={() => setIsAuthModalOpen(true)}
                onLogout={handleLogout}
              />
            )}

            {/* STEP 4: GO TO EACH INDIVIDUAL FEATURE ("baru pergi ke setiap features") */}
            {currentTab !== 'hub' && (
              <div className="space-y-4">
                {/* Back to Features Hub Navigation Bar */}
                <div className="flex items-center justify-between bg-white/95 border border-slate-200/90 rounded-2xl px-4 py-2.5 backdrop-blur-md shadow-sm">
                  <button
                    onClick={() => {
                      sound.playClick();
                      handleSelectTab('hub');
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 hover:text-indigo-800 text-xs font-semibold transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Features Hub</span>
                  </button>

                  <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-slate-700 font-semibold">{getFeatureTitle(currentTab)}</span>
                  </div>
                </div>

                {/* Feature Views */}
                {currentTab === 'modules' && (
                  <TopicModulesTab
                    user={user}
                    onOpenVideo={(vid) => setActiveVideo(vid)}
                    onToggleTopicComplete={handleToggleTopicComplete}
                  />
                )}

                {currentTab === 'pastyear' && <PastYearTab />}

                {currentTab === 'quiz' && (
                  <QuizTab
                    user={user}
                    onAwardXP={handleAwardXP}
                  />
                )}

                {currentTab === 'leaderboard' && <LeaderboardTab user={user} />}

                {currentTab === 'games' && (
                  <GamesHubTab
                    user={user}
                    onAwardXP={handleAwardXP}
                  />
                )}

                {currentTab === 'admin' && (
                  <AdminDashboardTab
                    currentUser={user}
                    isAdmin={user.role === 'admin' || user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()}
                    onOpenAuth={() => setIsAuthModalOpen(true)}
                    onSelectTab={handleSelectTab}
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500 relative z-10 hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-cyber font-bold text-indigo-600 text-sm">BolehCode</span>
            <span className="text-slate-300">—</span>
            <span className="text-amber-600 font-medium">&ldquo;Slow-slow, Lama-lama Pro&rdquo;</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>Specially crafted for Computer Science Java Students &bull; Reference to Dr. Tuan's Lectures</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500 mx-1" />
          </div>

          <div className="text-[11px] font-mono-code text-indigo-600">
            PWA Progressive Web App &bull; Offline Ready
          </div>
        </div>
      </footer>

      {/* Video Modal Player */}
      <VideoModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
        onMarkWatched={handleMarkVideoWatched}
        isWatched={activeVideo ? user.completedVideos.includes(activeVideo.id) : false}
      />

      {/* Google Auth & Student Profile Modal */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onUpdateUser={setUser}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          try {
            localStorage.setItem(AUTH_STATE_KEY, 'true');
          } catch {}
          handleSelectTab('hub');
        }}
        onLogoutSuccess={() => {
          handleLogout();
        }}
      />
    </div>
  );
}
