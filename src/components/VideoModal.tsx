import React from 'react';
import { VideoItem } from '../types';
import { X, ExternalLink, Play, CheckCircle2, Award } from 'lucide-react';
import { sound } from '../utils/audio';

interface VideoModalProps {
  video: VideoItem | null;
  onClose: () => void;
  onMarkWatched: (id: string) => void;
  isWatched: boolean;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  video,
  onClose,
  onMarkWatched,
  isWatched,
}) => {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-6 animate-in fade-in">
      <div className="w-full max-w-3xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden relative text-slate-800 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono-code font-bold uppercase tracking-wider shrink-0 ${
                video.speaker === 'Dr. Tuan'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {video.speaker === 'Dr. Tuan' ? "Dr. Tuan's Lecture" : 'YouTube Tutorial'}
            </span>
            <h3 className="text-sm md:text-base font-bold text-slate-900 truncate font-cyber">
              {video.title}
            </h3>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Video Details & Action Footer */}
        <div className="p-4 bg-white flex-1 overflow-y-auto space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <p className="text-xs text-slate-600">
                {video.description || 'Watch this coding lesson to master Java syntax and computational logic.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playCoin();
                  onMarkWatched(video.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isWatched
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs'
                }`}
              >
                {isWatched ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Watched (+20 XP)</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Mark as Watched</span>
                  </>
                )}
              </button>

              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition"
              >
                <span>Open on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono-code">
            <Play className="w-3.5 h-3.5 text-indigo-600" />
            <span>Video ID: {video.youtubeId} | Format: {video.type.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
