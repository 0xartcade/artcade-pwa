"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import { GameState, GameScore } from '@/types/game-types'

interface ActionWrapperProps {
  children: React.ReactNode
  selectedColor: string | null
  isPulsing?: boolean
  blurhash?: string
  imageUrl?: string
  gameState: GameState
  score?: GameScore
}

export function ActionWrapper({
  children,
  selectedColor = null,
  isPulsing = false,
  blurhash,
  imageUrl,
  gameState,
  score
}: ActionWrapperProps): JSX.Element {
  // Add submit flash and score grid animations
  const getSubmitOverlay = () => {
    if (gameState !== 'submitted') return null;
    
    return (
      <>
        {/* Submit pulse animation - rising from bottom */}
        <motion.div 
          className="absolute inset-0 pointer-events-none mix-blend-hard-light bg-gradient-to-t from-purple-600 to-pink-600"
          initial={{ 
            opacity: 0,
            y: "100%" // Start from bottom
          }}
          animate={{
            opacity: [0, 0.8, 0.8, 0],
            y: ["100%", "0%", "0%", "0%"], // Rise up animation
            boxShadow: [
              'none',
              '0 0 50px rgb(147, 51, 234)',
              '0 0 50px rgb(147, 51, 234)',
              'none'
            ]
          }}
          transition={{
            duration: 2.5,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.2, 0.5, 1]
          }}
        />

        {/* Updated score grid overlay */}
        <motion.div 
          className="absolute inset-0 pointer-events-none grid grid-cols-2 grid-rows-2 gap-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.3 }}
        >
          {Object.values(score?.answers || {}).map((isCorrect: boolean, index: number) => (
            <motion.div
              key={index}
              className={`
                ${isCorrect 
                  ? 'bg-green-500/25 border border-green-500/30' 
                  : 'bg-red-500/25 border border-red-500/30'
                }
                ${index === 0 ? 'rounded-tl-[40px]' : ''}
                ${index === 1 ? 'rounded-tr-[40px]' : ''}
                ${index === 2 ? 'rounded-bl-[40px]' : ''}
                ${index === 3 ? 'rounded-br-[40px]' : ''}
              `}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0 + (index * 0.1) }}
            />
          ))}
        </motion.div>
      </>
    );
  };

  return (
    <div className="relative flex flex-col h-full px-1.5 pt-7 action-wrapper">
      <div className="absolute inset-0 md:inset-0 md:top-0 -top-[env(safe-area-inset-top)] overflow-hidden">
        {/* Blurred background image - add opacity transition */}
        <div className={`absolute inset-0 scale-110 transition-opacity duration-500 ${gameState === 'submitted' ? 'opacity-25' : 'opacity-50'}`}>
          <Image
            src={imageUrl || ''}
            alt="Background"
            fill
            className="object-cover blur-lg"
            quality={1}
            priority={false}
            unoptimized={imageUrl?.includes('googleusercontent.com')}
            placeholder={blurhash ? "blur" : undefined}
            blurDataURL={blurhash}
          />
        </div>

        {/* Color overlay - reduced brightness */}
        <motion.div 
          className="absolute inset-0 pointer-events-none mix-blend-hard-light"
          animate={{
            backgroundColor: selectedColor ? selectedColor : 'transparent',
            opacity: selectedColor ? [0, 0.75, 0.75, 0] : 0, // Reduced from 1 to 0.75
            boxShadow: selectedColor ? [
              'none',
              `0 0 40px ${selectedColor}`, // Slightly reduced glow
              `0 0 40px ${selectedColor}`,
              'none'
            ] : 'none'
          }}
          transition={{
            opacity: {
              duration: selectedColor ? 2.5 : 0.8,
              ease: [0.22, 1, 0.36, 1],
              times: selectedColor ? [0, 0.2, 0.5, 1] : undefined
            },
            boxShadow: {
              duration: selectedColor ? 2.5 : 0.8,
              ease: [0.22, 1, 0.36, 1],
              times: selectedColor ? [0, 0.2, 0.5, 1] : undefined
            }
          }}
        />

        {/* Mobile version */}
        <motion.div 
          className="absolute inset-0 pointer-events-none md:hidden bg-black/30"
          animate={{
            opacity: isPulsing ? [1, 0.7] : 1
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          style={{
            borderRadius: '0 0 32px 32px',
          }}
        />
        
        {/* Desktop version */}
        <motion.div 
          className="absolute inset-0 pointer-events-none hidden md:block bg-black/30"
          animate={{
            opacity: isPulsing ? [1, 0.7] : 1
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          style={{
            borderRadius: '24px',
          }} 
        />

        {/* Add new submit and score overlays */}
        {getSubmitOverlay()}
      </div>
      {children}
    </div>
  );
}