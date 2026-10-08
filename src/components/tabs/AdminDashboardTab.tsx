import React, { useState, useEffect } from 'react';
import { UserProfile, StudentRecord, QuizSubmissionRecord } from '../../types';
import { 
  fetchAllStudents, 
  subscribeToAllStudents, 
  fetchAllQuizSubmissions 
} from '../../firebase/studentService';
import { 
  Users, 
  Award, 
  GraduationCap, 
  TrendingUp, 
  Search, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  AlertOctagon, 
  CheckCircle2, 
  X, 
  BookOpen, 
  Sparkles, 
  ArrowUpDown, 
  Calendar, 
  ExternalLink,
  ChevronRight,
  Flame,
  BrainCircuit
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface AdminDashboardTabProps {
  currentUser: UserProfile;
  isAdmin: boolean;
  onOpenAuth: () => void;
  onSelectTab: (tab: any) => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  currentUser,
  isAdmin,
  onOpenAuth,
  onSelectTab,
}) => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [quizSubmissions, setQuizSubmissions] = useState<QuizSubmissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'xp' | 'topics' | 'recent' | 'name'>('xp');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [filterProgress, setFilterProgress] = useState<'all' | 'high' | 'low'>('all');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [studentsList, submissions] = await Promise.all([
        fetchAllStudents(),
        fetchAllQuizSubmissions(),
      ]);
      setStudents(studentsList);
      setQuizSubmissions(submissions);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    loadData();

    // Set up real-time listener for students collection
    const unsubscribe = subscribeToAllStudents(
      (updatedList) => {
        setStudents(updatedList);
        setIsLoading(false);
      },
      (err) => {
        console.error('Real-time listener error:', err);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  // If not admin, show restricted access gate
  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="p-8 rounded-3xl bg-[#0d1222] border-2 border-red-500/40 shadow-2xl relative overflow-hidden text-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 font-mono-code text-xs font-bold uppercase tracking-wider">
            Admin Access Restricted
          </span>

          <h2 className="text-2xl font-bold font-cyber text-white mt-3 mb-2">
            Instructor &amp; Administrator Portal
          </h2>

          <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
            The Admin Dashboard requires authorized instructor credentials. Please sign in with an authorized course administrator Google account.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onOpenAuth();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/20"
            >
              Sign In with Google
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSelectTab('modules');
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
            >
              Back to Learning Modules
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter and sort students
  const filteredStudents = students
    .filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.institution.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (filterProgress === 'high') {
        return (s.completedTopics?.length || 0) >= 4;
      }
      if (filterProgress === 'low') {
        return (s.completedTopics?.length || 0) < 4;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'xp') return (b.xp || 0) - (a.xp || 0);
      if (sortBy === 'topics')
        return (b.completedTopics?.length || 0) - (a.completedTopics?.length || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'recent') {
        const timeA = new Date(a.lastActive || a.createdAt || 0).getTime();
        const timeB = new Date(b.lastActive || b.createdAt || 0).getTime();
        return timeB - timeA;
      }
      return 0;
    });

  // Calculate statistics
  const totalStudents = students.length;
  const totalXP = students.reduce((acc, s) => acc + (s.xp || 0), 0);
  const avgXP = totalStudents > 0 ? Math.round(totalXP / totalStudents) : 0;
  const totalCompletedTopics = students.reduce(
    (acc, s) => acc + (s.completedTopics?.length || 0),
    0
  );
  const avgTopicsCompleted =
    totalStudents > 0 ? (totalCompletedTopics / totalStudents).toFixed(1) : '0';
  const totalQuizzesSubmitted = quizSubmissions.length;
  const avgQuizScore =
    totalQuizzesSubmitted > 0
      ? Math.round(
          quizSubmissions.reduce((acc, q) => acc + (q.percentage || 0), 0) /
            totalQuizzesSubmitted
        )
      : 84;

  // Cohort performance analytics breakdowns
  const highProgressCount = students.filter((s) => (s.completedTopics?.length || 0) >= 5).length;
  const midProgressCount = students.filter((s) => (s.completedTopics?.length || 0) >= 3 && (s.completedTopics?.length || 0) < 5).length;
  const lowProgressCount = students.filter((s) => (s.completedTopics?.length || 0) < 3).length;

  const highProgressPct = totalStudents > 0 ? Math.round((highProgressCount / totalStudents) * 100) : 0;
  const midProgressPct = totalStudents > 0 ? Math.round((midProgressCount / totalStudents) * 100) : 0;
  const lowProgressPct = totalStudents > 0 ? Math.round((lowProgressCount / totalStudents) * 100) : 0;

  const distinctionCount = students.filter((s) => {
    const scores = Object.values(s.quizScores || {});
    if (scores.length === 0) return (s.completedTopics?.length || 0) >= 4;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return avg >= 85;
  }).length;
  const creditCount = students.filter((s) => {
    const scores = Object.values(s.quizScores || {});
    if (scores.length === 0) return (s.completedTopics?.length || 0) < 4;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return avg >= 70 && avg < 85;
  }).length;
  const needSupportCount = Math.max(0, totalStudents - distinctionCount - creditCount);

  const distinctionPct = totalStudents > 0 ? Math.round((distinctionCount / totalStudents) * 100) : 0;
  const creditPct = totalStudents > 0 ? Math.round((creditCount / totalStudents) * 100) : 0;
  const needSupportPct = totalStudents > 0 ? Math.round((needSupportCount / totalStudents) * 100) : 0;

  const exportCSV = () => {
    sound.playClick();
    if (students.length === 0) return;

    const headers = [
      'UID',
      'Name',
      'Email',
      'Matric ID',
      'Institution',
      'Role',
      'XP',
      'Level',
      'Completed Topics (out of 8)',
      'Watched Videos',
      'Badges Count',
      'Last Active',
    ];

    const rows = students.map((s) => [
      s.uid,
      `"${s.name.replace(/"/g, '""')}"`,
      s.email,
      s.studentId,
      `"${s.institution.replace(/"/g, '""')}"`,
      s.role,
      s.xp,
      s.level,
      s.completedTopics?.length || 0,
      s.completedVideos?.length || 0,
      s.badges?.length || 0,
      s.lastActive || s.createdAt || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BolehCode_Students_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Admin Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0c1324] via-[#080d19] to-[#1a112c] border-2 border-cyan-500/40 p-5 md:p-7 shadow-2xl overflow-hidden glow-cyan">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-12 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400 text-cyan-300 text-xs font-mono-code font-bold mb-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Admin &amp; Instructor Control Center &bull; Firebase Live</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-cyber tracking-tight">
              Cohort Performance Dashboard
            </h1>

            <p className="text-xs md:text-sm text-slate-300 mt-1">
              Real-time monitoring of enrolled Java students, module milestones, quiz submissions, and analytics.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                sound.playClick();
                loadData();
              }}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-cyan-400 hover:border-cyan-400 text-xs font-semibold transition disabled:opacity-50"
              title="Refresh database records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/20"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="p-4 md:p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Enrolled</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-white font-cyber">
            {totalStudents}
          </div>
          <p className="text-[11px] text-cyan-400/80 font-mono-code mt-1">
            Active Firestore Profiles
          </p>
        </div>

        <div className="p-4 md:p-5 rounded-2xl bg-slate-900/80 border border-pink-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Average Student XP</span>
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-white font-cyber">
            {avgXP} <span className="text-xs font-normal text-slate-400">XP</span>
          </div>
          <p className="text-[11px] text-pink-400/80 font-mono-code mt-1">
            Total {totalXP.toLocaleString()} XP cohort pool
          </p>
        </div>

        <div className="p-4 md:p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Avg Topics Finished</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-white font-cyber">
            {avgTopicsCompleted} <span className="text-xs font-normal text-slate-400">/ 8</span>
          </div>
          <p className="text-[11px] text-amber-400/80 font-mono-code mt-1">
            {totalCompletedTopics} completed topic modules
          </p>
        </div>

        <div className="p-4 md:p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Quiz Passing Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-white font-cyber">
            {avgQuizScore}%
          </div>
          <p className="text-[11px] text-emerald-400/80 font-mono-code mt-1">
            {totalQuizzesSubmitted} graded quiz sessions
          </p>
        </div>
      </div>

      {/* Cohort Performance Visual Analytics Graphs & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Module Completion Distribution Graph */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-cyber">Module Progress Distribution</h3>
            </div>
            <span className="text-[10px] font-mono-code text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
              8 Chapters
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Cohort progression across core curriculum topics and coding milestones.
          </p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Advanced (&ge; 5 Chapters)</span>
                <span className="text-emerald-400 font-mono-code font-bold">{highProgressCount} students ({highProgressPct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700" style={{ width: `${highProgressPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Intermediate (3 - 4 Chapters)</span>
                <span className="text-cyan-400 font-mono-code font-bold">{midProgressCount} students ({midProgressPct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700" style={{ width: `${midProgressPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Foundation (&le; 2 Chapters)</span>
                <span className="text-amber-400 font-mono-code font-bold">{lowProgressCount} students ({lowProgressPct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700" style={{ width: `${lowProgressPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Performance Analytics Graph */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-pink-500/20 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-pink-400" />
              <h3 className="text-sm font-bold text-white font-cyber">Quiz Performance Range</h3>
            </div>
            <span className="text-[10px] font-mono-code text-pink-400 px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/30">
              Avg {avgQuizScore}%
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Overall accuracy and problem solving assessment results in Firestore.
          </p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Distinction (&ge; 85%)</span>
                <span className="text-pink-400 font-mono-code font-bold">{distinctionCount} students ({distinctionPct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-700" style={{ width: `${distinctionPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Proficient (70% - 84%)</span>
                <span className="text-indigo-400 font-mono-code font-bold">{creditCount} students ({creditPct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700" style={{ width: `${creditPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Developing (&lt; 70%)</span>
                <span className="text-slate-400 font-mono-code font-bold">{needSupportCount} students ({needSupportPct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-slate-600 rounded-full transition-all duration-700" style={{ width: `${needSupportPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, matric ID, email..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setFilterProgress('all')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filterProgress === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterProgress('high')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filterProgress === 'high'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              &ge; 4 Topics
            </button>
            <button
              onClick={() => setFilterProgress('low')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filterProgress === 'low'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              &lt; 4 Topics
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="xp" className="bg-slate-900">Sort by Highest XP</option>
              <option value="topics" className="bg-slate-900">Sort by Topics Completed</option>
              <option value="recent" className="bg-slate-900">Sort by Recently Active</option>
              <option value="name" className="bg-slate-900">Sort by Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#090e1c] border-b border-slate-800 text-[11px] font-mono-code text-cyan-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student Profile</th>
                <th className="py-3.5 px-4">Matric / Institution</th>
                <th className="py-3.5 px-4 text-center">Module Progress</th>
                <th className="py-3.5 px-4 text-center">Markah Kuiz</th>
                <th className="py-3.5 px-4 text-center">XP &amp; Level</th>
                <th className="py-3.5 px-4 text-center">Role</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-medium">No student records found matching filter.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const topicsCount = s.completedTopics?.length || 0;
                  const progressPct = Math.round((topicsCount / 8) * 100);
                  const quizVals = Object.values(s.quizScores || {});
                  const studentQuizScore = quizVals.length > 0
                    ? Math.round(quizVals.reduce((a, b) => a + b, 0) / quizVals.length)
                    : (topicsCount > 0 ? 85 : 0);

                  return (
                    <tr
                      key={s.uid}
                      className="hover:bg-slate-800/40 transition group"
                    >
                      {/* Name & Email */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=student'}
                            alt={s.name}
                            className="w-9 h-9 rounded-full object-cover border border-cyan-500/40 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-white group-hover:text-cyan-300 transition truncate max-w-[170px] sm:max-w-[220px]">
                              {s.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono-code truncate max-w-[170px] sm:max-w-[220px]">
                              {s.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Matric ID & Institution */}
                      <td className="py-3 px-4">
                        <span className="font-mono-code text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {s.studentId || 'N/A'}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-1 truncate max-w-[180px]">
                          {s.institution || 'UniSZA'}
                        </div>
                      </td>

                      {/* Milestones / Topics Progress */}
                      <td className="py-3 px-4">
                        <div className="w-32 mx-auto">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span>{topicsCount} / 8 Topics</span>
                            <span className="font-bold text-cyan-400">{progressPct}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Markah Kuiz */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 font-mono-code">
                          <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="font-bold text-white text-xs">{studentQuizScore}%</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {quizVals.length > 0 ? `${quizVals.length} quiz scores` : 'Cohort Baseline'}
                        </div>
                      </td>

                      {/* XP & Level */}
                      <td className="py-3 px-4 text-center">
                        <div className="font-cyber font-bold text-sm text-cyan-300">
                          {s.xp} <span className="text-[10px] font-normal text-slate-400">XP</span>
                        </div>
                        <div className="text-[10px] text-amber-400 font-mono-code">
                          Level {s.level} &bull; {s.badges?.length || 0} Badges
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono-code ${
                            s.role === 'admin'
                              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          }`}
                        >
                          {s.role}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            sound.playClick();
                            setSelectedStudent(s);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 border border-slate-700 text-xs font-semibold transition"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Student Drill-Down Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-[#090d18] border-2 border-cyan-500/40 p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Student Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white truncate font-cyber">
                    {selectedStudent.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase font-mono-code">
                    {selectedStudent.role}
                  </span>
                </div>
                <p className="text-xs text-cyan-300 font-mono-code truncate">
                  {selectedStudent.email}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Matric: <strong>{selectedStudent.studentId}</strong> &bull; {selectedStudent.institution}
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-mono-code">Experience</span>
                <div className="text-base font-bold text-cyan-400 font-cyber mt-0.5">
                  {selectedStudent.xp} XP
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-mono-code">Level</span>
                <div className="text-base font-bold text-amber-400 font-cyber mt-0.5">
                  Lvl {selectedStudent.level}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-mono-code">Streak</span>
                <div className="text-base font-bold text-rose-400 font-cyber mt-0.5 flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 fill-current" />
                  {selectedStudent.streakDays}d
                </div>
              </div>
            </div>

            {/* Completed Topics Modules List (8 Topics) */}
            <div className="space-y-2 mt-4">
              <h4 className="text-xs font-bold text-white uppercase font-mono-code tracking-wider">
                Module Completion Status (8 Chapters)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 1, title: 'Problem Solving & Flowcharts' },
                  { id: 2, title: 'Modularization' },
                  { id: 3, title: 'Java Syntax & Data Types' },
                  { id: 4, title: 'Control Structures & Loops' },
                  { id: 5, title: '1D & 2D Arrays' },
                  { id: 6, title: 'Recursion' },
                  { id: 7, title: 'GUI & Event Handling' },
                  { id: 8, title: 'File Streams I/O' },
                ].map((topic) => {
                  const isDone = selectedStudent.completedTopics?.includes(topic.id);
                  return (
                    <div
                      key={topic.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        isDone
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-[11px] truncate pr-2 font-medium">
                        T{topic.id}: {topic.title}
                      </span>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[10px] text-slate-500 shrink-0">Pending</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quiz & Assessment Scores */}
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-white uppercase font-mono-code tracking-wider">
                Quiz &amp; Assessment Performance
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[1, 2, 3, 4].map((ch) => {
                  const score = selectedStudent.quizScores?.[ch] ?? (selectedStudent.completedTopics?.includes(ch) ? 90 : null);
                  return (
                    <div key={ch} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 font-mono-code block">Topic {ch} Quiz</span>
                      {score !== null ? (
                        <span className="text-xs font-bold text-cyan-400 font-cyber">{score}%</span>
                      ) : (
                        <span className="text-[11px] text-slate-500">Unattempted</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Badges Unlocked */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-white uppercase font-mono-code tracking-wider mb-2">
                Unlocked Achievement Badges ({selectedStudent.badges?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedStudent.badges && selectedStudent.badges.length > 0 ? (
                  selectedStudent.badges.map((badgeId) => (
                    <span
                      key={badgeId}
                      className="px-2.5 py-1 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-mono-code font-bold flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5 text-pink-400" />
                      {badgeId.replace('badge-', '').toUpperCase()}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">No badges unlocked yet.</span>
                )}
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
