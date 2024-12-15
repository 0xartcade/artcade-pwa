//////////////////////////////////////////////////////
/// GAME REGISTRY
/// Configuration for available games and modes
//////////////////////////////////////////////////////

/* Game mode configuration that will be served by backend */
export interface GameMode {
  name: string
  description: string
  dataUrl?: string  // Will be replaced by backend API endpoints
}

/* Game type configuration */
export interface GameType {
  name: string
  path: string
}

//////////////////////////////////////////////////////
/// GAME TYPES AND MODES
/// Registry that will be synchronized with backend
//////////////////////////////////////////////////////

/* Available game types */
export const GAME_TYPES: Record<string, GameType> = {
  'know-your-memes': {
    name: 'Know Your Memes',
    path: 'games/kym/game-interface',
  },
} as const

/* Available game modes - will be served by backend */
export const GAME_MODES: Record<string, GameMode> = {
  '6529-collection': {
    name: 'Know Your Memes',
    description: "How well do you know \"The Memes\" by 6529 Collections? You'll be shown 5 random tokens from the collection and asked to guess their season, number of tokens, current floor price, and the artist",
    // TODO: Replace with backend API endpoint
    dataUrl: 'https://noaskfrnx3lefz7r.public.blob.vercel-storage.com/6529-memes-1-302-ICCX18MmBs6NxwL2wMEwJr5xQfH5Bx.json'
  },
  'template-mode': {
    name: 'Template Mode',
    description: 'This is a template for creating new game modes in the 0xArtcade ecosystem. To use, simply add your game to the components/games directory and updates game-registery.ts with the path and game data'
  }
} as const

export type GameTypeId = keyof typeof GAME_TYPES
export type GameModeId = keyof typeof GAME_MODES