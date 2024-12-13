'use client';

import { useEffect } from 'react';
import { isMobile, isPWA } from '@/utils/deviceDetection';
import { GameArea } from "@/components/game-area";

export default function Home() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!isPWA()) {
      if (isMobile()) {
        window.location.href = '/mobile';
      } else {
        window.location.href = '/desktop';
      }
      return;
    }
  }, []);
  
  return (
    <main className="w-full h-screen bg-black">
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-2 left-2 text-xs font-mono text-white/30 z-50">
          {process.env.NODE_ENV === 'development' ? 'Local' : 
           process.env.VERCEL_ENV === 'production' ? 'Prod' :
           process.env.VERCEL_GIT_COMMIT_REF || 'Preview'}
        </div>
      )}
      <GameArea />
    </main>
  );
}
