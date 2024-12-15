"use client"

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { GameState, GameScore } from '@/types/game-types'
import React from 'react'

interface ActionWrapperProps {
  children: React.ReactNode
  selectedColor: string | null
  isPulsing?: boolean
  blurhash?: string
  imageUrl?: string
  gameState: GameState
  score?: GameScore
  currentNFTId?: string
  timeProgress?: number
}

const STATIC_BG = '/images/bg_game_6529.JPEG'

export function ActionWrapper({
  children,
  selectedColor = null,
  isPulsing = false,
  blurhash,
  imageUrl,
  gameState,
  score,
  currentNFTId,
  timeProgress = 1
}: ActionWrapperProps): React.ReactElement {
  // Add submit flash and score grid animations
  const getSubmitOverlay = () => {
    if (gameState !== 'submitted' && gameState !== 'calculating') return null;
    
    return (
      <>
        {/* Submit pulse animation - smooth up and down motion */}
        <motion.div 
          className="absolute inset-0 pointer-events-none mix-blend-hard-light bg-gradient-to-t from-purple-600 to-pink-600"
          initial={{ 
            opacity: 0,
            y: "100%"
          }}
          animate={{
            opacity: [0, 0.8, 0.8, 0],
            y: ["100%", "0%", "0%", "100%"]
          }}
          transition={{
            duration: 2,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.3, 0.7, 1]
          }}
        />
      </>
    );
  };

  // Calculate warning states
  const isWarning = timeProgress < 0.67; // ~20 seconds (start showing border)
  const isGreen = timeProgress < 0.67 && timeProgress >= 0.5; // 20-15 seconds
  const isTangerine = timeProgress < 0.5 && timeProgress >= 0.34; // 15-10 seconds
  const isCritical = timeProgress < 0.34 && timeProgress >= 0.17; // 10-5 seconds
  const isFlashing = timeProgress < 0.17; // 5-0 seconds

  // Get overlay styles based on time remaining
  const getOverlayStyles = () => {
    return 'absolute inset-0 bg-black/85 backdrop-saturate-[0.3]'
  }

  // Get border opacity based on time
  const getBorderOpacity = () => {
    if (timeProgress > 0.67) return 0; // No border before 20 seconds
    // Fade in from 0 to 1 over the first 2 seconds of warning state
    const fadeInProgress = Math.min(1, (0.67 - timeProgress) * 20);
    return fadeInProgress;
  }

  // Get background image styles based on game state
  const getBackgroundImageStyles = () => {
    switch (gameState) {
      case 'start':
        return 'object-cover blur-lg scale-[1.2] brightness-[0.3]'
      case 'playing':
        return 'object-cover blur-lg scale-[1.2] brightness-[0.6]'
      case 'submitted':
      case 'calculating':
        return 'object-cover blur-lg scale-[1.2] brightness-[0.4]'
      case 'gameSummary':
        return 'object-cover blur-lg scale-[1.2] brightness-[0.3]'
      default:
        return 'object-cover blur-lg scale-[1.2] brightness-[0.4]'
    }
  }

  return (
    <div className="fixed inset-0 -top-[env(safe-area-inset-top)] -bottom-[env(safe-area-inset-bottom)] flex flex-col bg-transparent">
      {/* Background container with timer effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Base background image */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={gameState === 'start' ? 'static-bg' : imageUrl}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={gameState === 'start' ? STATIC_BG : (imageUrl || '')}
              alt={gameState === 'start' ? 'Game Background' : 'Background'}
              fill
              className={getBackgroundImageStyles()}
              quality={1}
              priority={true}
              unoptimized={imageUrl?.includes('googleusercontent.com')}
              placeholder={blurhash ? "blur" : undefined}
              blurDataURL={blurhash}
            />
          </motion.div>
        </AnimatePresence>

        {/* Timer Effect - Only shown during gameplay */}
        {gameState === 'playing' && (
          <div className="absolute inset-0">
            {/* Dark overlay that moves down */}
            <motion.div 
              className={getOverlayStyles()}
              style={{
                height: `${Math.min(100, (1 - timeProgress) * 100)}%`,
                borderBottom: 'none', // Remove solid border
                filter: `blur(4px)`, // Reduced from 8px to 4px
              }}
              animate={{
                height: `${Math.min(100, (1 - timeProgress) * 100)}%`,
                boxShadow: isFlashing
                  ? [
                      `0 0 0 4px rgba(255,0,0,${getBorderOpacity() * 0.9})`,
                      `0 0 30px 4px rgba(255,0,0,${getBorderOpacity() * 0.7})`,
                      `0 0 0 4px rgba(255,0,0,${getBorderOpacity() * 0.9})`
                    ]
                  : isCritical
                    ? `0 0 20px 4px rgba(255,0,0,${getBorderOpacity() * 0.5})`
                    : isTangerine
                      ? `0 0 20px 4px rgba(255,126,0,${getBorderOpacity() * 0.5})`
                      : isGreen
                        ? `0 0 20px 4px rgba(0,255,163,${getBorderOpacity() * 0.5})`
                        : 'none'
              }}
              transition={{
                height: {
                  duration: 1,
                  ease: "linear"
                },
                boxShadow: {
                  duration: isFlashing ? 0.4 : 1, // Slower flashing but still intense
                  repeat: isFlashing ? Infinity : 0,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }
              }}
            />

            {/* Soft glow line */}
            <div 
              className="absolute left-0 right-0 h-[1px]"
              style={{
                top: `${Math.min(100, (1 - timeProgress) * 100)}%`,
                background: isFlashing
                  ? `rgba(255,0,0,${getBorderOpacity() * 0.9})`
                  : isCritical
                    ? `rgba(255,0,0,${getBorderOpacity() * 0.5})`
                    : isTangerine
                      ? `rgba(255,126,0,${getBorderOpacity() * 0.5})`
                      : isGreen
                        ? `rgba(0,255,163,${getBorderOpacity() * 0.5})`
                        : 'transparent',
                boxShadow: `0 0 20px 10px ${
                  isFlashing
                    ? `rgba(255,0,0,${getBorderOpacity() * 0.7})`
                    : isCritical
                      ? `rgba(255,0,0,${getBorderOpacity() * 0.3})`
                      : isTangerine
                        ? `rgba(255,126,0,${getBorderOpacity() * 0.3})`
                        : isGreen
                          ? `rgba(0,255,163,${getBorderOpacity() * 0.3})`
                          : 'transparent'
                }`,
                filter: 'blur(2px)',
                transition: 'all 1s linear',
              }}
            />
          </div>
        )}

        {/* Color overlay - Only shown when color is selected */}
        <motion.div 
          className="absolute inset-0 pointer-events-none mix-blend-hard-light"
          initial={{ 
            opacity: 0,
            y: "100%"
          }}
          animate={{
            opacity: selectedColor ? [0, 0.8, 0.8, 0] : 0,
            y: selectedColor ? ["100%", "0%", "0%", "-100%"] : "100%",
            backgroundColor: selectedColor || 'transparent'
          }}
          transition={{
            duration: 2,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.3, 0.7, 1]
          }}
        />

        {/* Dark overlay - Static based on game state */}
        <div 
          className={`absolute inset-0 pointer-events-none ${
            gameState === 'start' ? 'bg-black/40' :
            gameState === 'playing' ? 'bg-black/10' :
            gameState === 'submitted' ? 'bg-black/30' :
            gameState === 'calculating' ? 'bg-black/30' :
            'bg-black/40'
          }`}
        />

        {/* Submit and score overlays */}
        {getSubmitOverlay()}
      </div>

      {/* Content container */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentNFTId}
          className="relative flex-1 flex flex-col px-1.5 bg-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}