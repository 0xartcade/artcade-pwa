import { GameData, NFTMetadata, Tag, Criteria } from '@/types/game-types'

//////////////////////////////////////////////////////
/// GAME UTILITIES
/// Core game logic that will be moved to backend
//////////////////////////////////////////////////////

/* Helper function for random selection - will be handled by backend */
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

/* 
 * Game data generation - will be replaced by:
 * GET /games/know-your-memes/sessions/{sessionId}/rounds/{roundNumber}
 * 
 * The backend will:
 * 1. Select random NFT
 * 2. Generate correct and incorrect options
 * 3. Return formatted round data
 */
export function generateGameData(gameData: GameData): { nft: NFTMetadata; tags: Tag[] } {
  const correctNFT = getRandomItem(gameData.raw_data)
  const timestamp = Date.now()
  
  /* Option generation - will be handled by backend */
  function getIncorrectOptions(correct: string | number, pool: (string | number)[]): (string | number)[] {
    const incorrectPool = pool.filter(item => String(item) !== String(correct))
    return incorrectPool
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
  }

  /* Format helpers - keep in frontend for display consistency */
  function formatSeason(season: string | number): string {
    return `Season ${season}`
  }

  /* Option generation - will be handled by backend */
  const titleOptions = getIncorrectOptions(correctNFT.questions.title, gameData.titles)
  const artistOptions = getIncorrectOptions(correctNFT.questions.artist, gameData.artists)
  const supplyOptions = getIncorrectOptions(correctNFT.questions.supply, gameData.supplies)
  const seasonOptions = getIncorrectOptions(correctNFT.questions.season, gameData.seasons)

  /* Answer mapping - will be handled by backend */
  const correctAnswers = {
    'ART NAME': correctNFT.questions.title,
    'ARTIST NAME': correctNFT.questions.artist,
    'TOTAL SUPPLY': String(correctNFT.questions.supply),
    'SEASON': formatSeason(correctNFT.questions.season)
  }

  /* Tag generation - will be handled by backend */
  const tags: Tag[] = [
    // Correct options
    { 
      id: `art-correct-${timestamp}`, 
      criteria: 'ART NAME' as Criteria, 
      value: correctNFT.questions.title, 
      isCorrect: true,
      correctAnswer: correctAnswers['ART NAME']
    },
    { 
      id: `artist-correct-${timestamp}`, 
      criteria: 'ARTIST NAME' as Criteria, 
      value: correctNFT.questions.artist, 
      isCorrect: true,
      correctAnswer: correctAnswers['ARTIST NAME']
    },
    { 
      id: `supply-correct-${timestamp}`, 
      criteria: 'TOTAL SUPPLY' as Criteria, 
      value: String(correctNFT.questions.supply), 
      isCorrect: true,
      correctAnswer: correctAnswers['TOTAL SUPPLY']
    },
    { 
      id: `season-correct-${timestamp}`, 
      criteria: 'SEASON' as Criteria, 
      value: formatSeason(correctNFT.questions.season), 
      isCorrect: true,
      correctAnswer: correctAnswers['SEASON']
    },
    // Incorrect options
    ...titleOptions.map((value, i) => ({
      id: `art-${i}-${timestamp}`,
      criteria: 'ART NAME' as Criteria,
      value: String(value),
      isCorrect: false,
      correctAnswer: correctAnswers['ART NAME']
    })),
    ...artistOptions.map((value, i) => ({
      id: `artist-${i}-${timestamp}`,
      criteria: 'ARTIST NAME' as Criteria,
      value: String(value),
      isCorrect: false,
      correctAnswer: correctAnswers['ARTIST NAME']
    })),
    ...supplyOptions.map((value, i) => ({
      id: `supply-${i}-${timestamp}`,
      criteria: 'TOTAL SUPPLY' as Criteria,
      value: String(value),
      isCorrect: false,
      correctAnswer: correctAnswers['TOTAL SUPPLY']
    })),
    ...seasonOptions.map((value, i) => ({
      id: `season-${i}-${timestamp}`,
      criteria: 'SEASON' as Criteria,
      value: formatSeason(value),
      isCorrect: false,
      correctAnswer: correctAnswers['SEASON']
    }))
  ].sort(() => Math.random() - 0.5);

  return { nft: correctNFT, tags };
}

//////////////////////////////////////////////////////
/// SCORING LOGIC
/// Will be validated against backend calculations
//////////////////////////////////////////////////////

/* 
 * Score calculation - will be validated by:
 * POST /games/know-your-memes/sessions/{sessionId}/rounds/{roundNumber}/answer
 */
export function calculateScore(correctAnswers: number, timeLeft: number) {
  const basePoints = correctAnswers * 50;
  const timeMultiplier = timeLeft;
  const totalPoints = basePoints * timeMultiplier;
  
  return {
    basePoints,
    timeMultiplier,
    totalPoints
  };
}