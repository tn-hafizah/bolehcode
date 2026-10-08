import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../../data/quizData';
import { UserProfile } from '../../types';
import { 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Award, 
  Code2, 
  Check, 
  BrainCircuit, 
  Filter 
} from 'lucide-react';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { recordQuizSubmission } from '../../firebase/studentService';

interface QuizTabProps {
  user: UserProfile;
  onAwardXP: (xp: number, badgeId?: string) => void;
}

export const QuizTab: React.FC<QuizTabProps> = ({ user, onAwardXP }) => {
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<number | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answersHistory, setAnswersHistory] = useState<
    { questionId: number; isCorrect: boolean; selected: number }[]
  >([]);

  // Filtered questions
  const filteredQuestions = selectedTopicFilter === 'all'
    ? QUIZ_QUESTIONS
    : QUIZ_QUESTIONS.filter((q) => q.topicId === selectedTopicFilter);

  const currentQuestion = filteredQuestions[currentIndex];

  const handleSelectAnswer = (index: number) => {
    if (isAnswerSubmitted || quizFinished) return;
    setSelectedAnswerIndex(index);
    setIsAnswerSubmitted(true);

    const isCorrect = index === currentQuestion.correctAnswerIndex;

    if (isCorrect) {
      sound.playCorrect();
      setScore((prev) => prev + 1);
      const newConsecutive = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsecutive);
      
      // Award XP
      const xpEarned = 30 + (newConsecutive > 2 ? 15 : 0);
      onAwardXP(xpEarned, newConsecutive >= 5 ? 'badge-bughunter' : undefined);
    } else {
      sound.playWrong();
      setConsecutiveCorrect(0);
    }

    setAnswersHistory((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        isCorrect,
        selected: index,
      },
    ]);
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswerIndex(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      sound.playWin();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Check for Java Master badge
      const accuracy = Math.round((score / filteredQuestions.length) * 100);
      if (accuracy >= 80) {
        onAwardXP(100, 'badge-master');
      }

      // Record to Firestore for Admin Dashboard analytics (users and results collections)
      const studentIdentifier = user.uid || `stud-${user.studentId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'guest'}`;
      const submissionDate = new Date().toISOString();
      recordQuizSubmission({
        studentUid: studentIdentifier,
        userId: studentIdentifier,
        studentName: user.name,
        name: user.name,
        studentEmail: user.email,
        email: user.email,
        studentMatricId: user.studentId,
        matricId: user.studentId,
        topicId: String(selectedTopicFilter),
        score: score,
        totalQuestions: filteredQuestions.length,
        percentage: accuracy,
        moduleProgress: user.completedTopics?.length || 0,
        date: submissionDate,
        submittedAt: submissionDate,
      }).catch((err) => console.warn('Quiz submission record failed:', err));
    }
  };

  const handleRestartQuiz = () => {
    sound.playClick();
    setCurrentIndex(0);
    setSelectedAnswerIndex(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setConsecutiveCorrect(0);
    setQuizFinished(false);
    setAnswersHistory([]);
  };

  const handleFilterChange = (topicId: number | 'all') => {
    sound.playClick();
    setSelectedTopicFilter(topicId);
    setCurrentIndex(0);
    setSelectedAnswerIndex(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setConsecutiveCorrect(0);
    setQuizFinished(false);
    setAnswersHistory([]);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Quiz Header & Stats */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0e1424] via-[#0a0f1d] to-[#170e28] border border-cyan-500/30 p-5 md:p-7 shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono-code font-semibold mb-2">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interactive Quiz with Instant Feedback</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-cyber tracking-tight">
              Java &amp; Problem Solving Challenge
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl">
              Test theoretical concepts, Java code tracing, and algorithmic logic with instant explanations for every question.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-center px-3 border-r border-slate-800">
              <span className="text-[10px] text-slate-400 block">Session Score</span>
              <span className="text-base font-bold text-cyan-400 font-mono-code">
                {score} / {filteredQuestions.length}
              </span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] text-slate-400 block">Streak</span>
              <span className="text-base font-bold text-amber-400 font-mono-code">
                🔥 {consecutiveCorrect}
              </span>
            </div>
          </div>
        </div>

        {/* Topic Filter Chips */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3 h-3 text-cyan-400" />
            Topics:
          </span>
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedTopicFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            All Topics ({QUIZ_QUESTIONS.length})
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((tId) => {
            const count = QUIZ_QUESTIONS.filter((q) => q.topicId === tId).length;
            if (count === 0) return null;
            return (
              <button
                key={tId}
                onClick={() => handleFilterChange(tId)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedTopicFilter === tId
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Topic {tId} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card or Finished Results Card */}
      {!quizFinished && currentQuestion ? (
        <div className="rounded-2xl bg-[#0a0f1d] border border-cyan-500/30 p-5 md:p-8 shadow-2xl relative space-y-6">
          {/* Progress bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono-code">
            <span className="text-cyan-400 font-bold">
              Question {currentIndex + 1} of {filteredQuestions.length}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
              Difficulty: {currentQuestion.difficulty}
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-cyan-400 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
              {currentQuestion.topicTitle}
            </span>
            <h2 className="text-base md:text-xl font-bold text-white leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Optional Code Snippet */}
            {currentQuestion.codeSnippet && (
              <div className="rounded-xl bg-[#05070e] border border-slate-800 p-3.5 my-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono-code mb-2">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Java Source Code:</span>
                </div>
                <pre className="text-xs md:text-sm font-mono-code text-cyan-300 overflow-x-auto leading-relaxed">
                  <code>{currentQuestion.codeSnippet}</code>
                </pre>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswerIndex === idx;
              const isCorrectAnswer = idx === currentQuestion.correctAnswerIndex;

              let optionStyle = 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200';
              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/10';
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle = 'bg-red-950/60 border-red-500 text-red-200';
                } else {
                  optionStyle = 'bg-slate-950/40 border-slate-800/50 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${optionStyle} ${
                    !isAnswerSubmitted ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <span className="w-6 h-6 rounded-lg bg-slate-800/80 text-cyan-400 font-mono-code font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-700">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs md:text-sm leading-relaxed">{option}</span>
                  </div>

                  {isAnswerSubmitted && isCorrectAnswer && (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Instant Feedback Panel */}
          {isAnswerSubmitted && (
            <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0c1424] border border-cyan-500/40 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                {selectedAnswerIndex === currentQuestion.correctAnswerIndex ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-400 font-cyber">
                      Spot On! (+30 XP)
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-sm font-bold text-red-400 font-cyber">
                      Incorrect — Correct Answer: {String.fromCharCode(65 + currentQuestion.correctAnswerIndex)}
                    </span>
                  </>
                )}
              </div>

              <div className="text-xs md:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
                <span className="text-cyan-400 font-semibold block mb-1">
                  💡 Detailed Explanation &amp; Logic Analysis:
                </span>
                <p>{currentQuestion.explanation}</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs md:text-sm shadow-lg shadow-cyan-500/20 transition transform active:scale-95"
                >
                  <span>
                    {currentIndex + 1 < filteredQuestions.length
                      ? 'Next Question'
                      : 'View Quiz Results'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Completed Screen */
        <div className="rounded-3xl bg-[#0a0f1d] border border-cyan-500/40 p-6 md:p-10 text-center space-y-6 shadow-2xl glow-cyan animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono-code font-bold">
              Congratulations! Quiz Completed
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white font-cyber">
              Your Java Performance Results
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto">
              Slow-slow, lama-lama pro! Every mistake is a stepping stone to becoming a Java programming master.
            </p>
          </div>

          {/* Score Circle Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-sm mx-auto flex items-center justify-around">
            <div>
              <span className="text-xs text-slate-400 block">Total Score</span>
              <span className="text-3xl font-black text-white font-mono-code">
                {score} / {filteredQuestions.length}
              </span>
            </div>
            <div className="h-10 w-px bg-slate-800" />
            <div>
              <span className="text-xs text-slate-400 block">Accuracy</span>
              <span className="text-3xl font-black text-cyan-400 font-mono-code">
                {Math.round((score / filteredQuestions.length) * 100)}%
              </span>
            </div>
          </div>

          {/* Quick Review of Answers */}
          <div className="max-w-md mx-auto text-left space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-400 font-cyber">Questions Summary:</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {answersHistory.map((h, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-1 rounded-lg text-xs font-mono-code font-bold flex items-center gap-1 ${
                    h.isCorrect
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                      : 'bg-red-950/80 text-red-400 border border-red-500/40'
                  }`}
                >
                  <span>Q{idx + 1}</span>
                  {h.isCorrect ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={handleRestartQuiz}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs md:text-sm shadow-xl transition transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
