'use client';

import { useEffect } from 'react';
import { isMobile } from '@/utils/deviceDetection';

//////////////////////////////////////////////////////
/// DESKTOP SPLASH PAGE
//////////////////////////////////////////////////////

export default function DesktopSplash() {
  useEffect(() => {
    // If user is on mobile, redirect to main app
    if (isMobile()) {
      window.location.href = '/';
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6">0xArtcade</h1>
      <div className="max-w-md text-center">
        <p className="text-xl mb-4">
          Please visit this site on your mobile device to experience the full app.
        </p>
        <div className="p-4 bg-gray-800 rounded-lg">
          <p className="text-sm opacity-70">
            Scan this QR code with your mobile device
            {/* TODO: Add QR code component */}
          </p>
        </div>
      </div>
    </div>
  );
} 