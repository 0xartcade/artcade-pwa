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
        return 'SUBMIT GUESS'
      case 'calculating':
        return 'CALCULATING...'
      case 'submitted':
        return 'NEXT ROUND'
      case 'nextRound':
        return 'NEXT ROUND'
      case 'gameSummary':
        return 'VIEW SUMMARY'
      default:
        return 'START'
    }
  }

  const getButtonStyle = () => {
    switch (gameState) {
      case 'playing':
        return 'from-artcade-purple to-artcade-pink hover:from-artcade-purple/80 hover:to-artcade-pink/80'
      case 'calculating':
        return 'from-artcade-purple to-artcade-pink hover:from-artcade-purple/80 hover:to-artcade-pink/80'
      case 'submitted':
        return 'from-artcade-purple to-artcade-pink hover:from-artcade-purple/80 hover:to-artcade-pink/80'
      case 'nextRound':
        return 'from-artcade-purple to-artcade-pink hover:from-artcade-purple/80 hover:to-artcade-pink/80'
      case 'gameSummary':
        return 'from-artcade-purple to-artcade-pink hover:from-artcade-purple/80 hover:to-artcade-pink/80'
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

