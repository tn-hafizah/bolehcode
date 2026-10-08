import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/90 border border-amber-400 text-black px-3.5 py-2 text-xs font-semibold shadow-2xl backdrop-blur-md animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span>Offline Mode — PWA Cache Active</span>
    </div>
  );
};
