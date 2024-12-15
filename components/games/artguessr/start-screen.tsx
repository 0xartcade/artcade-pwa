"use client"

import { motion } from 'framer-motion'
import { GAME_MODES, GAME_TYPES } from '@/config/game-registry'
import { ACTIVE_GAME } from '@/config/active-game'
import Image from 'next/image'

interface StartScreenProps {
  onStartGame: () => void
}

export function StartScreen({ onStartGame }: StartScreenProps) {
  const gameMode = GAME_MODES[ACTIVE_GAME.mode]
  const gameType = GAME_TYPES[ACTIVE_GAME.type]

  const categories = [
    { name: 'ARTIST NAME', color: 'from-purple-500 to-pink-500' },
    { name: 'SEASON #', color: 'from-blue-500 to-cyan-500' },
    { name: 'ART NAME', color: 'from-violet-500 to-purple-500' },
    { name: 'FLOOR PRICE', color: 'from-red-500 to-rose-500' }
  ]

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-lg mx-auto px-4 py-8">
      {/* Logo */}
      <div className="w-full max-w-sm pt-12">
        <Image
          src="/images/0xartcade_logo_type.png"
          alt="0xArtcade"
          width={600}
          height={120}
          className="w-full"
          priority
        />
      </div>

      {/* Game Info */}
      <div className="flex-1 flex flex-col items-center justify-center w-full space-y-8 mt-4 mb-8">
        <div className="space-y-2 text-center">
          <motion.h1 
            className="text-3xl font-orbitron text-center bg-gradient-to-r from-artcade-purple to-artcade-pink text-transparent bg-clip-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {gameMode.name}
          </motion.h1>
          <motion.p
            className="text-sm text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Powered by {gameType.poweredBy}
          </motion.p>
        </div>

        <motion.p 
          className="text-center text-white/80 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {gameMode.description}
        </motion.p>

        {/* Categories */}
        <div className="w-full max-w-md space-y-2 px-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              className={`
                w-full h-14 rounded-xl
                bg-gradient-to-r ${category.color}
                flex items-center justify-center
                font-orbitron text-base text-white/90
                border border-white/10
              `}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (index * 0.1) }}
            >
              {category.name}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-white/80">Points are earned for speed and accuracy.</p>
          <p className="text-white/80 font-orbitron">Good luck!</p>
        </motion.div>
      </div>

      {/* Start Button */}
      <div className="action-container px-3 pt-3 pb-1 min-h-[75px] h-[75px] flex items-center justify-center w-full max-w-md">
        <motion.button
          className={`
            w-full h-full bg-gradient-to-r from-artcade-purple to-artcade-pink hover:from-artcade-purple/80 hover:to-artcade-pink/80
            text-white border-2 border-white/20 shadow-lg 
            font-['Orbitron'] font-bold text-lg md:text-sm 
            rounded-2xl retro-button
          `}
          onClick={onStartGame}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          START GAME
        </motion.button>
      </div>
    </div>
  )
} 