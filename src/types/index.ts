export type TabType = 'modules' | 'pastyear' | 'quiz' | 'leaderboard' | 'games';

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
  name: string;
  email: string;
  studentId: string;
  institution: string;
  avatar: string;
  xp: number;
  level: number;
  streakDays: number;
  completedTopics: number[];
  completedVideos: string[];
  badges: string[];
  quizScores: Record<number, number>;
  gameHighScores: Record<string, number>;
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
