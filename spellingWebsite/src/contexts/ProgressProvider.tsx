import React, { createContext, useContext, useState, useEffect } from 'react'

// Each attempt is stored with date, correctness, and the user's attempt
export type WordAttempt = {
  date: string;
  correct: boolean;
  attempt: string;
};

// The progress data is now a map from wordId to an array of attempts
export type ProgressData = Record<string, WordAttempt[]>;

interface WordStats {
  status: 'not-started' | 'in-progress' | 'mastered';
  attempts: number;
  streak: number;
  lastSeen: string | null;
}

interface ProgressContext {
  progress: ProgressData;
  recordAttempt(wordId: string, correct: boolean, attempt: string): void;
  getWordStats(wordId: string): WordStats;
}

const ProgressContext = createContext<ProgressContext | null>(null)

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressData>(() => {
    const saved = localStorage.getItem('spelling-progress')
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    localStorage.setItem('spelling-progress', JSON.stringify(progress))
  }, [progress])

  // Add a new attempt for a word
  const recordAttempt = (wordId: string, correct: boolean, attempt: string) => {
    setProgress(prev => ({
      ...prev,
      [wordId]: [
        ...(prev[wordId] || []),
        { date: new Date().toISOString(), correct, attempt }
      ]
    }))
  }

  // Compute stats from attempt history
  const getWordStats = (wordId: string): WordStats => {
    const attemptsArr = progress[wordId] || [];
    let streak = 0;
    let lastSeen: string | null = null;
    // Calculate streak (consecutive correct answers from the end)
    for (let i = attemptsArr.length - 1; i >= 0; i--) {
      if (attemptsArr[i].correct) streak++;
      else break;
    }
    if (attemptsArr.length > 0) {
      lastSeen = attemptsArr[attemptsArr.length - 1].date;
    }
    let status: WordStats['status'] = 'not-started';
    if (attemptsArr.length > 0) status = 'in-progress';
    if (streak >= 3) status = 'mastered';
    return {
      status,
      attempts: attemptsArr.length,
      streak,
      lastSeen
    };
  }

  return (
    <ProgressContext.Provider value={{ progress, recordAttempt, getWordStats }}>
      {children}
    </ProgressContext.Provider>
  )
} 