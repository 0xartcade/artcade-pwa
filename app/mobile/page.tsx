'use client';

import { useEffect, useState } from 'react';
import { isMobile, isPWA } from '@/utils/deviceDetection';

//////////////////////////////////////////////////////
/// MOBILE SPLASH PAGE
//////////////////////////////////////////////////////

export default function MobileSplash() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // If already in PWA or on desktop, redirect to appropriate page
    if (isPWA()) {
      window.location.href = '/';
    } else if (!isMobile()) {
      window.location.href = '/desktop';
    }

    // Handle PWA installation prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6">0xArtcade</h1>
      <div className="max-w-md text-center">
        {isInstallable ? (
          <>
            <p className="text-xl mb-4">
              Install 0xArtcade for the best experience
            </p>
            <button
              onClick={handleInstallClick}
              className="bg-white text-black font-semibold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Install App
            </button>
          </>
        ) : (
          <p className="text-xl">
            Add this page to your home screen for the best experience
          </p>
        )}
      </div>
    </div>
  );
} 