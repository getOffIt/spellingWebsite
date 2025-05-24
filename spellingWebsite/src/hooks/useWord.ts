import { useContext, useMemo } from 'react'
import { useProgress, WordProgress } from '../contexts/ProgressProvider'
import { ALL_WORDS, Word } from '../data/words'

export function useWord(wordId: string) {
  const { progress, update } = useProgress()
  const word = useMemo(() => ALL_WORDS.find(w => w.id === wordId)!, [wordId])
  const stats = progress[wordId] ?? { status: 'not-started', attempts: 0, streak: 0, lastSeen: null }

  const setStatus = (status: WordProgress['status']) => {
    update(wordId, { status })
  }

  const recordAttempt = (correct: boolean) => {
    const newStreak = correct ? (stats.streak + 1) : 0
    const newStatus = newStreak >= 3 ? 'mastered' : 
                     stats.status === 'not-started' ? 'in-progress' : 
                     stats.status

    update(wordId, {
      attempts: stats.attempts + 1,
      streak: newStreak,
      status: newStatus,
      lastSeen: new Date().toISOString()
    })
  }

  return {
    ...word,
    ...stats,
    setStatus,
    recordAttempt
  }
} 