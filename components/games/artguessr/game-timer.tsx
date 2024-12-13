"use client"

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { GameState } from '@/types/game-types'

interface GameTimerProps {
  isActive: boolean
  onTimeUpdate: (seconds: number) => void
  onTimeout: () => void
  gameState: GameState
}

export function GameTimer({ isActive, onTimeUpdate, onTimeout, gameState }: GameTimerProps) {
  const [seconds, setSeconds] = useState(30)

  useEffect(() => {
    if (gameState === 'playing') {
      setSeconds(30)
    }
  }, [gameState])

  const updateTime = useCallback(() => {
    if (seconds > 0) {
      const newTime = seconds - 1
      setSeconds(newTime)
      onTimeUpdate(30 - newTime)
      if (newTime === 0) {
        onTimeout()
      }
    }
  }, [seconds, onTimeUpdate, onTimeout])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && seconds > 0) {
      interval = setInterval(updateTime, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, seconds, updateTime])

  return (
    <motion.div 
      className="game-timer"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="glass-panel-light w-[52px] h-[42px] flex items-center justify-center">
        <div className="flex items-center justify-center w-full h-full">
          <span className="font-['Orbitron'] text-xl text-white tabular-nums text-center block w-full">
            {seconds}
          </span>
        </div>
      </div>
    </motion.div>
  )
} 