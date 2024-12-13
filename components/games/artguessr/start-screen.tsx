"use client"

interface StartScreenProps {
  onStartGame: () => void
}

export function StartScreen({ onStartGame }: StartScreenProps) {
  return (
    <div className="game-layout">
      <div className="flex-1 flex items-center justify-center">
        <div className="action-container p-3 w-full max-w-xs">
          <button
            className="w-full h-full bg-gradient-to-r from-artcade-purple to-artcade-pink hover:from-artcade-purple/80 hover:to-artcade-pink/80 text-white border-2 border-white/20 shadow-lg font-['Orbitron'] font-bold text-lg md:text-sm rounded-2xl retro-button py-4"
            onClick={onStartGame}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  )
} 