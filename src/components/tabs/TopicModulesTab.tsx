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
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-sky-50/70 border border-indigo-100 p-5 md:p-8 overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono-code font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Computer Science Java Syllabus</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-cyber tracking-tight">
              Chapter Modules &amp; Lecture Collection
            </h1>
            <p className="text-xs md:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Master all 8 core Java chapters from algorithmic flowchart logic to file streams. 
              Watch official <span className="text-amber-700 font-semibold">Dr. Tuan</span> lectures and curated visual YouTube tutorials.
            </p>
          </div>

          {/* Course Progress Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 md:w-72 shrink-0 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-500 font-medium">Learning Progress</span>
              <span className="text-indigo-600 font-mono-code font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200 mb-3">
              <div
                className="bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{user.completedTopics.length} / 8 Chapters Completed</span>
              <span>{watchedVideosCount} / {totalVideosCount} Videos Watched</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, concepts (e.g., loops, array, scanner, GUI, buffer)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs transition"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="ml-2 text-xs text-slate-500 hover:text-slate-900 px-2 py-1 font-semibold cursor-pointer"
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
                  ? 'bg-white border-indigo-300 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
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
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-bold text-sm md:text-base font-cyber shrink-0 shadow-xs ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    0{topic.id}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-indigo-700 border border-slate-200 font-mono-code font-semibold">
                        Topic {topic.id}
                      </span>
                      {topic.drTuanVideos.length > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-amber-600" />
                          Dr. Tuan Lecture
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-semibold flex items-center gap-1">
                        <Youtube className="w-3 h-3 text-red-600" />
                        {topic.youtubeVideos.length} Tutorials &amp; Shorts
                      </span>
                    </div>

                    <h2 className="text-base md:text-lg font-bold text-slate-900 mt-1 truncate">
                      {topic.title}
                    </h2>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
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
                    className={`p-2 rounded-xl transition cursor-pointer ${
                      isCompleted
                        ? 'text-emerald-600 bg-emerald-50 border border-emerald-300'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                    title={isCompleted ? 'Topic Completed' : 'Mark Topic as Completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </button>

                  <div className="text-slate-400 hover:text-slate-700 p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Content Body */}
              {isExpanded && (
                <div className="px-4 md:px-6 pb-6 pt-2 border-t border-slate-100 space-y-6 animate-in slide-in-from-top-1">
                  
                  {/* Detailed Description & Key Concepts */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 space-y-3">
                      <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider font-cyber flex items-center gap-1.5">
                        <BookMarked className="w-3.5 h-3.5" />
                        Key Concepts &amp; Core Competencies:
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                        {topic.keyConcepts.map((concept, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                            <span>{concept}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Code Snippet Box */}
                    {topic.codeSnippet && (
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between shadow-xs">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                          <span className="text-[11px] font-mono-code text-cyan-300 flex items-center gap-1">
                            <Code2 className="w-3.5 h-3.5" />
                            {topic.codeSnippet.title}
                          </span>
                          <button
                            onClick={() => handleCopyCode(topic.id, topic.codeSnippet!.code)}
                            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                            title="Copy Code"
                          >
                            {copiedTopicId === topic.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <pre className="text-[11px] font-mono-code text-slate-200 overflow-x-auto p-1 leading-relaxed max-h-36">
                          <code>{topic.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Section 1: Dr. Tuan's Lecture Videos */}
                  {topic.drTuanVideos.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-amber-800 font-cyber">
                            Dr. Tuan&apos;s Lecture Videos
                          </h3>
                          <p className="text-[11px] text-slate-500">
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
                              className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200 hover:border-amber-400 transition group flex flex-col justify-between"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono-code font-bold uppercase">
                                    Official Lecture
                                  </span>
                                  <h4 className="text-xs font-bold text-slate-900 mt-1 group-hover:text-amber-700 transition">
                                    {video.title}
                                  </h4>
                                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                                    {video.description}
                                  </p>
                                </div>
                                {isWatched && (
                                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                                )}
                              </div>

                              <div className="flex items-center justify-between pt-3 mt-3 border-t border-amber-200/80">
                                <button
                                  onClick={() => {
                                    sound.playClick();
                                    onOpenVideo(video);
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition shadow-xs cursor-pointer"
                                >
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                  <span>Watch Lecture</span>
                                </button>

                                <a
                                  href={video.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1"
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
                      <div className="p-1 rounded-lg bg-red-50 text-red-600 border border-red-200">
                        <Youtube className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-red-700 font-cyber">
                          YouTube Tutorials &amp; Shorts
                        </h3>
                        <p className="text-[11px] text-slate-500">
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
                            className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition group flex flex-col justify-between shadow-xs"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono-code font-bold uppercase ${
                                    isShort
                                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                      : 'bg-red-50 text-red-700 border border-red-200'
                                  }`}
                                >
                                  {isShort ? 'YouTube Short' : 'Video Tutorial'}
                                </span>
                                {isWatched && (
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                )}
                              </div>

                              <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition truncate">
                                {video.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                                {video.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-200">
                              <button
                                onClick={() => {
                                  sound.playClick();
                                  onOpenVideo(video);
                                }}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition cursor-pointer"
                              >
                                <Play className="w-3 h-3 fill-current text-indigo-600" />
                                <span>Play Video</span>
                              </button>

                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
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
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Chapter 0{topic.id} Completed</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-white" />
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
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 shadow-xs">
            <p className="text-sm">No topics matched your search &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs text-indigo-600 font-semibold underline cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
