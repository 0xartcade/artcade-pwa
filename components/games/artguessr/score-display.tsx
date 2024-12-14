"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { calculateScore } from './game-utils'
import React from 'react'

interface ScoreDisplayProps {
  correctCount: number
  timeLeft: number
  showResults: boolean
  totalQuestions: number
  isCalculating: boolean
}

export function ScoreDisplay({ correctCount, timeLeft, showResults, totalQuestions, isCalculating }: ScoreDisplayProps): React.ReactElement {
  const { basePoints, timeMultiplier, totalPoints } = calculateScore(correctCount, timeLeft)
  const timeTaken = 30 - timeLeft

  return (
    <div className="text-center text-white w-full">
      <AnimatePresence mode="wait" initial={false}>
        {isCalculating ? (
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="calculating"
          >
            <motion.p 
              className="text-xl font-orbitron tracking-[0.2em] mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
              animate={{
                textShadow: [
                  "0 0 7px #fff",
                  "0 0 10px #fff",
                  "0 0 21px #fff",
                  "0 0 42px rgb(147, 51, 234)",
                  "0 0 82px rgb(147, 51, 234)",
                  "0 0 92px rgb(147, 51, 234)",
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              CALCULATING
            </motion.p>
            <div className="flex gap-2 mt-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-pink-400"
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [0.8, 1, 0.8],
                    boxShadow: [
                      "0 0 5px rgba(147, 51, 234, 0.5)",
                      "0 0 10px rgba(147, 51, 234, 0.8)",
                      "0 0 5px rgba(147, 51, 234, 0.5)",
                    ]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        ) : showResults ? (
          <motion.div 
            className="flex flex-col items-center space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="results"
          >
            {[
              { label: 'Time Taken', value: `${timeTaken} Seconds`, delay: 0.2 },
              { label: 'Correct Answers', value: `${correctCount} of ${totalQuestions}`, delay: 0.4 },
              { label: 'Base Score', value: `${basePoints}pts`, delay: 0.6 },
              { label: 'Time Multiplier', value: `${timeMultiplier}x`, delay: 0.8 },
            ].map((item) => (
              <motion.div
                key={item.label}
                className="font-orbitron text-lg tracking-wider"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item.delay }}
              >
                <span className="text-purple-300">{item.label}</span>
                <span className="text-purple-300">...</span>
                <span className="text-white ml-2">{item.value}</span>
              </motion.div>
            ))}
            
            <motion.div
              className="mt-4 font-orbitron text-3xl tracking-widest bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 }}
            >
              <motion.div
                animate={{
                  textShadow: [
                    "0 0 10px rgba(147, 51, 234, 0.5)",
                    "0 0 20px rgba(147, 51, 234, 0.8)",
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {totalPoints}pts
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
} 