import { GameModeId, GAME_MODES } from '@/config/game-registry'
import { GameData } from '../components/games/game-template/game-types'
import { ACTIVE_GAME } from '@/config/active-game'

export async function fetchGameData(mode: GameModeId): Promise<GameData> {

  if (ACTIVE_GAME.type === 'template') {
    return { raw_data: [] }
  }
  
  const dataUrl = GAME_MODES[mode].dataUrl
  if (!dataUrl) {
    throw new Error(`No data URL configured for game mode: ${mode}`)
  }
  
  const response = await fetch(dataUrl)
  return response.json()
}