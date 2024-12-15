//////////////////////////////////////////////////////
/// GAME CONFIGURATION
/// These settings will need to be synchronized with backend
//////////////////////////////////////////////////////

export const GAME_CONFIG = {
    questions: [
      {
        id: 'TOTAL SUPPLY',
        label: 'Total Supply',
        color: 'var(--artcade-aqua-faded)',
        dataField: 'supply',
        answersField: 'supplies'
      },
      {
        id: 'SEASON',
        label: 'Season',
        color: 'var(--artcade-pink-faded)',
        dataField: 'season',
        answersField: 'seasons'
      },
      {
        id: 'ARTIST NAME',
        label: 'Artist Name',
        color: 'var(--artcade-tangerine-faded)',
        dataField: 'artist',
        answersField: 'artists'
      },
      {
        id: 'ART NAME',
        label: 'Art Name',
        color: 'var(--artcade-yellow-faded)',
        dataField: 'title',
        answersField: 'titles'
      }
    ],
    
    animations: {
      submit: {
        duration: 2.5,
        gridDelay: 2.0,
        answerRevealDelay: 2.0,
        answerStaggerDelay: 0.1,
      }
    },

    gameSettings: {
      maxTicketsPerGame: 25,
      maxScore: 1000, // 5 rounds * 4 correct answers * 50 points
      roundsPerGame: 5,
      pointsPerCorrectAnswer: 50
    }
  } as const
  
  export type Question = typeof GAME_CONFIG.questions[number]
  export type QuestionId = Question['id']
  
  // Helper functions
  export function getQuestionColor(id: QuestionId): string {
    return GAME_CONFIG.questions.find(q => q.id === id)?.color || '#000000'
  }
  
  export function getQuestionLabel(id: QuestionId): string {
    return GAME_CONFIG.questions.find(q => q.id === id)?.label || id
  }

  export function calculateTickets(score: number): number {
    const { maxTicketsPerGame, maxScore } = GAME_CONFIG.gameSettings
    return Math.round(maxTicketsPerGame * score / maxScore)
  }