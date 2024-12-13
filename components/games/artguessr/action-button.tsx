"use client"

import { Button } from "@/components/ui/button"

interface ActionButtonProps {
  gameState: 'playing' | 'submitted' | 'nextRound'
  onClick: () => void
  disabled: boolean
}

export function ActionButton({ gameState, onClick, disabled }: ActionButtonProps): JSX.Element {
  return (
    <Button
      className="w-full h-full bg-gradient-to-r from-artcade-purple to-artcade-pink hover:from-artcade-purple/80 hover:to-artcade-pink/80 text-white border-2 border-white/20 shadow-lg font-['Orbitron'] font-bold text-lg md:text-sm rounded-2xl retro-button"
      onClick={onClick}
      disabled={disabled}
    >
      {gameState === 'playing' ? 'Submit Guess' : 'Next Round'}
    </Button>
  )
}

