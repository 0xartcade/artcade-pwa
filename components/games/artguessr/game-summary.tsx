"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import { RoundData, GameSummary as GameSummaryType } from '@/types/game-types'
import { GAME_CONFIG, calculateTickets } from './game-config'
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
      <div className="flex h-24">
        {/* Image Container with padding */}
        <div className="p-2 shrink-0">
          {/* Image wrapper */}
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden">
            <Image
              src={round.imageUrl}
              alt={round.nftMetadata.questions.title}
              fill
              className="object-cover"
              placeholder={round.blurhash ? "blur" : undefined}
              blurDataURL={round.blurhash}
              sizes="80px"
            />
          </div>
        </div>

        {/* Guesses Grid */}
        <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-1 p-3">
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
  const earnedTickets = calculateTickets(summary.totalScore)
  const { maxTicketsPerGame, maxScore } = GAME_CONFIG.gameSettings

  return (
    <div className="game-layout">
      <div className="flex-1 flex flex-col p-4 -mt-8 overflow-y-auto">
        {/* Title */}
        <motion.h1 
          className="text-2xl font-orbitron text-center mb-5 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Game Summary
        </motion.h1>

        {/* Rounds */}
        <div className="space-y-2 mb-5">
          {summary.rounds.map((round, index) => (
            <RoundSummaryCard 
              key={index} 
              round={round} 
              index={index} 
            />
          ))}
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          {/* Total Score */}
          <motion.div 
            className="glass-panel p-4 rounded-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-white/70 text-sm mb-2">Total Score</div>
            <div className="text-4xl font-orbitron bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              {summary.totalScore} <span className="text-2xl">PTS</span>
            </div>
          </motion.div>

          {/* Tickets */}
          <motion.div 
            className="glass-panel p-4 rounded-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-white/70 text-sm mb-2">Estimated Tickets</div>
            <div className="text-4xl font-orbitron bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">
              {earnedTickets} <span className="text-2xl">TICKETS</span>
            </div>
          </motion.div>
        </div>

        {/* Play Again Button */}
        <motion.div 
          className="flex justify-center mt-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
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