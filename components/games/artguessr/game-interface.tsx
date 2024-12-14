"use client"

import { useEffect, useState } from 'react'
import { GuessingInterface } from './guessing-interface'
import { NFTImage } from './nft-image'
import { ActionButton } from './action-button'
import { generateGameData } from './game-utils'
import { fetchGameData } from '@/utils/game-data'
import { ACTIVE_GAME } from '@/config/active-game'
import { GameData as TemplateGameData } from '../game-template/game-types'
import { GameData, Tag } from '@/types/game-types'
import { GAME_CONFIG } from './game-config'
import { ActionWrapper } from './action-wrapper'
import { FullScreenImage } from './full-screen-image'
import Head from 'next/head'
import { GameTimer } from './game-timer'
import { StartScreen } from './start-screen'
import { GameSummary } from './game-summary'
import { useGameStore } from './game-mechanics'

function transformToFullGameData(data: TemplateGameData): GameData {
  const titles = [...new Set(data.raw_data.map(nft => nft.questions.title))]
  const supplies = [...new Set(data.raw_data.map(nft => nft.questions.supply))]
  const artists = [...new Set(data.raw_data.map(nft => nft.questions.artist))]
  const seasons = [...new Set(data.raw_data.map(nft => nft.questions.season))]

  return {
    raw_data: data.raw_data,
    titles,
    supplies,
    artists,
    seasons
  }
}

export default function GameInterface() {
  // Game Store
  const {
    gameState,
    currentNFT,
    availableTags,
    selectedTags,
    elapsedTime,
    rounds,
    totalScore,
    startNewGame,
    submitRound,
    nextRound,
    updateTime,
    selectTag,
    resetTag,
    setGameData
  } = useGameStore()

  // Load initial game data
  useEffect(() => {
    fetchGameData(ACTIVE_GAME.mode)
      .then((data: TemplateGameData) => {
        const fullData = transformToFullGameData(data)
        const gameData = generateGameData(fullData)
        setGameData(gameData.nft, gameData.tags)
      })
      .catch((error: Error) => {
        console.error('Failed to fetch game data:', error)
      })
  }, [setGameData])

  // Load new NFT data when moving to next round
  useEffect(() => {
    if (gameState === 'playing' && !currentNFT) {
      fetchGameData(ACTIVE_GAME.mode)
        .then((data: TemplateGameData) => {
          const fullData = transformToFullGameData(data)
          const gameData = generateGameData(fullData)
          setGameData(gameData.nft, gameData.tags)
        })
        .catch((error: Error) => {
          console.error('Failed to fetch game data:', error)
        })
    }
  }, [gameState, currentNFT, setGameData])

  const handleTagClick = (tag: Tag) => {
    selectTag(tag)
  }

  const handleSubmit = () => {
    if (gameState === 'playing') {
      submitRound()
    } else if (gameState === 'nextRound') {
      nextRound()
    }
  }

  const handleTimeout = () => {
    if (gameState === 'playing') {
      submitRound()
    }
  }

  const handleStartGame = () => {
    startNewGame()
  }

  const [isFullScreen, setIsFullScreen] = useState(false)
  const imageLayoutId = `nft-image-${currentNFT?.token_id}`

  if (!currentNFT && gameState !== 'gameSummary') return null

  return (
    <>
      <Head>
        <meta 
          name="theme-color" 
          content="transparent" 
        />
        <meta 
          name="apple-mobile-web-app-status-bar-style" 
          content="transparent" 
        />
      </Head>
      <div className="relative w-full h-full">
        <ActionWrapper 
          selectedColor={null}
          isPulsing={true}
          blurhash={currentNFT?.blurhash}
          imageUrl={currentNFT?.image_url}
          gameState={gameState}
          score={
            gameState === 'submitted' 
              ? {
                  correct: Object.values(selectedTags).filter((tag) => tag?.isCorrect).length,
                  total: GAME_CONFIG.questions.length,
                  answers: GAME_CONFIG.questions.map(question => 
                    selectedTags[question.id]?.isCorrect ?? false
                  ),
                  timeElapsed: elapsedTime
                }
              : undefined
          }
        >
          {gameState === 'start' ? (
            <StartScreen onStartGame={handleStartGame} />
          ) : gameState === 'gameSummary' ? (
            <GameSummary 
              summary={{
                rounds,
                totalScore,
                currentRound: rounds.length
              }}
              onNewGame={handleStartGame}
            />
          ) : currentNFT ? (
            <>
              <GameTimer 
                isActive={gameState === 'playing'}
                onTimeUpdate={updateTime}
                onTimeout={handleTimeout}
                gameState={gameState}
              />
              <div className="game-layout">
                <div className="image-area glass-panel relative w-full h-[40vh] md:h-[45%] overflow-hidden">
                  <div className="absolute inset-1 md:rounded-2xl overflow-hidden">
                    <NFTImage
                      src={currentNFT.image_url}
                      alt={currentNFT.questions.title}
                      onImageClick={() => setIsFullScreen(true)}
                      layoutId={imageLayoutId}
                    />
                  </div>
                </div>

                <div className="guess-container flex-1 flex flex-col pt-2 overflow-y-auto"> 
                  <GuessingInterface
                    tags={availableTags}
                    selectedTags={selectedTags}
                    gameState={gameState}
                    onTagClick={handleTagClick}
                    onReset={resetTag}
                    onCriteriaClick={resetTag}
                    gameData={{ tags: availableTags }}
                    timeElapsed={elapsedTime}
                    onSubmit={handleSubmit}
                  />
                </div>

                <div className="action-container p-3">
                  <ActionButton
                    gameState={gameState}
                    onClick={handleSubmit}
                    disabled={false}
                  />
                </div>
              </div>
            </>
          ) : null}
        </ActionWrapper>
        
        {isFullScreen && currentNFT && (
          <FullScreenImage
            isOpen={isFullScreen}
            src={currentNFT.image_url}
            alt={currentNFT.questions.title}
            onClose={() => setIsFullScreen(false)}
            layoutId={imageLayoutId}
          />
        )}
      </div>
    </>
  )
}

