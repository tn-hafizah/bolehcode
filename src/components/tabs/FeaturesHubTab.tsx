import React from 'react';
import { UserProfile, TabType } from '../../types';
import { 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Trophy, 
  Gamepad2, 
  ShieldCheck, 
  Flame, 
  Award, 
  ArrowRight, 
  UserCheck, 
  LogOut, 
  GraduationCap, 
  ChevronRight,
  Zap,
  Play
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { ADMIN_EMAIL } from '../../firebase/authService';

interface FeaturesHubTabProps {
  user: UserProfile;
  onSelectFeature: (tab: TabType) => void;
  onOpenProfileModal: () => void;
  onLogout: () => void;
}

export const FeaturesHubTab: React.FC<FeaturesHubTabProps> = ({
  user,
  onSelectFeature,
  onOpenProfileModal,
  onLogout,
}) => {
  const isAdmin = user.role === 'admin' || user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const completedTopicsCount = user.completedTopics?.length || 0;
  const quizScoresCount = Object.keys(user.quizScores || {}).length;

  const features = [
    {
      id: 'modules' as TabType,
      title: 'Learning Modules',
      subtitle: '8 Core Topics & Video Lectures',
      description: 'Follow the Java curriculum step by step. Includes Dr. Tuan & YouTube lecture videos, concept summaries, and live interactive code.',
      icon: <BookOpen className="w-6 h-6 text-cyan-400" />,
      color: 'from-cyan-500/20 to-blue-600/10 border-cyan-500/30 text-cyan-300',
      badge: '8 Full Chapters',
      badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      statLabel: 'Your Progress',
      statValue: `${completedTopicsCount} / 8 Topics Completed`,
      ctaText: 'Open Learning Modules',
    },
    {
      id: 'pastyear' as TabType,
      title: 'Past Year Exam Bank',
      subtitle: 'Final Exams & Lab Assessments',
      description: 'Collection of previous semester exam papers and UniSZA lab tests with direct links to official Google Drive folders.',
      icon: <FileText className="w-6 h-6 text-amber-400" />,
      color: 'from-amber-500/20 to-orange-600/10 border-amber-500/30 text-amber-300',
      badge: 'Google Drive Ready',
      badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      statLabel: 'Format',
      statValue: 'PDF & Solution Code',
      ctaText: 'Explore Question Bank',
    },
    {
      id: 'quiz' as TabType,
      title: 'Interactive Quizzes & Practice',
      subtitle: 'Knowledge Check & Firestore Sync',
      description: 'Topic-by-topic reinforcement exercises. Test your understanding, get instant score calculations, and record progress directly to the database.',
      icon: <HelpCircle className="w-6 h-6 text-purple-400" />,
      color: 'from-purple-500/20 to-indigo-600/10 border-purple-500/30 text-purple-300',
      badge: 'Auto Grading',
      badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      statLabel: 'Completed Quizzes',
      statValue: `${quizScoresCount} Topics Completed`,
      ctaText: 'Start Taking Quizzes',
    },
    {
      id: 'leaderboard' as TabType,
      title: 'Leaderboard & Rankings',
      subtitle: 'Cohort Competition',
      description: 'Compare your XP points, achievement badges, and completion milestones with classmates across Faculty of Informatics & Computing.',
      icon: <Trophy className="w-6 h-6 text-yellow-400" />,
      color: 'from-yellow-500/20 to-amber-600/10 border-yellow-500/30 text-yellow-300',
      badge: 'Live Cohort XP',
      badgeColor: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
      statLabel: 'Total Earned',
      statValue: `${user.xp} Total XP`,
      ctaText: 'View Leaderboard',
    },
    {
      id: 'games' as TabType,
      title: 'Java Code Arcade',
      subtitle: '8 Interactive Mini-Games',
      description: 'Learn programming through gamification: Syntax Runner, Bug Smasher, Memory Code, Loop Racer, and algorithm challenges.',
      icon: <Gamepad2 className="w-6 h-6 text-emerald-400" />,
      color: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/30 text-emerald-300',
      badge: '8 Mini-Games',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      statLabel: 'Arcade Mode',
      statValue: 'Logic & Syntax Mastery',
      ctaText: 'Play Java Arcade',
    },
    {
      id: 'admin' as TabType,
      title: 'Admin Dashboard',
      subtitle: 'Student Progress & Analytics',
      description: 'Dedicated instructor portal to inspect registered students, calculate quiz averages, evaluate cohort mastery, and export CSV reports.',
      icon: <ShieldCheck className="w-6 h-6 text-pink-400" />,
      color: isAdmin 
        ? 'from-pink-500/20 via-purple-600/10 to-rose-600/10 border-pink-500/40 text-pink-300' 
        : 'from-slate-800/40 to-slate-900/40 border-slate-800 text-slate-400',
      badge: isAdmin ? 'Lecturer Access Active' : 'Restricted (Admin Only)',
      badgeColor: isAdmin 
        ? 'bg-pink-500/20 text-pink-300 border-pink-500/40 font-bold' 
        : 'bg-slate-800 text-slate-400 border-slate-700',
      statLabel: 'Access Status',
      statValue: isAdmin ? 'Authorized (Admin)' : 'Admin Role Required',
      ctaText: isAdmin ? 'Open Admin Portal' : 'Restricted Portal',
    },
  ];

  const handleCardClick = (tab: TabType) => {
    sound.playClick();
    onSelectFeature(tab);
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* ======================================================== */}
      {/* 1. USER PROFILE SECTION                                   */}
      {/* ======================================================== */}
      <section className="relative rounded-3xl bg-gradient-to-br from-[#0c182c] via-[#091222] to-[#12142d] border border-cyan-500/30 p-6 sm:p-8 shadow-xl shadow-cyan-950/40 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* User Identity info */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg shadow-cyan-500/20"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/bottts/svg?seed=' + user.name;
                }}
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-cyan-500 text-slate-950 font-black text-[10px] font-mono-code shadow">
                LV.{user.level}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {user.name}
                </h1>
                
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 font-bold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Lecturer / Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Student
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-400 font-mono-code">
                {user.email || 'student@unisza.edu.my'} &bull; ID: {user.studentId || 'CS20240188'}
              </p>

              <p className="text-xs text-slate-400">
                {user.institution || 'UniSZA (Faculty of Informatics & Computing)'}
              </p>
            </div>
          </div>

          {/* Gamification Stats & Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 sm:px-4">
              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-cyan-400 font-black text-base sm:text-lg">
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{user.xp}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Total XP</span>
              </div>

              <div className="h-7 w-[1px] bg-slate-800" />

              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-orange-400 font-black text-base sm:text-lg">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>{user.streakDays}d</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Streak</span>
              </div>

              <div className="h-7 w-[1px] bg-slate-800" />

              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-purple-400 font-black text-base sm:text-lg">
                  <Award className="w-4 h-4" />
                  <span>{user.badges?.length || 0}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Badges</span>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenProfileModal();
                }}
                className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Edit Profile & Role"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onLogout();
                }}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-700/50 text-slate-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Level Progression Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">
              Level {user.level} Progress &bull; {user.xp % 150} / 150 XP to Level {user.level + 1}
            </span>
            <span className="text-cyan-400 font-mono-code font-bold">
              {Math.min(100, Math.round(((user.xp % 150) / 150) * 100))}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, Math.max(8, Math.round(((user.xp % 150) / 150) * 100)))}%` }}
            />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. LIST OF FEATURES SECTION (Interactive Cards)           */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Explore Features</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {features.length} Portals
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Select any feature below to start learning, practicing, or reviewing analytics.
            </p>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat) => {
            return (
              <div
                key={feat.id}
                onClick={() => handleCardClick(feat.id)}
                className={`group relative rounded-3xl bg-[#0a1122]/90 border p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.015] hover:shadow-2xl hover:shadow-cyan-950/40 cursor-pointer overflow-hidden backdrop-blur-sm ${feat.color}`}
              >
                {/* Ambient glow in card background */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors pointer-events-none" />

                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      {feat.icon}
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${feat.badgeColor}`}>
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-xs font-semibold text-cyan-400/80 mb-2.5">
                    {feat.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-6">
                    {feat.description}
                  </p>
                </div>

                {/* Footer with Stat & CTA Button */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {feat.statLabel}
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {feat.statValue}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(feat.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/90 group-hover:bg-cyan-500 text-slate-200 group-hover:text-slate-950 font-bold text-xs transition-all shadow-sm border border-slate-700/60 group-hover:border-cyan-400 cursor-pointer"
                  >
                    <span>{feat.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Study Tip & Dr. Tuan Shoutout */}
      <section className="bg-gradient-to-r from-cyan-950/40 via-[#0a1428] to-purple-950/40 border border-cyan-800/40 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0 text-cyan-300">
            <Play className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">Need a Quick Start?</h4>
            <p className="text-xs text-slate-300">
              Jump straight into Chapter 1 (Introduction & Logic Thinking) with Dr. Tuan&apos;s UniSZA lecture series.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onSelectFeature('modules');
          }}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer"
        >
          <span>Watch Chapter 1</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
