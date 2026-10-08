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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 md:p-6 animate-in fade-in">
      <div className="w-full max-w-3xl rounded-2xl bg-[#090d18] border border-cyan-500/40 shadow-2xl overflow-hidden relative text-slate-100 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono-code font-bold uppercase tracking-wider shrink-0 ${
                video.speaker === 'Dr. Tuan'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
            >
              {video.speaker === 'Dr. Tuan' ? "Dr. Tuan's Lecture" : 'YouTube Tutorial'}
            </span>
            <h3 className="text-sm md:text-base font-bold text-white truncate font-cyber">
              {video.title}
            </h3>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
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
        <div className="p-4 bg-slate-950/90 flex-1 overflow-y-auto space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <p className="text-xs text-slate-300">
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
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold'
                }`}
              >
                {isWatched ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
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
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                <span>Open on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono-code">
            <Play className="w-3.5 h-3.5 text-cyan-400" />
            <span>Video ID: {video.youtubeId} | Format: {video.type.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
