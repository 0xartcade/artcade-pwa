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

export interface GameData {
  raw_data: NFTMetadata[]
  titles: string[]
  supplies: number[]
  artists: string[]
  seasons: string[]
}

export type Criteria = 'TOTAL SUPPLY' | 'SEASON' | 'ARTIST NAME' | 'ART NAME'

export interface Tag {
  id: string
  value: string
  criteria: Criteria
  isCorrect?: boolean
  correctAnswer?: string
}

export type GameState = 'start' | 'playing' | 'calculating' | 'submitted' | 'nextRound' | 'gameSummary'

export interface GameScore {
  correct: number
  total: number
  answers: boolean[]
  timeElapsed: number
}

//////////////////////////////////////////////////////
/// ROUND MANAGEMENT
//////////////////////////////////////////////////////

export interface RoundData {
  imageUrl: string
  blurhash: string
  guesses: Record<Criteria, Tag | null>
  score: GameScore
  nftMetadata: NFTMetadata
}

export interface GameSummary {
  rounds: RoundData[]
  totalScore: number
  currentRound: number
}
