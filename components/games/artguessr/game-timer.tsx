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

  return null
} 