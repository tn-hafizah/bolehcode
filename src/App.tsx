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
import { TopicModulesTab } from './components/tabs/TopicModulesTab';
import { PastYearTab } from './components/tabs/PastYearTab';
import { QuizTab } from './components/tabs/QuizTab';
import { LeaderboardTab } from './components/tabs/LeaderboardTab';
import { GamesHubTab } from './components/tabs/GamesHubTab';
import { sound } from './utils/audio';
import { Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'bolehcode_user_profile_v1';

const DEFAULT_USER: UserProfile = {
  name: 'Hafizah Zakaria',
  email: 'hafizahzakaria@unisza.edu.my',
  studentId: 'CS20240188',
  institution: 'UniSZA (FKI)',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  xp: 450,
  level: 4,
  streakDays: 5,
  completedTopics: [1],
  completedVideos: ['t1-dt-1'],
  badges: ['badge-problemsolver'],
  quizScores: {},
  gameHighScores: {},
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('modules');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [xpToast, setXpToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
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
        ? `+${amount} XP & New Badge Unlocked! 🏆`
        : `+${amount} XP Earned! ⚡`;
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

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        badges: newBadges,
      };
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
      return {
        ...prev,
        completedVideos: [...prev.completedVideos, videoId],
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Cyber Glow Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-pink-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-[140px]" />
      </div>

      {/* Offline Toast */}
      <OfflineIndicator />

      {/* Floating XP & Badge Toast */}
      {xpToast.visible && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-pink-500 text-slate-950 font-black text-xs md:text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 fill-current" />
          <span>{xpToast.message}</span>
        </div>
      )}

      {/* Top Navigation Bar with Logo, Tagline & Google Sign-In */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-4 md:pt-6 relative z-10">
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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#04070f] py-6 px-4 text-center text-xs text-slate-400 relative z-10 hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-cyber font-bold text-cyan-400 text-sm">BolehCode</span>
            <span className="text-slate-400">—</span>
            <span className="text-amber-300 font-medium">Slow-slow, Lama-lama Pro</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Specially crafted for Computer Science Java Students &bull; Reference to Dr. Tuan's Lectures</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500 mx-1" />
          </div>

          <div className="text-[11px] font-mono-code text-cyan-400/80">
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
      />
    </div>
  );
}
