"use client"

import { motion } from 'framer-motion'
import { GameState } from '@/types/game-types'
import React from 'react'

interface ActionButtonProps {
  gameState: GameState
  onClick: () => void
  disabled?: boolean
}

export function ActionButton({ gameState, onClick, disabled = false }: ActionButtonProps): React.ReactElement {
  const getButtonText = () => {
    switch (gameState) {
      case 'playing':
        return 'Submit Guess'
      case 'calculating':
        return 'Calculating...'
      case 'submitted':
        return 'Next Round'
      case 'nextRound':
        return 'Next Round'
      case 'gameSummary':
        return 'View Summary'
      default:
        return 'Start'
    }
  }

  const getButtonStyle = () => {
    switch (gameState) {
      case 'playing':
        return 'from-artcade-purple to-artcade-pink hover:from-artcade-purple/80 hover:to-artcade-pink/80'
      case 'calculating':
        return 'from-gray-500 to-gray-600'
      case 'submitted':
        return 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
      case 'nextRound':
        return 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
      case 'gameSummary':
        return 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
      default:
        return 'from-artcade-purple to-artcade-pink hover:from-artcade-purple/80 hover:to-artcade-pink/80'
    }
  }

  return (
    <motion.button
      className={`
        w-full h-full bg-gradient-to-r ${getButtonStyle()}
        text-white border-2 border-white/20 shadow-lg 
        font-['Orbitron'] font-bold text-lg md:text-sm 
        rounded-2xl retro-button
      `}
      onClick={onClick}
      disabled={disabled || gameState === 'calculating'}
      whileHover={{ scale: disabled || gameState === 'calculating' ? 1 : 1.02 }}
      whileTap={{ scale: disabled || gameState === 'calculating' ? 1 : 0.98 }}
    >
      {getButtonText()}
    </motion.button>
  )
}

