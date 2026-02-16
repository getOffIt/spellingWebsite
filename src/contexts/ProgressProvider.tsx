import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from 'react-oidc-context';
import { getAllProgress, putWordProgress, ProgressData as ApiProgressData } from '../hooks/useProgressApi';
import { getMasteryThreshold } from '../config/masteryThresholds';

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
  recordAttempt(wordId: string, correct: boolean, attempt: string): Promise<void>;
  getWordStats(wordId: string): WordStats;
  refreshProgress(): Promise<void>;
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
  const auth = useAuth();
  const userId = auth.user?.profile?.sub || (auth.isLoading ? null : 'anonymous');
  const token = auth.user?.access_token;

  const [progress, setProgress] = useState<ProgressData>({});
  const [loading, setLoading] = useState(true);

  // Load progress from API when userId/token is available
  const refreshProgress = async () => {
    if (!token) {
      setProgress({});
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const remote = await getAllProgress(token);
      // Transform array to object keyed by wordId
      const progressByWord: ProgressData = {};
      (remote as any[]).forEach(item => {
        progressByWord[item.wordId] = item.progress;
      });
      setProgress(progressByWord);
    } catch (err) {
      console.error('Failed to load remote progress:', err);
      setProgress({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProgress();
  }, [token]);

  // Add a new attempt for a word and refresh from API
  const recordAttempt = async (wordId: string, correct: boolean, attempt: string) => {
    if (!token) {
      return;
    }

    const newAttempt = { date: new Date().toISOString(), correct, attempt };

    try {
      // Send the new attempt to the API and get back the complete progress
      const completeProgress = await putWordProgress(token, wordId, [newAttempt]);

      // Transform the returned array to object keyed by wordId
      const progressByWord: ProgressData = {};
      (completeProgress as any[]).forEach(item => {
        progressByWord[item.wordId] = item.progress;
      });

      // Update the local state with the complete progress from the API
      setProgress(progressByWord);
    } catch (err) {
      console.error('[ProgressProvider] Failed to record attempt:', err);
      // Optionally show an error message to the user
    }
  };

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

    const threshold = getMasteryThreshold(wordId);
    let status: WordStats['status'] = 'not-started';
    if (attemptsArr.length > 0) status = 'in-progress';
    if (streak >= threshold) status = 'mastered';

    return {
      status,
      attempts: attemptsArr.length,
      streak,
      lastSeen
    };
  };

  if (!userId || loading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }

  return (
    <ProgressContext.Provider value={{ progress, recordAttempt, getWordStats, refreshProgress }}>
      {children}
    </ProgressContext.Provider>
  )
} 