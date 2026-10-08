import React, { useState } from 'react';
import { PAST_YEAR_CONFIG, PAST_PAPERS_LIST, EXAM_TIPS } from '../../data/pastYearData';
import { 
  FolderOpen, 
  ExternalLink, 
  Copy, 
  Check, 
  DownloadCloud, 
  AlertTriangle, 
  FileCheck, 
  Sparkles, 
  ChevronRight, 
  BookOpenCheck 
} from 'lucide-react';
import { sound } from '../../utils/audio';

export const PastYearTab: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTipIndex, setActiveTipIndex] = useState<number | null>(0);

  const handleCopyLink = () => {
    sound.playClick();
    navigator.clipboard.writeText(PAST_YEAR_CONFIG.driveUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Primary Highlight Card: Google Drive Past Year Folder */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0c182a] via-[#091322] to-[#14122d] border-2 border-cyan-400/50 p-6 md:p-8 shadow-2xl overflow-hidden glow-cyan">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-mono-code font-bold">
              <FolderOpen className="w-4 h-4 text-cyan-400" />
              <span>Official Google Drive Past Year Archive</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-cyber tracking-tight">
              Past Examination Papers &amp; Solution Schemes
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              All past exam archives including Final Exams, Mid-Term tests, and practical Java lab assessments are cataloged in our official Google Drive folder. Download PDF question sets and marking schemes to supercharge your revision.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-cyan-300/90 font-mono-code">
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                {PAST_YEAR_CONFIG.totalSets}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <BookOpenCheck className="w-3.5 h-3.5 text-amber-400" />
                {PAST_YEAR_CONFIG.curator}
              </span>
            </div>
          </div>

          {/* Drive CTA Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              href={PAST_YEAR_CONFIG.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playCoin()}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm md:text-base shadow-xl shadow-cyan-500/25 transition transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <FolderOpen className="w-5 h-5 fill-slate-950" />
              <span>Open Google Drive Folder</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>

            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Drive Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-cyan-400" />
                  <span>Copy Folder Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Past Papers Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base md:text-lg font-bold text-white font-cyber">
              Exam Papers &amp; Assessments Archive
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono-code">PDF &amp; Java Formats</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PAST_PAPERS_LIST.map((paper) => (
            <div
              key={paper.id}
              className="p-5 rounded-2xl bg-[#0a0f1d] border border-slate-800 hover:border-cyan-500/40 transition group flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-mono-code font-bold">
                    {paper.session}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {paper.type}
                  </span>
                </div>

                <h3 className="text-sm md:text-base font-bold text-white group-hover:text-cyan-300 transition">
                  {paper.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {paper.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {paper.topicsCovered.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-amber-400/90 font-mono-code flex items-center gap-1">
                  <DownloadCloud className="w-3.5 h-3.5" />
                  {paper.fileFormat}
                </span>

                <a
                  href={PAST_YEAR_CONFIG.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  <span>Access in Drive</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Traps & Hacks */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-base md:text-lg font-bold text-white font-cyber">
              Common Exam Traps &amp; Pitfalls
            </h2>
            <p className="text-xs text-slate-400">
              Technical pitfalls where students frequently forfeit valuable marks in exams
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXAM_TIPS.map((tip, idx) => {
            const isOpen = activeTipIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#090d18] border border-slate-800 overflow-hidden"
              >
                <div
                  onClick={() => {
                    sound.playClick();
                    setActiveTipIndex(isOpen ? null : idx);
                  }}
                  className="p-4 cursor-pointer flex items-center justify-between gap-3 bg-slate-900/60 hover:bg-slate-900 transition select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs font-mono-code">
                      0{idx + 1}
                    </span>
                    <h3 className="text-xs md:text-sm font-bold text-white">
                      {tip.title}
                    </h3>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-90 text-cyan-400' : ''
                    }`}
                  />
                </div>

                {isOpen && (
                  <div className="p-4 space-y-3 border-t border-slate-800 text-xs animate-in slide-in-from-top-1">
                    <div>
                      <span className="text-rose-400 font-bold block mb-1">
                        ⚠️ Exam Pitfall:
                      </span>
                      <p className="text-slate-300">{tip.trap}</p>
                    </div>

                    <div>
                      <span className="text-emerald-400 font-bold block mb-1">
                        ✅ Correct Solution:
                      </span>
                      <p className="text-slate-300">{tip.fix}</p>
                    </div>

                    <div className="bg-[#05070f] p-3 rounded-xl border border-slate-800 font-mono-code text-[11px] text-cyan-300">
                      <pre className="overflow-x-auto">
                        <code>{tip.snippet}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
