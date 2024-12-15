'use client';

import { useEffect, useState } from 'react';
import { isMobile, isPWA } from '@/utils/deviceDetection';
import { InstallPrompt } from '@/components/install-prompt';
import { ViewportHandler } from '@/components/viewport-handler';
import Image from 'next/image';

export default function MobileSplash() {
  const [mounted, setMounted] = useState(false);
  const [isPWAMode, setIsPWAMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsPWAMode(isPWA());
    
    if (isPWA()) {
      window.location.href = '/';
    } else if (!isMobile()) {
      window.location.href = '/desktop';
    }
  }, []);

  if (!mounted) return null;
  if (isPWAMode) return null;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-3 opacity-[0.06]">
        <Image
          src="/0xartcade_bg_image.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>
      <ViewportHandler />
      <div className="h-full flex flex-col items-center justify-start pt-[20vh] relative">
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
      <InstallPrompt />
    </div>
  );
} 