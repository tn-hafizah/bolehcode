import React, { useState } from 'react';
import { UserProfile, LeaderboardUser } from '../../types';
import { INITIAL_LEADERBOARD, ALL_BADGES } from '../../data/leaderboardData';
import { 
  Trophy, 
  Crown, 
  Award, 
  Sparkles, 
  Coffee, 
  ShieldCheck, 
  Repeat, 
  Grid, 
  Zap, 
  Brain, 
  Code, 
  FileCode, 
  Lock, 
  CheckCircle2, 
  Users 
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface LeaderboardTabProps {
  user: UserProfile;
}

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'podium' | 'badges'>('podium');

  // Insert current user into leaderboard list dynamically based on XP
  const currentUserEntry: LeaderboardUser = {
    rank: 0,
    name: user.name,
    studentId: user.studentId,
    institution: user.institution,
    avatar: user.avatar,
    xp: user.xp,
    level: user.level,
    badgesCount: user.badges.length,
    isCurrentUser: true,
  };

  const combinedList = [...INITIAL_LEADERBOARD.filter(u => u.studentId !== user.studentId), currentUserEntry]
    .sort((a, b) => b.xp - a.xp)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

  const top1 = combinedList[0];
  const top2 = combinedList[1];
  const top3 = combinedList[2];

  // Helper icon for badges
  const renderBadgeIcon = (iconName: string, className = "w-6 h-6") => {
    switch (iconName) {
      case 'Coffee': return <Coffee className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Repeat': return <Repeat className={className} />;
      case 'Grid': return <Grid className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Brain': return <Brain className={className} />;
      case 'Code': return <Code className={className} />;
      case 'FileCode': return <FileCode className={className} />;
      default: return <Award className={className} />;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-amber-50/70 border border-indigo-100 p-5 md:p-7 shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono-code font-semibold mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Scoring System &amp; Student Standings</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-cyber tracking-tight">
              Champions Podium &amp; Badges
            </h1>
            <p className="text-xs md:text-sm text-slate-600 max-w-xl">
              Earn XP points by watching lecture modules, tackling quizzes, and winning mini-games to claim the top spot on BolehCode!
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
            <button
              onClick={() => { sound.playClick(); setActiveTab('podium'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'podium'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Standings Podium</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveTab('badges'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'badges'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Badges ({user.badges.length}/{ALL_BADGES.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'podium' ? (
        <div className="space-y-8 animate-in fade-in">
          {/* Top 3 Podium */}
          <div className="pt-8 pb-4 px-2">
            <div className="max-w-3xl mx-auto flex items-end justify-center gap-2 sm:gap-6">
              
              {/* 2nd Place: Silver 🥈 */}
              {top2 && (
                <div className="flex-1 flex flex-col items-center">
                  <div className="relative mb-2 flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl mb-1 filter drop-shadow">🥈</span>
                    <div className="relative">
                      <img
                        src={top2.avatar}
                        alt={top2.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-slate-300 shadow-md shadow-slate-300/40"
                      />
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold text-[10px] font-mono-code shadow-xs border border-slate-300">
                        #2 Silver
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-3 text-center truncate max-w-[110px] sm:max-w-[140px]">
                      {top2.name}
                    </h3>
                    <span className="text-[10px] text-indigo-600 font-mono-code font-bold">
                      {top2.xp} XP
                    </span>
                    <span className="text-[9px] text-slate-500 truncate max-w-[100px]">
                      {top2.institution}
                    </span>
                  </div>

                  {/* Podium Base */}
                  <div className="w-full h-28 sm:h-36 rounded-t-2xl bg-gradient-to-t from-slate-200 to-slate-100 border-t-2 border-x-2 border-slate-300 flex flex-col items-center justify-center p-2 shadow-md">
                    <span className="text-2xl sm:text-4xl font-black font-cyber text-slate-400">
                      2
                    </span>
                    <span className="text-[10px] text-slate-600 font-mono-code uppercase font-semibold">
                      Runner-Up
                    </span>
                  </div>
                </div>
              )}

              {/* 1st Place: Gold 🥇 */}
              {top1 && (
                <div className="flex-1 flex flex-col items-center -mt-6">
                  <div className="relative mb-2 flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-1 animate-bounce">
                      <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500 fill-amber-500" />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-amber-400 blur-md opacity-30 animate-pulse" />
                      <img
                        src={top1.avatar}
                        alt={top1.name}
                        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-amber-400 shadow-lg shadow-amber-300/50"
                      />
                      <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-black text-[11px] font-mono-code shadow-md">
                        #1 Gold 🥇
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-base font-extrabold text-amber-900 mt-4 text-center truncate max-w-[120px] sm:max-w-[160px]">
                      {top1.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-amber-700 font-mono-code font-black">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{top1.xp} XP</span>
                    </div>
                    <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                      {top1.institution}
                    </span>
                  </div>

                  {/* Podium Base */}
                  <div className="w-full h-36 sm:h-48 rounded-t-2xl bg-gradient-to-t from-amber-200 via-amber-100 to-amber-50 border-t-2 border-x-2 border-amber-400 flex flex-col items-center justify-center p-2 shadow-lg">
                    <span className="text-3xl sm:text-5xl font-black font-cyber text-amber-500">
                      1
                    </span>
                    <span className="text-[10px] sm:text-xs text-amber-800 font-mono-code uppercase font-bold tracking-wider">
                      Champion
                    </span>
                  </div>
                </div>
              )}

              {/* 3rd Place: Bronze 🥉 */}
              {top3 && (
                <div className="flex-1 flex flex-col items-center">
                  <div className="relative mb-2 flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl mb-1 filter drop-shadow">🥉</span>
                    <div className="relative">
                      <img
                        src={top3.avatar}
                        alt={top3.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-amber-600 shadow-md shadow-amber-600/20"
                      />
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-700 text-white font-bold text-[10px] font-mono-code shadow-xs">
                        #3 Bronze
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-3 text-center truncate max-w-[110px] sm:max-w-[140px]">
                      {top3.name}
                    </h3>
                    <span className="text-[10px] text-indigo-600 font-mono-code font-bold">
                      {top3.xp} XP
                    </span>
                    <span className="text-[9px] text-slate-500 truncate max-w-[100px]">
                      {top3.institution}
                    </span>
                  </div>

                  {/* Podium Base */}
                  <div className="w-full h-24 sm:h-30 rounded-t-2xl bg-gradient-to-t from-amber-100 to-slate-100 border-t-2 border-x-2 border-amber-300 flex flex-col items-center justify-center p-2 shadow-md">
                    <span className="text-2xl sm:text-4xl font-black font-cyber text-amber-600">
                      3
                    </span>
                    <span className="text-[10px] text-amber-800 font-mono-code uppercase font-semibold">
                      Bronze
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Full Rankings Table */}
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 font-cyber flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Overall Leaderboard Standings</span>
              </h2>
              <span className="text-xs text-slate-500 font-mono-code">
                {combinedList.length} Registered Students
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {combinedList.map((student) => {
                const isMe = student.isCurrentUser;
                return (
                  <div
                    key={student.rank}
                    className={`px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 transition ${
                      isMe
                        ? 'bg-indigo-50/70 border-l-4 border-indigo-600'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-lg font-mono-code font-bold text-xs flex items-center justify-center shrink-0 ${
                          student.rank === 1
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : student.rank === 2
                            ? 'bg-slate-200 text-slate-800'
                            : student.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {student.rank}
                      </span>

                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {student.name}
                          </h4>
                          {isMe && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-600 text-white font-bold shrink-0 font-mono-code">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-mono-code">{student.studentId}</span>
                          <span>•</span>
                          <span className="truncate">{student.institution}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 text-right">
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-indigo-600 font-mono-code block">
                          {student.xp} XP
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Level {student.level}
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center gap-1 text-xs text-amber-500">
                        <Award className="w-3.5 h-3.5" />
                        <span>{student.badgesCount}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Achievement Badges Grid */
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-cyber">
                Achievement Badges
              </h2>
              <p className="text-xs text-slate-500">
                Exclusive milestone badges proving your mastery in Java programming
              </p>
            </div>
            <span className="text-xs text-indigo-600 font-mono-code font-bold">
              {user.badges.length} / {ALL_BADGES.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ALL_BADGES.map((badge) => {
              const isUnlocked = user.badges.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                    isUnlocked
                      ? 'bg-white border-indigo-200 shadow-xs ring-1 ring-indigo-50'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  {isUnlocked && (
                    <div className="absolute top-2.5 right-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                  )}

                  <div>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-xs ${
                        isUnlocked
                          ? `bg-gradient-to-tr ${badge.color} text-slate-950`
                          : 'bg-slate-100 border border-slate-200 text-slate-400'
                      }`}
                    >
                      {isUnlocked ? (
                        renderBadgeIcon(badge.icon, 'w-6 h-6')
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 font-cyber flex items-center gap-1.5">
                      {badge.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-mono-code block">
                      Requirement:
                    </span>
                    <span className="text-[11px] text-indigo-700 font-semibold">
                      {badge.reqText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
