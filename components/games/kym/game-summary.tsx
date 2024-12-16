"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { RoundData, GameSummary as GameSummaryType } from "@/types/game-types";
import { GAME_CONFIG, calculateTickets } from "./game-config";
import React, { useEffect } from "react";

interface GameSummaryProps {
  summary: GameSummaryType;
  onNewGame: () => void;
}

//////////////////////////////////////////////////////
/// ROUND SUMMARY CARD
//////////////////////////////////////////////////////

interface RoundSummaryCardProps {
  round: RoundData;
  index: number;
}

const RoundSummaryCard = ({ round, index }: RoundSummaryCardProps) => {
  return (
    <motion.div
      className="rounded-xl overflow-hidden relative bg-black/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={round.imageUrl}
          alt=""
          fill
          className="object-cover blur-sm opacity-100"
          quality={1}
        />
      </div>

      <div className="flex h-20 relative">
        {/* Image Container with padding */}
        <div className="p-2 shrink-0">
          {/* Image wrapper */}
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden">
            <Image
              src={round.imageUrl}
              alt={round.nftMetadata.questions.title}
              fill
              className="object-cover"
              placeholder={round.blurhash ? "blur" : undefined}
              blurDataURL={round.blurhash}
              sizes="60px"
            />
          </div>
        </div>

        {/* Guesses Grid */}
        <div className="flex-1 grid grid-cols-2 gap-x-3 gap-y-1 p-2">
          {GAME_CONFIG.questions.map((question) => {
            const guess = round.guesses[question.id];
            const isCorrect = guess?.isCorrect;

            return (
              <div key={question.id} className="text-sm flex items-center">
                <div
                  className={`
                  flex-1 truncate font-medium
                  ${isCorrect ? "text-green-400" : "text-red-400"}
                `}
                >
                  {guess?.value || "No guess"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Score */}
        <div className="w-14 h-full flex flex-col items-center justify-center bg-black/60 text-md font-medium">
          <div>{round.score.correct * 50 * (30 - round.score.timeElapsed)}</div>
          <div className="text-[10px] text-white/50">pts</div>
        </div>
      </div>
    </motion.div>
  );
};

//////////////////////////////////////////////////////
/// GAME SUMMARY SCREEN
//////////////////////////////////////////////////////

export function GameSummary({
  summary,
  onNewGame,
}: GameSummaryProps): React.ReactElement {
  const earnedTickets = calculateTickets(summary.totalScore);
  const { maxTicketsPerGame, maxScore } = GAME_CONFIG.gameSettings;
  const STATIC_BG = "/images/bg_game_6529.JPEG";

  return (
    <div className="game-layout">
      {/* Static background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
        >
          <Image
            src={STATIC_BG}
            alt="Background"
            fill
            className="object-cover blur-2xl scale-[1.2] brightness-90 hue-rotate-15"
            quality={1}
            priority
          />
        </motion.div>
        <div className="absolute inset-0 pointer-events-none bg-black/20" />
        <div className="absolute inset-0 pointer-events-none bg-blue-900/10" />
      </div>

      <div className="relative flex-1 flex flex-col p-4 px-2 -mt-8 overflow-y-auto z-10">
        {/* Title */}
        <motion.h1
          className="text-2xl font-orbitron text-center mb-5 mt-10 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Game Summary
        </motion.h1>

        {/* Rounds */}
        <div className="space-y-2 mb-5 px-1">
          {summary.rounds.map((round, index) => (
            <RoundSummaryCard key={index} round={round} index={index} />
          ))}
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          {/* Total Score */}
          <motion.div
            className="rounded-xl relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Darker background */}
            <div className="absolute inset-0 -z-10 bg-black/60" />
            <div className="p-4">
              <div className="text-white/70 text-sm mb-2">Total Score</div>
              <div className="flex flex-col">
                <div className="text-4xl font-['Orbitron'] bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  {summary.totalScore}
                </div>
                <div className="text-2xl font-['Orbitron'] bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                  PTS
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tickets */}
          <motion.div
            className="rounded-xl relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Darker background */}
            <div className="absolute inset-0 -z-10 bg-black/60" />
            <div className="p-4">
              <div className="text-white/70 text-sm mb-2">
                Estimated Tickets
              </div>
              <div className="flex flex-col">
                <div className="text-4xl font-['Orbitron'] bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">
                  {earnedTickets}
                </div>
                <div className="text-2xl font-['Orbitron'] bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">
                  TICKETS
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Play Again Button */}
        <div className="action-container px-3 pt-3 pb-1 min-h-[75px] h-[75px] flex items-center justify-center w-full max-w-md mx-auto">
          <motion.button
            className={`
              w-full h-full bg-gradient-to-r from-artcade-purple to-artcade-pink hover:from-artcade-purple/80 hover:to-artcade-pink/80
              text-white border-2 border-white/20 shadow-lg 
              font-['Orbitron'] font-bold text-lg md:text-sm 
              rounded-2xl retro-button
            `}
            onClick={onNewGame}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            PLAY AGAIN
          </motion.button>
        </div>
      </div>
    </div>
  );
}
