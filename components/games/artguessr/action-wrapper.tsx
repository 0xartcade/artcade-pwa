"use client"

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { GameState, GameScore } from '@/types/game-types'
import React, { useMemo, useCallback } from 'react'

//////////////////////////////////////////////////////
/// ACTION WRAPPER COMPONENT
/// Handles game UI transitions and visual feedback
//////////////////////////////////////////////////////

/* Props interface for the action wrapper */
interface ActionWrapperProps {
  children: React.ReactNode
  selectedColor: string | null
  blurhash?: string
  imageUrl?: string
  gameState: GameState
  currentNFTId?: number
  timeProgress: number
  score?: GameScore
}

//////////////////////////////////////////////////////
/// CONSTANTS
/// Visual configuration constants
//////////////////////////////////////////////////////

const STATIC_BG = '/images/bg_game_6529.JPEG'
const BACKGROUND_WIDTH = 1200
const BACKGROUND_QUALITY = 50

//////////////////////////////////////////////////////
/// UTILITY FUNCTIONS
/// Image and style processing functions
//////////////////////////////////////////////////////

/* Optimize image URLs for performance */
const getOptimizedImageUrl = (url?: string): string => {
  if (!url || !url.includes('googleusercontent.com')) return url || ''
  const baseUrl = url.split('=')[0]
  return `${baseUrl}=w${BACKGROUND_WIDTH}-q${BACKGROUND_QUALITY}`
}

/* Get overlay styles for game states */
const getOverlayStyles = () => 'absolute inset-0 bg-black/85 backdrop-saturate-[0.3]'

/* Get background image styles based on game state */
const getBackgroundImageStyles = (gameState: GameState) => {
  switch (gameState) {
    case 'start':
      return 'object-cover blur-md scale-110 brightness-[0.3]'
    case 'playing':
      return 'object-cover blur-md scale-110 brightness-[0.6]'
    case 'submitted':
    case 'calculating':
      return 'object-cover blur-md scale-110 brightness-[0.4]'
    case 'gameSummary':
      return 'object-cover blur-md scale-110 brightness-[0.3]'
    default:
      return 'object-cover blur-md scale-110 brightness-[0.4]'
  }
}

//////////////////////////////////////////////////////
/// COMPONENT
/// Visual wrapper for game interface with animations
//////////////////////////////////////////////////////

export function ActionWrapper({
  children,
  selectedColor = null,
  blurhash,
  imageUrl,
  gameState,
  currentNFTId,
  timeProgress = 1,
  score
}: ActionWrapperProps): React.ReactElement {
  // Optimize image URL
  const optimizedImageUrl = useMemo(() => getOptimizedImageUrl(imageUrl), [imageUrl])
  
  // Memoize warning states calculations
  const {
    isGreen,
    isTangerine,
    isCritical,
    isFlashing
  } = useMemo(() => ({
    isGreen: timeProgress < 0.67 && timeProgress >= 0.5,
    isTangerine: timeProgress < 0.5 && timeProgress >= 0.34,
    isCritical: timeProgress < 0.34 && timeProgress >= 0.17,
    isFlashing: timeProgress < 0.17
  }), [timeProgress]);

  // Memoize overlay styles
  const overlayStyles = useMemo(() => getOverlayStyles(), []);

  // Memoize border opacity calculation
  const borderOpacity = useMemo(() => {
    if (timeProgress > 0.67) return 0;
    return Math.min(1, (0.67 - timeProgress) * 20);
  }, [timeProgress]);

  // Memoize background image styles
  const backgroundImageStyles = useMemo(() => getBackgroundImageStyles(gameState), [gameState]);

  // Optimize submit overlay with transform instead of opacity+y
  const getSubmitOverlay = useCallback(() => {
    if (gameState !== 'submitted' && gameState !== 'calculating') return null;
    
    return (
      <motion.div 
        className="absolute inset-0 pointer-events-none mix-blend-hard-light bg-gradient-to-t from-purple-600 to-pink-600"
        initial={{ transform: 'translateY(100%)' }}
        animate={{
          transform: ['translateY(100%)', 'translateY(0%)', 'translateY(0%)', 'translateY(-100%)'],
          opacity: [0, 0.8, 0.8, 0]
        }}
        transition={{
          duration: 2,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.3, 0.7, 1]
        }}
      />
    );
  }, [gameState]);

  return (
    <div className="fixed inset-0 -top-[env(safe-area-inset-top)] -bottom-[env(safe-area-inset-bottom)] flex flex-col bg-transparent">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div 
            key={gameState === 'start' ? 'static-bg' : optimizedImageUrl}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.2,
              ease: "easeOut"
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <Image
              src={gameState === 'start' ? STATIC_BG : optimizedImageUrl}
              alt={gameState === 'start' ? 'Game Background' : 'Background'}
              fill
              className={`transition-[filter,transform] duration-200 ${backgroundImageStyles}`}
              quality={BACKGROUND_QUALITY}
              priority={true}
              sizes="100vw"
              placeholder={blurhash ? "blur" : undefined}
              blurDataURL={blurhash}
              unoptimized={true}
            />
          </motion.div>
        </AnimatePresence>

        {/* Game state overlays */}
        {gameState === 'playing' && (
          <div className="absolute inset-0">
            <motion.div 
              className={overlayStyles}
              style={{
                height: `${Math.min(100, (1 - timeProgress) * 100)}%`,
                willChange: 'transform',
              }}
              animate={{
                height: `${Math.min(100, (1 - timeProgress) * 100)}%`,
                boxShadow: isFlashing
                  ? [
                      `0 0 0 4px rgba(255,0,0,${borderOpacity * 0.9})`,
                      `0 0 30px 4px rgba(255,0,0,${borderOpacity * 0.7})`,
                    ]
                  : isCritical
                    ? `0 0 20px 4px rgba(255,0,0,${borderOpacity * 0.5})`
                    : isTangerine
                      ? `0 0 20px 4px rgba(255,126,0,${borderOpacity * 0.5})`
                      : isGreen
                        ? `0 0 20px 4px rgba(0,255,163,${borderOpacity * 0.5})`
                        : 'none'
              }}
              transition={{
                height: {
                  duration: 1,
                  ease: "linear"
                },
                boxShadow: {
                  duration: isFlashing ? 0.4 : 1,
                  repeat: isFlashing ? Infinity : 0,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }
              }}
            />
          </div>
        )}

        {/* Color overlay for selected state */}
        {selectedColor && (
          <motion.div 
            className="absolute inset-0 pointer-events-none mix-blend-hard-light"
            initial={{ transform: 'translateY(100%)' }}
            animate={{
              transform: ['translateY(100%)', 'translateY(0%)', 'translateY(0%)', 'translateY(-100%)'],
              opacity: [0, 0.8, 0.8, 0],
              backgroundColor: selectedColor
            }}
            transition={{
              duration: 2,
              ease: [0.22, 1, 0.36, 1],
              times: [0, 0.3, 0.7, 1]
            }}
          />
        )}

        {/* Game state background overlay */}
        <div 
          className={`absolute inset-0 pointer-events-none ${
            gameState === 'start' ? 'bg-black/40' :
            gameState === 'playing' ? 'bg-black/10' :
            gameState === 'submitted' || gameState === 'calculating' ? 'bg-black/30' :
            'bg-black/40'
          }`}
        />

        {/* Submit state overlay */}
        {getSubmitOverlay()}
      </div>

      {/* Content wrapper with animations */}
      <AnimatePresence mode="wait" presenceAffectsLayout={false}>
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
          layout={false}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}