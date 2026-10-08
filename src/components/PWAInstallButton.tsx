import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, X, Smartphone, CheckCircle } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);

  // If already installed, show small indicator or hide
  if (isInstalled) {
    if (compact) return null;
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-code text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 rounded-lg">
        <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline">PWA Installed</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/25 ${
          compact ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-xs md:text-sm'
        }`}
        title="Install BolehCode on your phone or desktop"
      >
        <Download className="w-4 h-4 text-slate-950 animate-pulse" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/50 transition-all ${
            compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-1.5 text-xs'
          }`}
          title="Install guide for iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-[#0c1222] border border-cyan-500/40 p-6 shadow-2xl relative text-slate-100">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40 text-cyan-400">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-cyber">Install on iPhone / iPad</h3>
                  <p className="text-xs text-slate-400">Simple setup & works offline</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 border-y border-slate-800 py-4 my-2">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <span>Open Safari and tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline mx-1 text-cyan-400" /> on the toolbar.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <span>Scroll down and select <strong>Add to Home Screen</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <span>Tap <strong>Add</strong> in the top-right corner. You&apos;re done! BolehCode is now on your home screen.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition"
              >
                Got It & Close
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop / browser when prompt is ambient or supported
  return (
    <>
      <button
        onClick={() => setShowManualGuide(true)}
        className={`hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all ${
          compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-xs'
        }`}
        title="Install PWA"
      >
        <Download className="w-3.5 h-3.5 text-cyan-400" />
        <span>Install PWA</span>
      </button>

      {showManualGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#0c1222] border border-cyan-500/40 p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setShowManualGuide(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40 text-cyan-400">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-cyber">Install BolehCode PWA</h3>
                <p className="text-xs text-slate-400">Browser Installation</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              Click your browser menu (address bar icon or three dots &vellip; in the top-right corner) and choose <strong>&ldquo;Install BolehCode&rdquo;</strong> or <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
            </p>
            <button
              onClick={() => setShowManualGuide(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
