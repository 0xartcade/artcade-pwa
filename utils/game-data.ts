import { GameModeId, GAME_MODES } from '@/config/game-registry'
import { GameData } from '../components/games/game-template/game-types'
import { ACTIVE_GAME } from '@/config/active-game'

//////////////////////////////////////////////////////
/// DATA FETCHING LAYER
/// This module will be replaced by Python backend API calls
//////////////////////////////////////////////////////

/* 
 * This function will be replaced by API calls to:
 * GET /games/know-your-memes/sessions/{sessionId}/rounds/{roundNumber}
 */
export async function fetchGameData(mode: GameModeId): Promise<GameData> {
  if (ACTIVE_GAME.type === 'template') {
    return { raw_data: [] }
  }
  
  // TODO: Replace with API integration
  const dataUrl = GAME_MODES[mode].dataUrl
  if (!dataUrl) {
    throw new Error(`No data URL configured for game mode: ${mode}`)
  }
  
  const response = await fetch(dataUrl)
  return response.json()
}