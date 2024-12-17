//////////////////////////////////////////////////////
/// NFT METADATA
/// Data structure that will come from backend API
//////////////////////////////////////////////////////

export interface NFTMetadata {
  collection: string
  contract_address: string
  token_id: number
  questions: {
    title: string
    artist: string
    supply: number
    season: string
  }
  image_url: string
  blurhash: string
  predominant_color: string
}

//////////////////////////////////////////////////////
/// GAME DATA TYPES
/// Core data structures that will be served by backend
//////////////////////////////////////////////////////

export interface GameData {
  raw_data: NFTMetadata[]
  titles: string[]
  supplies: number[]
  artists: string[]
  seasons: string[]
}

/* Core game criteria that will be validated by backend */
export type Criteria = 'TOTAL SUPPLY' | 'SEASON' | 'ARTIST NAME' | 'ART NAME'

/* Tag structure for answer validation */
export interface Tag {
  id: string
  value: string
  criteria: Criteria
  isCorrect?: boolean
  correctAnswer?: string
}

/* Game state machine states */
export type GameState = 'start' | 'playing' | 'calculating' | 'submitted' | 'nextRound' | 'gameSummary'

/* Score data that will be validated by backend */
export interface GameScore {
  correct: number
  total: number
  answers: boolean[]
  timeElapsed: number
}

//////////////////////////////////////////////////////
/// ROUND MANAGEMENT
/// Round data structures that will sync with backend
//////////////////////////////////////////////////////

/* Round data that will be received from backend */
export interface RoundData {
  imageUrl: string
  blurhash: string
  guesses: Record<Criteria, Tag | null>
  score: GameScore
  nftMetadata: NFTMetadata
}

/* Game summary that will be synced with backend */
export interface GameSummary {
  rounds: RoundData[]
  totalScore: number
  currentRound: number
}
