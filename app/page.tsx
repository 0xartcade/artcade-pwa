'use client';

import { useEffect, useState } from 'react';
import { isMobile, isPWA } from '@/utils/deviceDetection';
import { GameArea } from "@/components/game-area";
import Image from 'next/image';

export default function Home() {
  const [isPWAMode, setIsPWAMode] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsPWAMode(isPWA());

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
    <main className="w-full h-screen bg-black relative overflow-hidden">
      {!isPWAMode && (
        <>
          <div className="absolute inset-3 opacity-[0.06]">
            <Image
              src="/images/0xartcade_bg_image.png"
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col items-center justify-start pt-[20vh] relative">
            <div className="relative w-[420px] h-[90px] mb-8">
              <Image
                src="/images/0xartcade_logo_type.png"
                alt="0xArtcade"
                fill
                className="object-contain"
                priority
              />
            </div>
            <p className="text-[17px] text-white/80 text-center max-w-[300px]">
              0xArtcade is designed to be a full-screen mobile experience. Please follow the instructions below to add the app to your home screen.
            </p>
          </div>
        </>
      )}
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
