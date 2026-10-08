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
      {/* Primary Highlight Card: Past Year Folder */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-amber-50/70 border-2 border-indigo-200/90 p-6 md:p-8 shadow-xs overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono-code font-bold">
              <FolderOpen className="w-4 h-4 text-indigo-600" />
              <span>Past Year Archive</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-cyber tracking-tight">
              Past Examination Papers
            </h1>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              All past exam archives including Final Exams, Mid-Term tests, and practical Java lab assessments are cataloged in our official Google Drive folder. Download PDF question sets to supercharge your revision.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-700 font-mono-code font-semibold">
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                {PAST_YEAR_CONFIG.totalSets}
              </span>
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                <BookOpenCheck className="w-3.5 h-3.5 text-amber-600" />
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
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-bold text-sm md:text-base shadow-lg shadow-indigo-500/20 transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <FolderOpen className="w-5 h-5 fill-white" />
              <span>Open Google Drive Folder</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>

            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-xs transition cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Drive Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-indigo-600" />
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
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base md:text-lg font-bold text-slate-900 font-cyber">
              Exam Papers &amp; Assessments Archive
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono-code font-medium">PDF &amp; Java Formats</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PAST_PAPERS_LIST.map((paper) => (
            <div
              key={paper.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition group flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono-code font-bold">
                    {paper.session}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    {paper.type}
                  </span>
                </div>

                <h3 className="text-sm md:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  {paper.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {paper.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {paper.topicsCovered.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-amber-700 font-mono-code font-semibold flex items-center gap-1">
                  <DownloadCloud className="w-3.5 h-3.5 text-amber-600" />
                  {paper.fileFormat}
                </span>

                <a
                  href={PAST_YEAR_CONFIG.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
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
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 font-cyber">
              Common Exam Traps &amp; Pitfalls
            </h2>
            <p className="text-xs text-slate-500">
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
                className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden"
              >
                <div
                  onClick={() => {
                    sound.playClick();
                    setActiveTipIndex(isOpen ? null : idx);
                  }}
                  className="p-4 cursor-pointer flex items-center justify-between gap-3 bg-slate-50/70 hover:bg-slate-100/80 transition select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs font-mono-code">
                      0{idx + 1}
                    </span>
                    <h3 className="text-xs md:text-sm font-bold text-slate-900">
                      {tip.title}
                    </h3>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-90 text-indigo-600' : ''
                    }`}
                  />
                </div>

                {isOpen && (
                  <div className="p-4 space-y-3 border-t border-slate-100 text-xs animate-in slide-in-from-top-1 bg-white">
                    <div>
                      <span className="text-rose-600 font-bold block mb-1">
                        ⚠️ Exam Pitfall:
                      </span>
                      <p className="text-slate-600">{tip.trap}</p>
                    </div>

                    <div>
                      <span className="text-emerald-700 font-bold block mb-1">
                        ✅ Correct Solution:
                      </span>
                      <p className="text-slate-600">{tip.fix}</p>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono-code text-[11px] text-cyan-300">
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
