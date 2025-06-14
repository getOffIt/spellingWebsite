import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from 'react-oidc-context';
import { getAllProgress, putWordProgress, ProgressData as ApiProgressData } from '../hooks/useProgressApi';

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
  const auth = useAuth();
  const userId = auth.user?.profile?.sub || (auth.isLoading ? null : 'anonymous');
  const storageKey = userId ? `spelling-progress-${userId}` : null;
  const token = auth.user?.access_token;

  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loadingRemote, setLoadingRemote] = useState(true);
  const [pendingApiUpdates, setPendingApiUpdates] = useState<{wordId: string, progress: WordAttempt[]}[]>([]);

  // Load progress from API (and fallback to localStorage) when userId/token is available
  useEffect(() => {
    const loadProgress = async () => {
      if (!storageKey || !token) {
        setProgress({});
        setLoadingRemote(false);
        return;
      }
      setLoadingRemote(true);
      try {
        console.log('[ProgressProvider][GET] token:', token, 'userId:', userId);
        const remote = await getAllProgress(token);
        // Transform array to object keyed by wordId
        const progressByWord: ProgressData = {};
        (remote as any[]).forEach(item => {
          progressByWord[item.wordId] = item.progress;
        });
        setProgress(progressByWord);
        localStorage.setItem(storageKey, JSON.stringify(progressByWord));
      } catch (err) {
        console.error('Failed to load remote progress:', err);
        // Fallback to localStorage if API fails
        try {
          const saved = localStorage.getItem(storageKey);
          setProgress(saved ? JSON.parse(saved) : {});
        } catch (e) {
          setProgress({});
        }
      } finally {
        setLoadingRemote(false);
      }
    };
    loadProgress();
  }, [storageKey, token]);

  // Save progress to localStorage when it changes and userId is available
  useEffect(() => {
    if (storageKey && progress !== null) {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    }
  }, [progress, storageKey]);

  // Utility to always return an array for a wordId
  function safeAttempts(progress: ProgressData, wordId: string) {
    return Array.isArray(progress[wordId]) ? progress[wordId] : [];
  }

  // Add a new attempt for a word and queue API update
  const recordAttempt = (wordId: string, correct: boolean, attempt: string) => {
    setProgress(prev => {
      const updated = {
        ...prev!,
        [wordId]: [
          ...safeAttempts(prev!, wordId),
          { date: new Date().toISOString(), correct, attempt }
        ]
      };
      // Queue the API update instead of calling it directly
      setPendingApiUpdates(queue => [...queue, { wordId, progress: updated[wordId] }]);
      return updated;
    });
  };

  // useEffect to process API updates
  useEffect(() => {
    if (!token || pendingApiUpdates.length === 0) return;
    // Only process the latest update for each wordId
    const latestUpdates = Object.values(
      pendingApiUpdates.reduce((acc, { wordId, progress }) => {
        acc[wordId] = { wordId, progress };
        return acc;
      }, {} as Record<string, { wordId: string, progress: WordAttempt[] }>)
    );
    setPendingApiUpdates([]); // Clear the queue
    latestUpdates.forEach(({ wordId, progress }) => {
      console.log('[ProgressProvider][PUT] token:', token, 'userId:', userId, 'wordId:', wordId);
      putWordProgress(token, wordId, progress).catch(() => {});
    });
  }, [pendingApiUpdates, token]);

  // Compute stats from attempt history
  const getWordStats = (wordId: string): WordStats => {
    const attemptsArr = progress ? safeAttempts(progress, wordId) : [];
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
  };

  if (!storageKey || progress === null || loadingRemote) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }

  return (
    <ProgressContext.Provider value={{ progress, recordAttempt, getWordStats }}>
      {children}
    </ProgressContext.Provider>
  )
} 