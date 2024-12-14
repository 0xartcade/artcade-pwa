'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share, PlusSquare, CheckSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const floatingAnimation = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: [0, -8, 0],
    transition: {
      y: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      },
      opacity: {
        duration: 0.3
      }
    }
  },
  exit: { opacity: 0, y: 10 }
};

export function InstallPrompt() {
  const [mounted, setMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Detect iOS
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));

    // Handle Android install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    });

    // Show iOS prompt after a short delay
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      setTimeout(() => setShowPrompt(true), 1000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShowPrompt(true);
      });
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  // Don't render anything until after hydration
  if (!mounted || !showPrompt) return null;

  return (
    <AnimatePresence mode="wait">
      {isIOS ? (
        // iOS-specific prompt
        <motion.div
          key="ios-prompt"
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed bottom-12 inset-x-0 mx-auto z-50 w-[260px]"
        >
          {/* Speech bubble container */}
          <div className="relative bg-neutral-900/95 backdrop-blur-md rounded-2xl p-4
                        shadow-lg border border-white/10">
            {/* Triangle pointer */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45
                          bg-neutral-900/95 border-r border-b border-white/10" />
            
            {/* Content */}
            <div className="relative space-y-3">
              <div className="flex justify-between items-start">
                <p className="text-[15px] font-medium text-white">Install 0xArtcade</p>
                <button
                  onClick={() => setShowPrompt(false)}
                  className="text-white/60 hover:text-white -mt-1 -mr-1 p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-[14px] text-white/80">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">1</span>
                  <span className="flex-1">Tap the share button</span>
                  <span className="p-1.5 bg-white/10 rounded">
                    <Share className="w-[18px] h-[18px]" />
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-[14px] text-white/80">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">2</span>
                  <span className="flex-1">Add to Home Screen</span>
                  <span className="p-1.5 bg-white/10 rounded">
                    <PlusSquare className="w-[18px] h-[18px]" />
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-[14px] text-white/80">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">3</span>
                  <span className="flex-1">Click "Add" to confirm</span>
                  <span className="p-1.5 bg-white/10 rounded">
                    <CheckSquare className="w-[18px] h-[18px]" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        // Android-specific prompt
        <motion.div
          key="android-prompt"
          variants={floatingAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed bottom-12 inset-x-0 mx-auto z-50 w-[280px]"
        >
          <div className="relative bg-neutral-900/95 backdrop-blur-md rounded-2xl p-4
                        shadow-lg border border-white/10">
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45
                          bg-neutral-900/95 border-r border-b border-white/10" />
            
            <div className="relative flex items-center justify-between gap-4">
              <p className="text-[14px] text-white/90">
                Install 0xArtcade for the best experience
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleInstallClick}
                  className="px-3 py-1.5 bg-white text-black text-sm font-medium rounded-lg
                           hover:bg-white/90 transition-colors"
                >
                  Install
                </button>
                <button
                  onClick={() => setShowPrompt(false)}
                  className="text-white/60 hover:text-white -mt-1 -mr-1 p-1"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 