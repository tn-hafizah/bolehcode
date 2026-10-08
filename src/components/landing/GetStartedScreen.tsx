import React from 'react';
import { 
  Code2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Gamepad2
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface GetStartedScreenProps {
  onGetStarted: () => void;
  onQuickLoginAdmin: () => void;
  onQuickLoginStudent: () => void;
}

export const GetStartedScreen: React.FC<GetStartedScreenProps> = ({
  onGetStarted,
  onQuickLoginAdmin,
  onQuickLoginStudent,
}) => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-8 px-4 relative z-10 max-w-5xl mx-auto">
      {/* Top University & Platform Badge */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6 animate-fade-in">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium backdrop-blur-sm">
          <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
          UniSZA &bull; Faculty of Informatics & Computing
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-medium backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          Java Programming & Problem Solving Platform
        </span>
      </div>

      {/* Main Hero Card */}
      <div className="w-full bg-[#0a1020]/90 border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl relative overflow-hidden text-center">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Icon & Title */}
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 p-[2px] shadow-lg shadow-cyan-500/30 mb-6">
          <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
            <Code2 className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 animate-pulse" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
          Welcome to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-pink-400 font-cyber">
            BolehCode
          </span>
        </h1>

        <p className="text-amber-300 font-medium text-base sm:text-xl mb-4 tracking-wide font-sans">
          &ldquo;Slow-slow, Lama-lama Pro&rdquo;
        </p>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
          Interactive learning platform designed for Computer Science students to master Java programming 
          step-by-step — featuring Dr. Tuan&apos;s lecture videos, past exam questions archive, automated quizzes, and arcade mini-games.
        </p>

        {/* Main Call-to-Action: Get Started Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-8">
          <button
            onClick={() => {
              sound.playClick();
              onGetStarted();
            }}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-600 hover:from-cyan-400 hover:to-pink-500 text-white font-bold text-base shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onGetStarted();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white font-semibold text-sm transition-all cursor-pointer"
          >
            {/* Google G logo */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google Sign-In</span>
          </button>
        </div>

        {/* Quick Demo Logins for Fast Access */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-slate-400">
          <span className="font-medium text-slate-500">Instant Demo Access:</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onQuickLoginStudent();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 text-cyan-300 font-semibold transition cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Continue as Student</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onQuickLoginAdmin();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-950/60 hover:bg-pink-900/60 border border-pink-800/60 text-pink-300 font-semibold transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
              <span>Continue as Admin (Dr. Norhafizah)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
        <div className="bg-[#0b1325]/70 border border-slate-800 rounded-2xl p-4 text-left hover:border-cyan-500/40 transition">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-2">
            <BookOpen className="w-4 h-4" />
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-white mb-1">8 Java Modules</h2>
          <p className="text-[11px] text-slate-400 leading-snug">Dr. Tuan & YouTube videos, concept summaries, and live syntax code.</p>
        </div>

        <div className="bg-[#0b1325]/70 border border-slate-800 rounded-2xl p-4 text-left hover:border-amber-500/40 transition">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2">
            <FileText className="w-4 h-4" />
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-white mb-1">Past Year Exam Bank</h2>
          <p className="text-[11px] text-slate-400 leading-snug">Find past year questions here.</p>
        </div>

        <div className="bg-[#0b1325]/70 border border-slate-800 rounded-2xl p-4 text-left hover:border-purple-500/40 transition">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-2">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-white mb-1">Interactive Quizzes</h2>
          <p className="text-[11px] text-slate-400 leading-snug">Answer questions to sharpen your knowledges.</p>
        </div>

        <div className="bg-[#0b1325]/70 border border-slate-800 rounded-2xl p-4 text-left hover:border-pink-500/40 transition">
          <div className="w-8 h-8 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-2">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-white mb-1">Java Arcade</h2>
          <p className="text-[11px] text-slate-400 leading-snug">8 fun mini-games to sharpen algorithm logic and programming syntax.</p>
        </div>
      </div>
    </div>
  );
};
