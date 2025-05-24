import React, { createContext, useContext, useState, useEffect } from 'react'

export type WordProgress = {
  status: 'not-started' | 'in-progress' | 'mastered'
  attempts: number
  streak: number
  lastSeen: string | null
}

interface ProgressContext {
  progress: Record<string, WordProgress>
  update(wordId: string, delta: Partial<WordProgress>): void
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
  const [progress, setProgress] = useState<Record<string, WordProgress>>(() => {
    const saved = localStorage.getItem('spelling-progress')
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    localStorage.setItem('spelling-progress', JSON.stringify(progress))
  }, [progress])

  const update = (wordId: string, delta: Partial<WordProgress>) => {
    setProgress(prev => ({
      ...prev,
      [wordId]: {
        ...(prev[wordId] ?? { status: 'not-started', attempts: 0, streak: 0, lastSeen: null }),
        ...delta
      }
    }))
  }

  return (
    <ProgressContext.Provider value={{ progress, update }}>
      {children}
    </ProgressContext.Provider>
  )
} 