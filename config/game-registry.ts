// First define the interfaces
export interface GameMode {
  name: string
  description: string
  dataUrl?: string
}

export interface GameType {
  name: string
  path: string
  poweredBy: string
}

// Then define the constants with their types
export const GAME_TYPES: Record<string, GameType> = {
    'artguessr': {
      name: 'ArtGuessr',
      path: 'games/artguessr/game-interface',
      poweredBy: 'ArtGuessr'
    },
    'template': {
      name: 'Game Template',
      path: 'games/game-template/game-interface',
      poweredBy: 'Template Provider'
    }
  } as const
  
export const GAME_MODES: Record<string, GameMode> = {
    '6529-collection': {
      name: 'Know Your Memes',
      description: "How well do you know \"The Memes\" by 6529 Collections? You'll be shown 5 random tokens from the collection and asked to guess their season, number of tokens, current floor price, and the artist",
      dataUrl: 'https://noaskfrnx3lefz7r.public.blob.vercel-storage.com/6529-memes-1-302-ICCX18MmBs6NxwL2wMEwJr5xQfH5Bx.json'
    },
    'template-mode': {
      name: 'Template Mode',
      description: 'This is a template for creating new game modes in the 0xArtcade ecosystem. To use, simply add your game to the components/games directory and updates game-registery.ts with the path and game data'
    }
  } as const
  
// Type helpers
export type GameTypeId = keyof typeof GAME_TYPES
export type GameModeId = keyof typeof GAME_MODES