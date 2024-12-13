import { GameData, NFTMetadata, Tag, Criteria } from '@/types/game-types'

export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function generateGameData(gameData: GameData): { nft: NFTMetadata; tags: Tag[] } {
  const correctNFT = getRandomItem(gameData.raw_data)
  const timestamp = Date.now()
  
  function getIncorrectOptions(correct: string | number, pool: (string | number)[]): (string | number)[] {
    const incorrectPool = pool.filter(item => String(item) !== String(correct))
    return incorrectPool
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
  }

  function formatSeason(season: string | number): string {
    return `Season ${season}`
  }

  const titleOptions = getIncorrectOptions(correctNFT.questions.title, gameData.titles)
  const artistOptions = getIncorrectOptions(correctNFT.questions.artist, gameData.artists)
  const supplyOptions = getIncorrectOptions(correctNFT.questions.supply, gameData.supplies)
  const seasonOptions = getIncorrectOptions(correctNFT.questions.season, gameData.seasons)

  const correctAnswers = {
    'ART NAME': correctNFT.questions.title,
    'ARTIST NAME': correctNFT.questions.artist,
    'TOTAL SUPPLY': String(correctNFT.questions.supply),
    'SEASON': formatSeason(correctNFT.questions.season)
  }

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