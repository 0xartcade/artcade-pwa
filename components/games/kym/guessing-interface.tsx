"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { GAME_CONFIG, getQuestionColor } from './game-config'
import { Tag, Criteria, GameState } from '@/types/game-types'
import React from 'react'
import { ScoreDisplay } from './score-display'
import { useGameStore } from './game-mechanics'

const HOVER_GRADIENT = `
  linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 50%,
    transparent 100%
  )
`

interface GuessingInterfaceProps {
  tags: Tag[]
  selectedTags: Record<Criteria, Tag | null>
  gameState: GameState
  onTagClick: (tag: Tag) => void
  onReset: (criteria: Criteria) => void
  onCriteriaClick: (criteria: Criteria) => void
  gameData: { tags: Tag[] } | null
  timeElapsed: number
  onSubmit: () => void
}

const truncateText = (text: string | number | undefined, limit: number = 18): string => {
  if (text === undefined) return '';
  const str = text.toString();
  return str.length > limit ? str.slice(0, limit) + '...' : str;
};

export function GuessingInterface({
  tags,
  selectedTags,
  gameState,
  onTagClick,
  onReset,
  onCriteriaClick,
  gameData,
  timeElapsed,
  onSubmit,
}: GuessingInterfaceProps): React.ReactElement {
  const [focusedCriteria, setFocusedCriteria] = useState<Criteria | null>(null);
  const randomizedTags = useMemo(() => 
    [...tags].sort(() => Math.random() - 0.5)
  , [tags]);
  
  const showResults = useGameStore(state => state.showResults);

  const handleCriteriaClick = (criteria: Criteria) => {
    if (gameState === 'playing') {
      setFocusedCriteria(prev => prev === criteria ? null : criteria);
      onCriteriaClick(criteria);
    }
  }

  const visibleTags = useMemo(() => {
    if (!focusedCriteria) return randomizedTags;
    return randomizedTags.filter(tag => tag.criteria === focusedCriteria);
  }, [randomizedTags, focusedCriteria]);

  return (
    <div className="artcade-guessing-layout flex flex-col h-full bg-transparent">
      <div className="options-area flex-1 min-h-0 flex flex-wrap content-center gap-1.5 justify-center p-3 bg-transparent">
        {(gameState === 'submitted' || gameState === 'calculating') ? (
          <ScoreDisplay 
            key={`score-${timeElapsed}-${Object.values(selectedTags).filter((tag) => tag?.isCorrect).length}`}
            correctCount={Object.values(selectedTags).filter((tag) => tag?.isCorrect).length}
            timeLeft={30 - timeElapsed}
            showResults={showResults}
            totalQuestions={GAME_CONFIG.questions.length}
            isCalculating={gameState === 'calculating'}
          />
        ) : (
          <AnimatePresence>
            {visibleTags.map((tag: Tag) => (
              (!selectedTags[tag.criteria]) && (
                <motion.button
                  key={tag.id}
                  className="px-3 py-1 rounded-full font-semibold relative overflow-hidden hover:scale-105 bg-black/50 text-sm md:text-xs text-white"
                  style={{
                    borderColor: getQuestionColor(tag.criteria),
                    borderWidth: 1,
                  }}
                  whileHover={{
                    scale: 1.05
                  }}
                  onClick={() => {
                    onTagClick(tag);
                    setFocusedCriteria(null);
                  }}
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0,
                    transition: { duration: 0.2 }
                  }}
                >
                  {truncateText(tag.value)}
                </motion.button>
              )
            ))}
          </AnimatePresence>
        )}
      </div>
      <div className="answers-area px-3 bg-transparent">
        <div className="grid grid-cols-2 gap-1 bg-transparent">
          {GAME_CONFIG.questions.map((question) => (
            <div
              key={question.id}
              id="answer-cells"
              className="h-8 rounded-xl flex items-center justify-center overflow-hidden bg-black/50"
              style={{
                borderColor: gameState === 'submitted' && showResults ? 'transparent' : question.color,
                borderWidth: 1,
              }}
              onClick={() => handleCriteriaClick(question.id as Criteria)}
            >
              <AnimatePresence mode="wait">
                {selectedTags[question.id] ? (
                  <motion.div
                    key={selectedTags[question.id]?.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`
                      answer-text w-full h-full flex items-center justify-center px-2 py-1 
                      rounded-lg text-sm md:text-xs font-semibold uppercase relative truncate
                      group
                    `}
                    style={{
                      backgroundColor: gameState === 'submitted' && showResults
                        ? selectedTags[question.id]?.isCorrect
                          ? 'rgba(34, 197, 94, 0.4)'
                          : 'rgba(239, 68, 68, 0.4)'
                        : question.color,
                      color: 'white',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <span className={`
                      transition-opacity duration-200 absolute inset-0 
                      flex items-center justify-center
                      ${gameState === 'submitted' ? 'opacity-100 group-hover:opacity-0' : 'opacity-100'}
                    `}>
                      {truncateText(selectedTags[question.id]?.value || '')}
                    </span>

                    {gameState === 'submitted' && showResults && (
                      <span className="
                        transition-opacity duration-200 absolute inset-0 
                        flex items-center justify-center
                        opacity-0 group-hover:opacity-100
                      ">
                        {truncateText(selectedTags[question.id]?.correctAnswer || '')}
                      </span>
                    )}

                    {gameState === 'playing' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReset(question.id as Criteria);
                        }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center z-10 bg-black bg-opacity-50 rounded-full"
                        aria-label={`Reset ${question.label} selection`}
                      >
                        <X size={8} className="text-white" />
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`empty-${question.id}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="answer-text w-full h-full flex items-center justify-center group"
                    style={{
                      backgroundColor: gameState === 'submitted' ? 'rgba(239, 68, 68, 0.4)' : 'transparent',
                      opacity: gameState === 'submitted' ? 1 : 0.5  // 50% opacity for empty cells
                    }}
                  >
                    <span
                      className={`
                        answer-text text-sm md:text-xs font-semibold text-center px-1 uppercase
                        transition-opacity duration-200
                        ${gameState === 'submitted' ? 'text-white group-hover:opacity-0' : ''}
                      `}
                      style={{ color: gameState === 'submitted' ? 'white' : question.color }}
                    >
                      {gameState === 'submitted' ? 'No Answer' : question.label}
                    </span>

                    {gameState === 'submitted' && (
                      <span className="
                        transition-opacity duration-200 absolute inset-0 
                        flex items-center justify-center font-semibold
                        opacity-0 group-hover:opacity-100
                        text-sm md:text-xs text-white
                      ">
                        {truncateText(gameData?.tags.find((t: Tag) => 
                          t.criteria === question.id && t.isCorrect
                        )?.value || '')}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}