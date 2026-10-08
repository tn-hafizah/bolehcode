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
      icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
      color: 'border-slate-200 hover:border-indigo-300 text-indigo-700',
      badge: '8 Full Chapters',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      statLabel: 'Your Progress',
      statValue: `${completedTopicsCount} / 8 Topics Completed`,
      ctaText: 'Open Learning Modules',
    },
    {
      id: 'pastyear' as TabType,
      title: 'Past Year Exam Bank',
      subtitle: 'Final Exams & Lab Assessments',
      description: 'Collection of previous semester exam papers and UniSZA lab tests with direct links to official Google Drive folders.',
      icon: <FileText className="w-6 h-6 text-amber-600" />,
      color: 'border-slate-200 hover:border-amber-300 text-amber-700',
      badge: 'Google Drive Ready',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      statLabel: 'Format',
      statValue: 'PDF & Solution Code',
      ctaText: 'Explore Question Bank',
    },
    {
      id: 'quiz' as TabType,
      title: 'Interactive Quizzes & Practice',
      subtitle: 'Knowledge Check & Firestore Sync',
      description: 'Topic-by-topic reinforcement exercises. Test your understanding, get instant score calculations, and record progress directly to the database.',
      icon: <HelpCircle className="w-6 h-6 text-purple-600" />,
      color: 'border-slate-200 hover:border-purple-300 text-purple-700',
      badge: 'Auto Grading',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      statLabel: 'Completed Quizzes',
      statValue: `${quizScoresCount} Topics Completed`,
      ctaText: 'Start Taking Quizzes',
    },
    {
      id: 'leaderboard' as TabType,
      title: 'Leaderboard & Rankings',
      subtitle: 'Cohort Competition',
      description: 'Compare your XP points, achievement badges, and completion milestones with classmates across Faculty of Informatics & Computing.',
      icon: <Trophy className="w-6 h-6 text-yellow-600" />,
      color: 'border-slate-200 hover:border-yellow-300 text-yellow-700',
      badge: 'Live Cohort XP',
      badgeColor: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      statLabel: 'Total Earned',
      statValue: `${user.xp} Total XP`,
      ctaText: 'View Leaderboard',
    },
    {
      id: 'games' as TabType,
      title: 'Java Code Arcade',
      subtitle: '8 Interactive Mini-Games',
      description: 'Learn programming through gamification: Syntax Runner, Bug Smasher, Memory Code, Loop Racer, and algorithm challenges.',
      icon: <Gamepad2 className="w-6 h-6 text-emerald-600" />,
      color: 'border-slate-200 hover:border-emerald-300 text-emerald-700',
      badge: '8 Mini-Games',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      statLabel: 'Arcade Mode',
      statValue: 'Logic & Syntax Mastery',
      ctaText: 'Play Java Arcade',
    },
    {
      id: 'admin' as TabType,
      title: 'Admin Dashboard',
      subtitle: 'Student Progress & Analytics',
      description: 'Dedicated instructor portal to inspect registered students, calculate quiz averages, evaluate cohort mastery, and export CSV reports.',
      icon: <ShieldCheck className="w-6 h-6 text-pink-600" />,
      color: isAdmin 
        ? 'border-pink-200 hover:border-pink-300 text-pink-700' 
        : 'border-slate-200 text-slate-500',
      badge: isAdmin ? 'Lecturer Access Active' : 'Restricted (Admin Only)',
      badgeColor: isAdmin 
        ? 'bg-pink-50 text-pink-700 border-pink-200 font-bold' 
        : 'bg-slate-100 text-slate-500 border-slate-200',
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
      <section className="relative rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/60 border border-indigo-100/90 p-6 sm:p-8 shadow-md shadow-indigo-100/50 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* User Identity info */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-400 shadow-md shadow-indigo-500/10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/bottts/svg?seed=' + user.name;
                }}
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-indigo-600 text-white font-black text-[10px] font-mono-code shadow">
                LV.{user.level}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {user.name}
                </h1>
                
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-100 border border-pink-200 text-pink-700 font-bold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Lecturer / Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Student
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-500 font-mono-code">
                {user.email || 'student@unisza.edu.my'} &bull; ID: {user.studentId || 'CS20240188'}
              </p>

              <p className="text-xs text-slate-500">
                {user.institution || 'UniSZA (Faculty of Informatics & Computing)'}
              </p>
            </div>
          </div>

          {/* Gamification Stats & Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 sm:gap-3 bg-white border border-slate-200 rounded-2xl p-2.5 sm:px-4 shadow-xs">
              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-indigo-600 font-black text-base sm:text-lg">
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{user.xp}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Total XP</span>
              </div>

              <div className="h-7 w-[1px] bg-slate-200" />

              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-amber-600 font-black text-base sm:text-lg">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>{user.streakDays}d</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Streak</span>
              </div>

              <div className="h-7 w-[1px] bg-slate-200" />

              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-purple-600 font-black text-base sm:text-lg">
                  <Award className="w-4 h-4" />
                  <span>{user.badges?.length || 0}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Badges</span>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenProfileModal();
                }}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
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
                className="px-3 py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Level Progression Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-200/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-600 font-medium">
              Level {user.level} Progress &bull; {user.xp % 150} / 150 XP to Level {user.level + 1}
            </span>
            <span className="text-indigo-600 font-mono-code font-bold">
              {Math.min(100, Math.round(((user.xp % 150) / 150) * 100))}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 transition-all duration-500 rounded-full"
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
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Explore Features</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {features.length} Portals
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
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
                className="group relative rounded-3xl bg-white border border-slate-200/90 hover:border-indigo-300 p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.015] hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer overflow-hidden backdrop-blur-sm shadow-xs"
              >
                {/* Ambient glow in card background */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl group-hover:bg-indigo-100/60 transition-colors pointer-events-none" />

                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                      {feat.icon}
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${feat.badgeColor}`}>
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 mb-2.5">
                    {feat.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-6">
                    {feat.description}
                  </p>
                </div>

                {/* Footer with Stat & CTA Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {feat.statLabel}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {feat.statValue}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(feat.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 group-hover:bg-indigo-600 text-slate-700 group-hover:text-white font-bold text-xs transition-all shadow-xs border border-slate-200 group-hover:border-indigo-600 cursor-pointer"
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
      <section className="bg-gradient-to-r from-indigo-50/80 via-sky-50 to-purple-50/70 border border-indigo-100 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0 text-indigo-600">
            <Play className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">Need a Quick Start?</h4>
            <p className="text-xs text-slate-600">
              Jump straight into Chapter 1 (Introduction &amp; Logic Thinking) with Dr. Tuan&apos;s UniSZA lecture series.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onSelectFeature('modules');
          }}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-500/20 transition cursor-pointer"
        >
          <span>Watch Chapter 1</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
