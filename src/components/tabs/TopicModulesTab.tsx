import React, { useState } from 'react';
import { VideoItem, UserProfile } from '../../types';
import { TOPICS_DATA } from '../../data/topicsData';
import { 
  Play, 
  CheckCircle, 
  CheckCircle2, 
  GraduationCap, 
  Youtube, 
  Search, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Code2, 
  BookMarked, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface TopicModulesTabProps {
  user: UserProfile;
  onOpenVideo: (video: VideoItem) => void;
  onToggleTopicComplete: (topicId: number) => void;
}

export const TopicModulesTab: React.FC<TopicModulesTabProps> = ({
  user,
  onOpenVideo,
  onToggleTopicComplete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(1);
  const [copiedTopicId, setCopiedTopicId] = useState<number | null>(null);

  // Filter topics
  const filteredTopics = TOPICS_DATA.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keyConcepts.some((c) => c.toLowerCase().includes(q))
    );
  });

  const totalVideosCount = TOPICS_DATA.reduce(
    (acc, t) => acc + t.drTuanVideos.length + t.youtubeVideos.length,
    0
  );
  const watchedVideosCount = user.completedVideos.length;
  const progressPercent = Math.min(
    100,
    Math.round(((user.completedTopics.length + watchedVideosCount * 0.5) / (8 + totalVideosCount * 0.5)) * 100)
  );

  const handleCopyCode = (topicId: number, code: string) => {
    sound.playClick();
    navigator.clipboard.writeText(code);
    setCopiedTopicId(topicId);
    setTimeout(() => setCopiedTopicId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Banner with Course Progress */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0c1427] via-[#09101f] to-[#120f26] border border-cyan-500/30 p-5 md:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono-code font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Computer Science Java Syllabus</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-cyber tracking-tight">
              Chapter Modules &amp; Lecture Collection
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Master all 8 core Java chapters from algorithmic flowchart logic to file streams. 
              Watch official <span className="text-amber-300 font-semibold">Dr. Tuan</span> lectures and curated visual YouTube tutorials.
            </p>
          </div>

          {/* Course Progress Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 md:w-72 shrink-0">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400">Learning Progress</span>
              <span className="text-cyan-400 font-mono-code font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800 mb-3">
              <div
                className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{user.completedTopics.length} / 8 Chapters Completed</span>
              <span>{watchedVideosCount} / {totalVideosCount} Videos Watched</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, concepts (e.g., loops, array, scanner, GUI, buffer)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="ml-2 text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Chapters Grid / Accordion */}
      <div className="space-y-4">
        {filteredTopics.map((topic) => {
          const isCompleted = user.completedTopics.includes(topic.id);
          const isExpanded = selectedTopicId === topic.id;

          return (
            <div
              key={topic.id}
              className={`rounded-2xl transition-all duration-300 border ${
                isExpanded
                  ? 'bg-[#0a0f1d] border-cyan-500/40 shadow-xl'
                  : 'bg-[#090d18]/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header Card / Clickable Accordion Row */}
              <div
                onClick={() => {
                  sound.playClick();
                  setSelectedTopicId(isExpanded ? null : topic.id);
                }}
                className="p-4 md:p-5 flex items-start sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-bold text-sm md:text-base font-cyber shrink-0 shadow-md ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    0{topic.id}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono-code">
                        Topic {topic.id}
                      </span>
                      {topic.drTuanVideos.length > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          Dr. Tuan Lecture
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/15 text-red-300 border border-red-500/30 font-semibold flex items-center gap-1">
                        <Youtube className="w-3 h-3" />
                        {topic.youtubeVideos.length} Tutorials &amp; Shorts
                      </span>
                    </div>

                    <h2 className="text-base md:text-lg font-bold text-white mt-1 truncate">
                      {topic.title}
                    </h2>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {topic.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playCoin();
                      onToggleTopicComplete(topic.id);
                    }}
                    className={`p-2 rounded-xl transition ${
                      isCompleted
                        ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                    }`}
                    title={isCompleted ? 'Topic Completed' : 'Mark Topic as Completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </button>

                  <div className="text-slate-400 hover:text-white p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Content Body */}
              {isExpanded && (
                <div className="px-4 md:px-6 pb-6 pt-2 border-t border-slate-800/80 space-y-6 animate-in slide-in-from-top-1">
                  
                  {/* Detailed Description & Key Concepts */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 space-y-3">
                      <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-cyber flex items-center gap-1.5">
                        <BookMarked className="w-3.5 h-3.5" />
                        Key Concepts &amp; Core Competencies:
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                        {topic.keyConcepts.map((concept, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                            <span>{concept}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Code Snippet Box */}
                    {topic.codeSnippet && (
                      <div className="bg-[#05070f] border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                          <span className="text-[11px] font-mono-code text-cyan-400 flex items-center gap-1">
                            <Code2 className="w-3.5 h-3.5" />
                            {topic.codeSnippet.title}
                          </span>
                          <button
                            onClick={() => handleCopyCode(topic.id, topic.codeSnippet!.code)}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                            title="Copy Code"
                          >
                            {copiedTopicId === topic.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <pre className="text-[11px] font-mono-code text-slate-300 overflow-x-auto p-1 leading-relaxed max-h-36">
                          <code>{topic.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Section 1: Dr. Tuan's Lecture Videos */}
                  {topic.drTuanVideos.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-amber-300 font-cyber">
                            Dr. Tuan&apos;s Lecture Videos
                          </h3>
                          <p className="text-[11px] text-slate-400">
                            Official lectures exploring structured problem solving &amp; Java logic
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {topic.drTuanVideos.map((video) => {
                          const isWatched = user.completedVideos.includes(video.id);
                          return (
                            <div
                              key={video.id}
                              className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/20 via-slate-900/60 to-slate-900/40 border border-amber-500/30 hover:border-amber-400/60 transition group flex flex-col justify-between"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono-code font-bold uppercase">
                                    Official Lecture
                                  </span>
                                  <h4 className="text-xs font-bold text-white mt-1 group-hover:text-amber-300 transition">
                                    {video.title}
                                  </h4>
                                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                                    {video.description}
                                  </p>
                                </div>
                                {isWatched && (
                                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                                )}
                              </div>

                              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800">
                                <button
                                  onClick={() => {
                                    sound.playClick();
                                    onOpenVideo(video);
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-md"
                                >
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                  <span>Watch Lecture</span>
                                </button>

                                <a
                                  href={video.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-amber-300/80 hover:text-amber-200 flex items-center gap-1"
                                >
                                  <span>YouTube</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Section 2: YouTube Tutorials & Shorts */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40">
                        <Youtube className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-red-400 font-cyber">
                          YouTube Tutorials &amp; Shorts
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Practical Java coding walkthroughs, syntax tips, and 60-second shorts
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {topic.youtubeVideos.map((video) => {
                        const isWatched = user.completedVideos.includes(video.id);
                        const isShort = video.type === 'short';

                        return (
                          <div
                            key={video.id}
                            className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition group flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono-code font-bold uppercase ${
                                    isShort
                                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                  }`}
                                >
                                  {isShort ? 'YouTube Short' : 'Video Tutorial'}
                                </span>
                                {isWatched && (
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                )}
                              </div>

                              <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate">
                                {video.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                                {video.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-800/80">
                              <button
                                onClick={() => {
                                  sound.playClick();
                                  onOpenVideo(video);
                                }}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition"
                              >
                                <Play className="w-3 h-3 fill-current text-cyan-400" />
                                <span>Play Video</span>
                              </button>

                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                              >
                                <span>Link</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mark Topic as Complete Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        sound.playCoin();
                        onToggleTopicComplete(topic.id);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg ${
                        isCompleted
                          ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>Chapter 0{topic.id} Completed</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-slate-950" />
                          <span>Mark Chapter 0{topic.id} Complete (+50 XP)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredTopics.length === 0 && (
          <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400">
            <p className="text-sm">No topics matched your search &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs text-cyan-400 underline"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
