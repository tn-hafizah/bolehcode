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
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0c1424] via-[#090f1d] to-[#1a0e28] border border-cyan-500/30 p-5 md:p-7 shadow-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono-code font-semibold mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Scoring System &amp; Student Standings</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-cyber tracking-tight">
              Champions Podium &amp; Badges
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl">
              Earn XP points by watching lecture modules, tackling quizzes, and winning mini-games to claim the top spot on BolehCode!
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => { sound.playClick(); setActiveTab('podium'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'podium'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Standings Podium</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveTab('badges'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'badges'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
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
          {/* Cyberpunk Top 3 Podium */}
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
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-slate-300 shadow-lg shadow-slate-400/20"
                      />
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-300 text-slate-950 font-bold text-[10px] font-mono-code shadow">
                        #2 Silver
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white mt-3 text-center truncate max-w-[110px] sm:max-w-[140px]">
                      {top2.name}
                    </h3>
                    <span className="text-[10px] text-cyan-300 font-mono-code font-bold">
                      {top2.xp} XP
                    </span>
                    <span className="text-[9px] text-slate-400 truncate max-w-[100px]">
                      {top2.institution}
                    </span>
                  </div>

                  {/* Podium Base */}
                  <div className="w-full h-28 sm:h-36 rounded-t-2xl bg-gradient-to-t from-slate-900 to-slate-800 border-t-2 border-x-2 border-slate-400/40 flex flex-col items-center justify-center p-2 shadow-xl">
                    <span className="text-2xl sm:text-4xl font-black font-cyber text-slate-300 opacity-60">
                      2
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono-code uppercase font-semibold">
                      Runner-Up
                    </span>
                  </div>
                </div>
              )}

              {/* 1st Place: Gold 🥇 (Tinggi di Tengah) */}
              {top1 && (
                <div className="flex-1 flex flex-col items-center -mt-6">
                  <div className="relative mb-2 flex flex-col items-center">
                    <div className="flex items-center gap-1 mb-1 animate-bounce">
                      <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 fill-amber-400" />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-amber-400 blur-md opacity-40 animate-pulse" />
                      <img
                        src={top1.avatar}
                        alt={top1.name}
                        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-amber-400 shadow-2xl shadow-amber-400/40"
                      />
                      <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] font-mono-code shadow-lg">
                        #1 Gold 🥇
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-base font-extrabold text-amber-300 mt-4 text-center truncate max-w-[120px] sm:max-w-[160px]">
                      {top1.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-mono-code font-black">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{top1.xp} XP</span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                      {top1.institution}
                    </span>
                  </div>

                  {/* Podium Base */}
                  <div className="w-full h-36 sm:h-48 rounded-t-2xl bg-gradient-to-t from-amber-950/60 via-slate-900 to-amber-900/40 border-t-2 border-x-2 border-amber-400/60 flex flex-col items-center justify-center p-2 shadow-2xl glow-amber">
                    <span className="text-3xl sm:text-5xl font-black font-cyber text-amber-400 opacity-80">
                      1
                    </span>
                    <span className="text-[10px] sm:text-xs text-amber-300 font-mono-code uppercase font-bold tracking-wider">
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
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-amber-700 shadow-lg shadow-amber-800/20"
                      />
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-700 text-white font-bold text-[10px] font-mono-code shadow">
                        #3 Bronze
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white mt-3 text-center truncate max-w-[110px] sm:max-w-[140px]">
                      {top3.name}
                    </h3>
                    <span className="text-[10px] text-cyan-300 font-mono-code font-bold">
                      {top3.xp} XP
                    </span>
                    <span className="text-[9px] text-slate-400 truncate max-w-[100px]">
                      {top3.institution}
                    </span>
                  </div>

                  {/* Podium Base */}
                  <div className="w-full h-24 sm:h-30 rounded-t-2xl bg-gradient-to-t from-slate-900 to-[#1e130d] border-t-2 border-x-2 border-amber-700/50 flex flex-col items-center justify-center p-2 shadow-xl">
                    <span className="text-2xl sm:text-4xl font-black font-cyber text-amber-700 opacity-70">
                      3
                    </span>
                    <span className="text-[10px] text-amber-600 font-mono-code uppercase font-semibold">
                      Bronze
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Full Rankings Table */}
          <div className="rounded-2xl bg-[#0a0f1d] border border-slate-800 overflow-hidden shadow-xl">
            <div className="px-5 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white font-cyber flex items-center gap-2">
                <Trophy className="w-4 h-4 text-cyan-400" />
                <span>Overall Leaderboard Standings</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono-code">
                {combinedList.length} Registered Students
              </span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {combinedList.map((student) => {
                const isMe = student.isCurrentUser;
                return (
                  <div
                    key={student.rank}
                    className={`px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 transition ${
                      isMe
                        ? 'bg-cyan-500/15 border-l-4 border-cyan-400'
                        : 'hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-lg font-mono-code font-bold text-xs flex items-center justify-center shrink-0 ${
                          student.rank === 1
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : student.rank === 2
                            ? 'bg-slate-300 text-slate-950'
                            : student.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {student.rank}
                      </span>

                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-700 shrink-0"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                            {student.name}
                          </h4>
                          {isMe && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500 text-slate-950 font-bold shrink-0 font-mono-code">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="font-mono-code">{student.studentId}</span>
                          <span>•</span>
                          <span className="truncate">{student.institution}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 text-right">
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-cyan-400 font-mono-code block">
                          {student.xp} XP
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Level {student.level}
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center gap-1 text-xs text-amber-400">
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
              <h2 className="text-base font-bold text-white font-cyber">
                Achievement Badges
              </h2>
              <p className="text-xs text-slate-400">
                Exclusive milestone badges proving your mastery in Java programming
              </p>
            </div>
            <span className="text-xs text-cyan-400 font-mono-code font-bold">
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
                      ? 'bg-gradient-to-br from-[#0c1424] to-[#121028] border-cyan-500/40 shadow-lg glow-cyan'
                      : 'bg-slate-950/60 border-slate-800 opacity-60'
                  }`}
                >
                  {isUnlocked && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}

                  <div>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-md ${
                        isUnlocked
                          ? `bg-gradient-to-tr ${badge.color} text-slate-950`
                          : 'bg-slate-900 border border-slate-800 text-slate-600'
                      }`}
                    >
                      {isUnlocked ? (
                        renderBadgeIcon(badge.icon, 'w-6 h-6')
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white font-cyber flex items-center gap-1.5">
                      {badge.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-400 font-mono-code block">
                      Requirement:
                    </span>
                    <span className="text-[11px] text-amber-300 font-medium">
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
