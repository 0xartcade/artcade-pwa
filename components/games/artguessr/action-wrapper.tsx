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
  currentNFTId?: string | number
}

const STATIC_BG = '/images/bg_game_6529.JPEG'  // Add static background path

export function ActionWrapper({
  children,
  selectedColor = null,
  isPulsing = false,
  blurhash,
  imageUrl,
  gameState,
  score,
  currentNFTId
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

  return (
    <div className="fixed inset-0 -top-[env(safe-area-inset-top)] -bottom-[env(safe-area-inset-bottom)] flex flex-col bg-transparent">
      {/* Background container */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Blurred background image */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={gameState === 'start' ? 'static-bg' : imageUrl}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 0.4
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={gameState === 'start' ? STATIC_BG : (imageUrl || '')}
              alt={gameState === 'start' ? 'Game Background' : 'Background'}
              fill
              className="object-cover blur-2xl scale-[1.2] brightness-75"
              quality={1}
              priority={true}
              unoptimized={imageUrl?.includes('googleusercontent.com')}
              placeholder={blurhash ? "blur" : undefined}
              blurDataURL={blurhash}
            />
          </motion.div>
        </AnimatePresence>

        {/* Color overlay */}
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
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.3, 0.7, 1]
          }}
        />

        {/* Dark overlay */}
        <motion.div 
          className="absolute inset-0 pointer-events-none bg-black/20"
          animate={{
            opacity: isPulsing ? [1, 0.7] : 1
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
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