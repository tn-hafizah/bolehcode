export type TabType = 'hub' | 'modules' | 'pastyear' | 'quiz' | 'leaderboard' | 'games' | 'admin';

export interface VideoItem {
  id: string;
  title: string;
  url: string;
  youtubeId: string;
  type: 'lecture' | 'tutorial' | 'short';
  speaker?: 'Dr. Tuan' | 'YouTube';
  duration?: string;
  description?: string;
}

export interface TopicModule {
  id: number;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  color: string;
  drTuanVideos: VideoItem[];
  youtubeVideos: VideoItem[];
  keyConcepts: string[];
  codeSnippet?: {
    title: string;
    code: string;
  };
}

export interface QuizQuestion {
  id: number;
  topicId: number;
  topicTitle: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface UserProfile {
  uid?: string;
  name: string;
  email: string;
  studentId: string;
  institution: string;
  avatar: string;
  role: 'student' | 'admin';
  xp: number;
  level: number;
  streakDays: number;
  completedTopics: number[];
  completedVideos: string[];
  badges: string[];
  quizScores: Record<string | number, number>;
  gameHighScores: Record<string, number>;
  lastActive?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentRecord {
  uid: string;
  name: string;
  email: string;
  studentId: string;
  institution: string;
  avatar: string;
  role: 'student' | 'admin';
  xp: number;
  level: number;
  streakDays: number;
  completedTopics: number[];
  completedVideos: string[];
  badges: string[];
  quizScores: Record<string, number>;
  gameHighScores: Record<string, number>;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizSubmissionRecord {
  id: string;
  userId?: string;
  studentUid: string;
  name?: string;
  studentName: string;
  email?: string;
  studentEmail?: string;
  matricId?: string;
  studentMatricId?: string;
  topicId?: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  moduleProgress?: number;
  date?: string;
  submittedAt: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  studentId: string;
  institution: string;
  avatar: string;
  xp: number;
  level: number;
  badgesCount: number;
  isCurrentUser?: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  reqText: string;
}

export type GameId = 
  | 'flowchart'
  | 'modularization'
  | 'datatype'
  | 'looprunner'
  | 'array2d'
  | 'recursion'
  | 'guibuilder'
  | 'filestream';

export interface MiniGameMeta {
  id: GameId;
  topicNumber: number;
  title: string;
  subtitle: string;
  concept: string;
  icon: string;
  accentColor: string;
  instructions: string[];
}
