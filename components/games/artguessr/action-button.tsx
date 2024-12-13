"use client"

import React from 'react'
import { Button } from "@/components/ui/button"

interface ActionButtonProps {
  gameState: string
  onClick: () => void
  disabled?: boolean
}

export function ActionButton({ gameState, onClick, disabled }: ActionButtonProps): React.ReactElement {
  return (
    <Button
      className="w-full min-h-[3rem] py-2 bg-gradient-to-r from-artcade-purple to-artcade-pink hover:from-artcade-purple/80 hover:to-artcade-pink/80 text-white border-2 border-white/20 shadow-lg font-['Orbitron'] font-bold text-lg md:text-sm rounded-2xl retro-button"
      onClick={onClick}
      disabled={disabled}
    >
      {gameState}
    </Button>
  )
}

