import { LeaderboardUser, AchievementBadge } from '../types';

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'Ahmad Daniel Harith',
    studentId: 'CS20240188',
    institution: 'UniSZA (Faculty of Informatics & Computing)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    xp: 3850,
    level: 18,
    badgesCount: 8
  },
  {
    rank: 2,
    name: 'Nur Aisyah Humaira',
    studentId: 'CS20240214',
    institution: 'UniSZA (Faculty of Informatics & Computing)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    xp: 3420,
    level: 16,
    badgesCount: 7
  },
  {
    rank: 3,
    name: 'Muhammad Farhan',
    studentId: 'CS20240092',
    institution: 'UiTM Shah Alam',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    xp: 3180,
    level: 15,
    badgesCount: 6
  },
  {
    rank: 4,
    name: 'Sarah Jenkins',
    studentId: 'CS20240305',
    institution: 'UTM Skudai',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    xp: 2950,
    level: 14,
    badgesCount: 6
  },
  {
    rank: 5,
    name: 'Khairul Anuar',
    studentId: 'CS20240112',
    institution: 'Perak Matriculation College',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    xp: 2640,
    level: 12,
    badgesCount: 5
  },
  {
    rank: 6,
    name: 'Tan Wei Ming',
    studentId: 'CS20240401',
    institution: 'UKM Bangi',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    xp: 2410,
    level: 11,
    badgesCount: 5
  },
  {
    rank: 7,
    name: 'Amira Batrisyia',
    studentId: 'CS20240177',
    institution: 'UniSZA (Faculty of Informatics & Computing)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    xp: 2190,
    level: 10,
    badgesCount: 4
  }
];

export const ALL_BADGES: AchievementBadge[] = [
  {
    id: 'badge-master',
    title: 'Java Master',
    description: 'Achieve an 80%+ quiz score and master fundamental Java syntax.',
    icon: 'Coffee',
    color: 'from-amber-400 to-orange-500',
    unlocked: false,
    reqText: 'Score 80%+ in Interactive Quiz'
  },
  {
    id: 'badge-bughunter',
    title: 'Bug Hunter',
    description: 'Answer 5 consecutive quiz questions correctly without any mistakes.',
    icon: 'ShieldCheck',
    color: 'from-emerald-400 to-cyan-500',
    unlocked: false,
    reqText: '5 consecutive correct quiz answers'
  },
  {
    id: 'badge-loopninja',
    title: 'Loop Ninja',
    description: 'Master for/while loop iteration control with a 100+ score in Loop Runner.',
    icon: 'Repeat',
    color: 'from-purple-400 to-pink-500',
    unlocked: false,
    reqText: 'Reach 100+ score in Loop Runner mini-game'
  },
  {
    id: 'badge-array',
    title: 'Array Specialist',
    description: 'Target 2D array matrix coordinates accurately in Array 2D Shooter.',
    icon: 'Grid',
    color: 'from-cyan-400 to-blue-500',
    unlocked: false,
    reqText: 'Reach 50+ score in Array 2D Shooter'
  },
  {
    id: 'badge-speed',
    title: 'Speed Coder',
    description: 'Assemble algorithm flowchart blocks with zero logical defects.',
    icon: 'Zap',
    color: 'from-yellow-400 to-amber-600',
    unlocked: false,
    reqText: 'Complete Flowchart Connector with no errors'
  },
  {
    id: 'badge-problemsolver',
    title: 'Problem Solver',
    description: "Watch Dr. Tuan's lecture modules and master structured problem solving.",
    icon: 'Brain',
    color: 'from-rose-400 to-red-500',
    unlocked: false,
    reqText: "Open & watch Dr. Tuan's Topic 1 & 2 lectures"
  },
  {
    id: 'badge-oop',
    title: 'OOP Guru',
    description: 'Assemble Swing GUI layouts and execute recursion call frames successfully.',
    icon: 'Code',
    color: 'from-indigo-400 to-purple-600',
    unlocked: false,
    reqText: 'Master GUI Builder & Recursion Stack'
  },
  {
    id: 'badge-stream',
    title: 'Stream Hacker',
    description: 'Catch streaming text packets and avoid IOException crashes in File Stream Catch.',
    icon: 'FileCode',
    color: 'from-teal-400 to-emerald-600',
    unlocked: false,
    reqText: 'Catch 12 valid file packets in File Stream Catch'
  }
];
