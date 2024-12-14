"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import { RoundData, GameSummary as GameSummaryType } from '@/types/game-types'
import { GAME_CONFIG } from './game-config'
import React from 'react'

interface GameSummaryProps {
  summary: GameSummaryType
  onNewGame: () => void
}

//////////////////////////////////////////////////////
/// ROUND SUMMARY CARD
//////////////////////////////////////////////////////

interface RoundSummaryCardProps {
  round: RoundData
  index: number
}

const RoundSummaryCard = ({ round, index }: RoundSummaryCardProps) => {
  return (
    <motion.div 
      className="glass-panel rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex h-28">
        {/* Image Container with padding */}
        <div className="p-2 shrink-0">
          {/* Image wrapper */}
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden">
            <Image
              src={round.imageUrl}
              alt={round.nftMetadata.questions.title}
              fill
              className="object-cover"
              placeholder={round.blurhash ? "blur" : undefined}
              blurDataURL={round.blurhash}
              sizes="96px"
            />
          </div>
        </div>

        {/* Guesses Grid */}
        <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-2 p-3">
          {GAME_CONFIG.questions.map((question) => {
            const guess = round.guesses[question.id]
            const isCorrect = guess?.isCorrect
            
            return (
              <div 
                key={question.id}
                className="text-xs flex items-center"
              >
                <div className={`
                  flex-1 truncate font-medium
                  ${isCorrect ? 'text-green-400' : 'text-red-400'}
                `}>
                  {guess?.value || 'No guess'}
                </div>
              </div>
            )
          })}
        </div>

        {/* Score */}
        <div className="w-14 h-full flex flex-col items-center justify-center bg-black/20 text-sm font-medium">
          <div>{round.score.correct * 50}</div>
          <div className="text-[10px] text-white/50">pts</div>
        </div>
      </div>
    </motion.div>
  )
}

//////////////////////////////////////////////////////
/// GAME SUMMARY SCREEN
//////////////////////////////////////////////////////

export function GameSummary({ summary, onNewGame }: GameSummaryProps): React.ReactElement {
  return (
    <div className="game-layout">
      <div className="flex-1 flex flex-col p-4 -mt-8">
        {/* Title */}
        <motion.h1 
          className="text-2xl font-orbitron text-center mb-5 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Game Summary
        </motion.h1>

        {/* Rounds */}
        <div className="space-y-3 mb-5">
          {summary.rounds.map((round, index) => (
            <RoundSummaryCard 
              key={index} 
              round={round} 
              index={index} 
            />
          ))}
        </div>

        {/* Total Score */}
        <motion.div 
          className="text-center mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-white/50 text-sm mb-1">Total Score</div>
          <div className="text-3xl font-orbitron bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            {summary.totalScore}
          </div>
        </motion.div>

        {/* Play Again Button */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={onNewGame}
            className="px-8 py-3 bg-gradient-to-r from-artcade-purple to-artcade-pink hover:from-artcade-purple/80 hover:to-artcade-pink/80 text-white border-2 border-white/20 shadow-lg font-['Orbitron'] rounded-xl"
          >
            Play Again
          </button>
        </motion.div>
      </div>
    </div>
  )
} 