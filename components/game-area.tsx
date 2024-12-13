import { GAME_TYPES } from '@/config/game-registry'
import { ACTIVE_GAME } from '@/config/active-game'
import dynamic from 'next/dynamic'

export function GameArea() {
  const activeGameType = GAME_TYPES[ACTIVE_GAME.type];
  
  const GameComponent = dynamic(() => import(`@/components/${activeGameType.path}`), {
    loading: () => <div className="w-full h-full bg-black" />
  })

  return (
    <div className="w-full h-full">
      <GameComponent />
    </div>
  )
}

