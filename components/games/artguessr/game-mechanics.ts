import { create } from 'zustand'
import { GameState, GameSummary, RoundData, Tag, Criteria, NFTMetadata, GameScore } from '@/types/game-types'
import { GAME_CONFIG, calculateTickets } from './game-config'

//////////////////////////////////////////////////////
/// GAME STORE TYPES
//////////////////////////////////////////////////////

interface GameStore {
  // Game State
  gameState: GameState
  currentRound: number
  elapsedTime: number
  selectedTags: Record<Criteria, Tag | null>
  showResults: boolean
  
  // Round Data
  rounds: RoundData[]
  totalScore: number
  
  // Current NFT Data
  currentNFT: NFTMetadata | null
  availableTags: Tag[]

  // Actions
  startNewGame: () => void
  submitRound: () => void
  nextRound: () => void
  updateTime: (seconds: number) => void
  selectTag: (tag: Tag) => void
  resetTag: (criteria: Criteria) => void
  setGameData: (nft: NFTMetadata, tags: Tag[]) => void
  setShowResults: (show: boolean) => void
}

//////////////////////////////////////////////////////
/// GAME MECHANICS
//////////////////////////////////////////////////////

const ROUNDS_PER_GAME = 5
const CALCULATION_DURATION = 2000 // Time to show "Calculating" state

const calculateRoundScore = (selectedTags: Record<Criteria, Tag | null>, timeElapsed: number): GameScore => {
  return {
    correct: Object.values(selectedTags).filter((tag) => tag?.isCorrect).length,
    total: GAME_CONFIG.questions.length,
    answers: GAME_CONFIG.questions.map(question => 
      selectedTags[question.id]?.isCorrect ?? false
    ),
    timeElapsed
  }
}

const createRoundData = (
  nft: NFTMetadata,
  selectedTags: Record<Criteria, Tag | null>,
  timeElapsed: number
): RoundData => {
  return {
    imageUrl: nft.image_url,
    blurhash: nft.blurhash,
    guesses: { ...selectedTags },
    score: calculateRoundScore(selectedTags, timeElapsed),
    nftMetadata: { ...nft }
  }
}

//////////////////////////////////////////////////////
/// GAME STORE
//////////////////////////////////////////////////////

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial State
  gameState: 'start',
  currentRound: 0,
  elapsedTime: 0,
  selectedTags: Object.fromEntries(
    GAME_CONFIG.questions.map(q => [q.id, null])
  ) as Record<Criteria, Tag | null>,
  showResults: false,
  rounds: [],
  totalScore: 0,
  currentNFT: null,
  availableTags: [],

  // Actions
  startNewGame: () => set({
    gameState: 'playing',
    currentRound: 0,
    elapsedTime: 0,
    selectedTags: Object.fromEntries(
      GAME_CONFIG.questions.map(q => [q.id, null])
    ) as Record<Criteria, Tag | null>,
    showResults: false,
    rounds: [],
    totalScore: 0
  }),

  submitRound: () => {
    const { currentNFT, selectedTags, elapsedTime, rounds } = get()
    if (!currentNFT) return

    // 1. Set initial calculating state
    set({ gameState: 'calculating', showResults: false })

    const roundData = createRoundData(currentNFT, selectedTags, elapsedTime)
    const newRounds = [...rounds, roundData]
    const newTotalScore = newRounds.reduce((total, round) => 
      total + (round.score.correct * 50), 0
    )

    // 2. Update round data and calculate tickets
    set({
      rounds: newRounds,
      totalScore: newTotalScore,
    })

    // 3. Show score after calculation animation
    setTimeout(() => {
      set({ 
        gameState: newRounds.length >= ROUNDS_PER_GAME ? 'gameSummary' : 'submitted',
        showResults: true 
      })
    }, CALCULATION_DURATION)
  },

  nextRound: () => {
    const { currentRound } = get()
    set({
      gameState: 'playing',
      currentRound: currentRound + 1,
      elapsedTime: 0,
      selectedTags: Object.fromEntries(
        GAME_CONFIG.questions.map(q => [q.id, null])
      ) as Record<Criteria, Tag | null>,
      showResults: false,
      currentNFT: null
    })
  },

  updateTime: (seconds: number) => set({
    elapsedTime: seconds
  }),

  selectTag: (tag: Tag) => set(state => ({
    selectedTags: {
      ...state.selectedTags,
      [tag.criteria]: tag
    }
  })),

  resetTag: (criteria: Criteria) => set(state => ({
    selectedTags: {
      ...state.selectedTags,
      [criteria]: null
    }
  })),

  setGameData: (nft: NFTMetadata, tags: Tag[]) => set({
    currentNFT: nft,
    availableTags: tags
  }),

  setShowResults: (show: boolean) => set({
    showResults: show
  })
})) 