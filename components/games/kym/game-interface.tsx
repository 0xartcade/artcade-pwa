"use client";

import { useEffect, useState } from "react";
import { GuessingInterface } from "./guessing-interface";
import { NFTImage } from "./nft-image";
import { ActionButton } from "./action-button";
import { generateGameData } from "./game-utils";
import { fetchGameData } from "@/utils/game-data";
import { GameData as TemplateGameData } from "../game-template/game-types";
import { GameData, Tag, NFTMetadata } from "@/types/game-types";
import { GAME_CONFIG } from "./game-config";
import { ActionWrapper } from "./action-wrapper";
import { FullScreenImage } from "./full-screen-image";
import Head from "next/head";
import { GameTimer } from "./game-timer";
import { StartScreen } from "./start-screen";
import { GameSummary } from "./game-summary";
import { useGameStore } from "./game-mechanics";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingScreen } from "./loading-screen";
import { ACTIVE_GAME } from "@/config/active-game";
import { api } from "@/utils/api";
import { debounce, throttle } from "lodash";
import { ApiResponse } from "@/utils/types";

function transformToFullGameData(data: TemplateGameData): GameData {
  const titles = [...new Set(data.raw_data.map((nft) => nft.questions.title))];
  const supplies = [
    ...new Set(data.raw_data.map((nft) => nft.questions.supply)),
  ];
  const artists = [
    ...new Set(data.raw_data.map((nft) => nft.questions.artist)),
  ];
  const seasons = [
    ...new Set(data.raw_data.map((nft) => nft.questions.season)),
  ];

  return {
    raw_data: data.raw_data,
    titles,
    supplies,
    artists,
    seasons,
  };
}

const staggerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

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
    setGameData,
    setGameState,
  } = useGameStore();

  // Add initial loading state
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [nextRoundData, setNextRoundData] = useState<{
    nft: NFTMetadata | null;
    tags: Tag[];
  } | null>(null);

  // Load initial game data
  useEffect(() => {
    setIsInitialLoading(true);

    fetchGameData(ACTIVE_GAME.mode)
      .then((data: TemplateGameData) => {
        const fullData = transformToFullGameData(data);
        const gameData = generateGameData(fullData);

        // Ensure minimum loading time and data is ready
        setTimeout(() => {
          if (gameData.nft) {
            setGameData(gameData.nft, gameData.tags);
          }
          setIsInitialLoading(false);
        }, 1500);
      })
      .catch((error: Error) => {
        console.error("Failed to fetch game data:", error);
        setIsInitialLoading(false);
      });
  }, [setGameData]);

  // Load new NFT data when moving to next round
  useEffect(() => {
    if (gameState === "playing" && !currentNFT) {
      fetchGameData(ACTIVE_GAME.mode)
        .then((data: TemplateGameData) => {
          const fullData = transformToFullGameData(data);
          const gameData = generateGameData(fullData);
          setGameData(gameData.nft, gameData.tags);
        })
        .catch((error: Error) => {
          console.error("Failed to fetch game data:", error);
        });
    }
  }, [gameState, currentNFT, setGameData]);

  const handleTagClick = (tag: Tag) => {
    selectTag(tag);
  };

  const handleSubmit = async () => {
    if (gameState === "playing") {
      submitRound();
    } else if (gameState === "submitted") {
      setIsLoading(true);

      fetchGameData(ACTIVE_GAME.mode)
        .then((data: TemplateGameData) => {
          const fullData = transformToFullGameData(data);
          const gameData = generateGameData(fullData);
          if (gameData.nft) {
            // Preload the image
            const img = new window.Image();
            img.src = gameData.nft.image_url;
            // Store the data once image is preloaded
            img.onload = () => {
              setNextRoundData({
                nft: gameData.nft,
                tags: gameData.tags,
              });
            };
          }
        })
        .catch((error: Error) => {
          console.error("Failed to fetch game data:", error);
          setIsLoading(false);
        });
    }
  };

  // Handle loading complete with proper state transitions
  const handleLoadComplete = () => {
    if (nextRoundData?.nft) {
      // Ensure clean state transition
      setGameData(nextRoundData.nft, nextRoundData.tags);
      setNextRoundData(null);

      // Small delay before state change for smoother transition
      setTimeout(() => {
        setIsLoading(false);
        if (gameState === "start") {
          startNewGame();
        } else {
          nextRound();
        }
      }, 100);
    }
  };

  const handleTimeout = () => {
    if (gameState === "playing") {
      submitRound();
    }
  };

  const handleStartGame = () => {
    setIsLoading(true);
    setGameState("start"); // Ensure we're in start state for proper loading text

    // Pre-fetch next round data
    fetchGameData(ACTIVE_GAME.mode)
      .then((data: TemplateGameData) => {
        const fullData = transformToFullGameData(data);
        const gameData = generateGameData(fullData);
        if (gameData.nft) {
          // Preload the image
          const img = new window.Image();
          img.src = gameData.nft.image_url;
          // Store the data once image is preloaded
          img.onload = () => {
            setNextRoundData({
              nft: gameData.nft,
              tags: gameData.tags,
            });
          };
        }
      })
      .catch((error: Error) => {
        console.error("Failed to fetch game data:", error);
        setIsLoading(false);
      });
  };

  const [isFullScreen, setIsFullScreen] = useState(false);
  const imageLayoutId = `nft-image-${currentNFT?.token_id}`;

  // Get loading text based on game state and round
  const getLoadingText = () => {
    if (isInitialLoading) return "Game Loading";
    if (gameState === "start") return "Round 1";
    const roundNumber = rounds.length + 1;
    return `Round ${roundNumber}`;
  };

  // Calculate time progress (0 to 1)
  const timeProgress =
    gameState === "playing" ? Math.max(0, 1 - elapsedTime / 30) : 1;

  // Render loading screen immediately if in initial loading state
  if (isInitialLoading) {
    return (
      <div className="relative w-full h-full bg-black">
        <LoadingScreen
          isVisible={true}
          onLoadComplete={() => {}} // No-op during initial load
          text="Game Loading"
        />
      </div>
    );
  }

  // Only check currentNFT after initial loading is complete
  if (!currentNFT && gameState !== "gameSummary") return null;

  return (
    <>
      <Head>
        <meta name="theme-color" content="black" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </Head>
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          {isLoading && (
            <LoadingScreen
              isVisible={true}
              onLoadComplete={handleLoadComplete}
              text={getLoadingText()}
            />
          )}
        </AnimatePresence>

        <ActionWrapper
          selectedColor={null}
          blurhash={currentNFT?.blurhash}
          imageUrl={currentNFT?.image_url}
          gameState={gameState}
          currentNFTId={currentNFT?.token_id}
          timeProgress={timeProgress}
          score={
            gameState === "submitted"
              ? {
                  correct: Object.values(selectedTags).filter(
                    (tag) => tag?.isCorrect
                  ).length,
                  total: GAME_CONFIG.questions.length,
                  answers: GAME_CONFIG.questions.map(
                    (question) => selectedTags[question.id]?.isCorrect ?? false
                  ),
                  timeElapsed: elapsedTime,
                }
              : undefined
          }
        >
          {gameState === "start" ? (
            <StartScreen onStartGame={handleStartGame} />
          ) : gameState === "gameSummary" ? (
            <GameSummary
              summary={{
                rounds,
                totalScore,
                currentRound: rounds.length,
              }}
              onNewGame={handleStartGame}
            />
          ) : currentNFT ? (
            <>
              <motion.div
                custom={0}
                variants={staggerVariants}
                initial="hidden"
                animate="visible"
              >
                <GameTimer
                  isActive={gameState === "playing"}
                  onTimeUpdate={updateTime}
                  onTimeout={handleTimeout}
                  gameState={gameState}
                />
              </motion.div>
              <div className="game-layout bg-transparent">
                <motion.div
                  className="image-area relative w-full h-[48vh] md:h-[54%] overflow-hidden bg-transparent"
                  custom={1}
                  variants={staggerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="absolute inset-0 overflow-hidden bg-transparent">
                    <NFTImage
                      src={currentNFT.image_url}
                      alt={currentNFT.questions.title}
                      onImageClick={() => setIsFullScreen(true)}
                      layoutId={imageLayoutId}
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="guess-container flex-1 flex flex-col overflow-hidden bg-transparent"
                  custom={2}
                  variants={staggerVariants}
                  initial="hidden"
                  animate="visible"
                >
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
                </motion.div>

                <motion.div
                  className="action-container px-3 pt-2 pb-1 min-h-[67px] h-[67px] flex items-center justify-center w-full max-w-md mx-auto bg-transparent"
                  custom={3}
                  variants={staggerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <ActionButton
                    gameState={gameState}
                    onClick={handleSubmit}
                    disabled={false}
                  />
                </motion.div>
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
  );
}
