'use client';

import { useEffect } from 'react';
import { isMobile } from '@/utils/deviceDetection';
import Image from 'next/image';
import QRCode from 'react-qr-code';

const APP_URL = 'app.0xartcade.xyz';

export default function DesktopSplash() {
  useEffect(() => {
    if (isMobile()) {
      window.location.href = '/';
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-3 opacity-[0.06]">
        <Image
          src="/0xartcade_bg_image.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-1">
          {/* Logo */}
          <div className="relative w-[500px] h-[110px]">
            <Image
              src="/0xartcade_logo_type.png"
              alt="0xArtcade"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center gap-8">
            <p className="text-[17px] text-white/80 text-center max-w-[420px] leading-relaxed">
              0xArtcade is designed as a full screen mobile experience. Please scan the QR code below and follow the instructions to add 0xArtcade to your phone's home screen to continue.
            </p>
            
            <div className="p-4 bg-white rounded-2xl">
              <QRCode
                value={`https://${APP_URL}`}
                size={180}
                level="H"
                fgColor="#000000"
                bgColor="#FFFFFF"
              />
            </div>
            
            <p className="text-[15px] text-white/60 font-mono">
              {APP_URL}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 