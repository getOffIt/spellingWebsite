import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SpellingTest.css';
import PracticePage from './PracticePage';
import SpellingResults from './SpellingResults';
import FullTestResults from './FullTestResults';
import CongratulationsPage from './CongratulationsPage';
import { useWord } from '../hooks/useWord';
import { useProgress } from '../contexts/ProgressProvider';
import { VoiceService } from '../services/VoiceService';
import { getMasteryThreshold } from '../config/masteryThresholds';

interface Word {
  word: string;
  sentence?: string; // Optional sentence for now, can be added later
}

const voiceService = new VoiceService();

async function speak(text: string) {
  try {
    await voiceService.speak(text);
  } catch (error) {
    console.warn('Voice playback failed:', error);
  }
}

// Helper to derive base word from '-less' word
function getBaseWord(word: string): string {
  if (word.toLowerCase().endsWith('less')) {
    return word.slice(0, -4);
  }
  return word;
}

interface SpellingTestProps {
  words: string[];
  listType: 'single' | 'less_family';
  testMode?: 'practice' | 'full_test';
  passThreshold?: number;
  onComplete: () => void;
}

export default function SpellingTest({ words, listType, testMode = 'practice', passThreshold, onComplete }: SpellingTestProps) {
  const navigate = useNavigate();
  // If listType is 'less_family', generate base words
  const baseWords = listType === 'less_family' ? words.map(word => getBaseWord(word)) : [];

  // Build hook maps at the top level
  const wordHooks = words.reduce((acc, word) => {
    acc[word] = useWord(word);
    return acc;
  }, {} as Record<string, ReturnType<typeof useWord>>);

  const baseWordHooks = baseWords.reduce((acc, word) => {
    acc[word] = useWord(word);
    return acc;
  }, {} as Record<string, ReturnType<typeof useWord>>);

  const [currentStage, setCurrentStage] = useState<'base' | 'full'>(listType === 'less_family' ? 'base' : 'full');
  
  // Determine the actual words for the current stage
  const wordsForCurrentStage = currentStage === 'base' ? baseWords : words;

  const [step, setStep] = useState(0);
  // Initialize answers based on the words for the initial stage
  const [answers, setAnswers] = useState<string[]>(Array(wordsForCurrentStage.length).fill(''));
  const [showResults, setShowResults] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  // New state to control speaking
  const [wordToUtter, setWordToUtter] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [skipEnabled, setSkipEnabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Streak indicator state
  interface StreakInfo {
    streak: number;
    threshold: number;
    isCorrect: boolean;
  }
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);
  const pendingAdvanceRef = useRef<(() => void) | null>(null);
  const streakTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const executeAdvance = () => {
    if (streakTimerRef.current) {
      clearTimeout(streakTimerRef.current);
      streakTimerRef.current = null;
    }
    const action = pendingAdvanceRef.current;
    pendingAdvanceRef.current = null;
    setStreakInfo(null);
    if (action) action();
  };

  // Check if the words for the current stage are all correct
  const areCurrentStageWordsCorrect = answers.every((ans, idx) => 
    ans.trim().toLowerCase() === wordsForCurrentStage[idx].toLowerCase()
  );

  // Effect for speaking the word when wordToUtter changes
  useEffect(() => {
    if (wordToUtter) {
      speak(wordToUtter);
      setWordToUtter(null);
    }
  }, [wordToUtter]);

  // Effect to set the word to utter when step or showResults changes
  useEffect(() => {
    if (!showResults && wordsForCurrentStage.length > 0) {
      setWordToUtter(prev => {
        if (prev !== wordsForCurrentStage[step]) {
          return wordsForCurrentStage[step];
        }
        return prev;
      });
    }
    // Only run when step or showResults changes
    // eslint-disable-next-line
  }, [step, showResults]);

  // Effect to manage skip button timer
  useEffect(() => {
    setSkipEnabled(false);
    const timer = setTimeout(() => {
      setSkipEnabled(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [step, currentStage]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[step] = e.target.value;
    setAnswers(newAnswers);
  };

  const advanceToNextWord = (userAttempt: string) => {
    const currentWord = wordsForCurrentStage[step];
    const isCorrect = userAttempt.trim().toLowerCase() === currentWord.toLowerCase();
    const hook = (currentStage === 'base' && listType === 'less_family')
      ? baseWordHooks[currentWord]
      : wordHooks[currentWord];
    hook.recordAttempt(currentWord, isCorrect, userAttempt);

    // Compute new streak locally (recordAttempt is async, can't wait for state update)
    const newStreak = isCorrect ? hook.streak + 1 : 0;
    const threshold = getMasteryThreshold(currentWord);

    // Capture all values needed for the advance action
    const capturedStep = step;
    const capturedStage = currentStage;
    const capturedAreCorrect = areCurrentStageWordsCorrect;
    const capturedWordsLength = wordsForCurrentStage.length;

    const doAdvance = () => {
      if (capturedStep === capturedWordsLength - 1) {
        if (capturedStage === 'base' && listType === 'less_family') {
          if (testMode === 'full_test') {
            setCurrentStage('full');
            setStep(0);
            setAnswers(Array(words.length).fill(''));
          } else if (capturedAreCorrect) {
            setCurrentStage('full');
            setStep(0);
            setAnswers(Array(words.length).fill(''));
          } else {
            setShowResults(true);
          }
        } else {
          if (capturedAreCorrect) {
            if (testMode === 'full_test') {
              setShowResults(true);
            } else {
              setDone(true);
            }
          } else {
            setShowResults(true);
          }
        }
      } else {
        setStep(capturedStep + 1);
      }
    };

    // Show streak indicator, then auto-advance after 1.5s
    pendingAdvanceRef.current = doAdvance;
    setStreakInfo({ streak: newStreak, threshold, isCorrect });
    streakTimerRef.current = setTimeout(executeAdvance, 1500);
  };

  const handleNext = () => {
    advanceToNextWord(answers[step]);
  };

  const handleSkip = () => {
    const userAttempt = answers[step] || '[skipped]';
    advanceToNextWord(userAttempt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && answers[step]) {
      handleNext();
    }
  };

  const handleRetry = () => {
    // Reset everything to the beginning of the test
    setCurrentStage(listType === 'less_family' ? 'base' : 'full');
    setStep(0);
    // Re-initialize answers based on the initial stage's words
    const initialStageWords = listType === 'less_family' ? baseWords : words;
    setAnswers(Array(initialStageWords.length).fill(''));
    setShowResults(false);
    setShowPractice(false);
    // The useEffect triggered by currentStage/step change will set the first word to utter
  };

  // Determine which words to show on the results/practice page
  const wordsForResultsOrPractice = listType === 'less_family' && currentStage === 'base' ? baseWords : words;
  const answersForResultsOrPractice = answers; // Answers are always for the last completed stage

  // Scroll input into view on focus (for iPad/mobile)
  const handleInputFocus = () => {
    setTimeout(() => {
      inputContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200); // Delay to allow keyboard to open
  };

  if (done) {
    return <CongratulationsPage onComplete={onComplete} />;
  }

  if (showPractice && testMode === 'practice') {
    // Filter incorrect words from the completed stage
    const incorrectWords = wordsForResultsOrPractice.filter((word, idx) =>
      answersForResultsOrPractice[idx].trim().toLowerCase() !== word.toLowerCase()
    );

    return <PracticePage 
      words={incorrectWords} 
      onComplete={onComplete}
    />;
  }

  if (showResults) {
    // For results, always show the comparison against the final word list (full words if less_family, otherwise the single list)
    const wordsForSpellingResults = listType === 'less_family' ? words : wordsForCurrentStage;

    // For full_test mode, use the new FullTestResults component
    if (testMode === 'full_test') {
      return (
        <FullTestResults
          words={wordsForSpellingResults.map(word => ({ word, sentence: '' }))}
          answers={answersForResultsOrPractice}
          onRetry={handleRetry}
          onComplete={onComplete}
          listType={listType}
          isBaseStageResults={listType === 'less_family' && currentStage === 'base'}
          passThreshold={passThreshold}
        />
      );
    }

    // For practice mode, use existing SpellingResults
    return (
      <SpellingResults
        words={wordsForSpellingResults.map(word => ({ word, sentence: '' }))}
        answers={answersForResultsOrPractice}
        onPractice={() => setShowPractice(true)}
        onRetry={handleRetry}
        listType={listType}
        isBaseStageResults={listType === 'less_family' && currentStage === 'base'}
      />
    );
  }

  const currentWord = wordsForCurrentStage[step];

  // Get current word's existing streak for inline display (before any new attempt)
  const currentWordHook = (currentStage === 'base' && listType === 'less_family')
    ? baseWordHooks[currentWord]
    : wordHooks[currentWord];
  const currentStreak = currentWordHook?.streak ?? 0;
  const currentThreshold = getMasteryThreshold(currentWord);

  return (
    <div className="spelling-test-container" style={{ minHeight: '100vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <h2 className="spelling-title">🚀 Spelling Test 🚀</h2>
      <div className="spelling-progress">
        {currentStage === 'base' ? 'Base Words' : 'Full Words'} - Word {step + 1} of {wordsForCurrentStage.length}
      </div>
      <button className="spelling-listen-btn" onClick={() => speak(currentWord)}>
        🔊 Listen to the word
      </button>

      {/* Inline streak indicator */}
      {streakInfo ? (
        <div className={`streak-inline ${streakInfo.isCorrect ? 'correct' : 'wrong'}${streakInfo.streak >= streakInfo.threshold ? ' mastered' : ''}`} onClick={executeAdvance}>
          <div className="streak-circles">
            {Array.from({ length: streakInfo.threshold }, (_, i) => (
              <span key={i} className={i < streakInfo.streak ? 'streak-circle filled' : 'streak-circle empty'}>●</span>
            ))}
          </div>
          {streakInfo.streak >= streakInfo.threshold ? (
            <div className="streak-label">Mastered! 🎉</div>
          ) : streakInfo.isCorrect ? (
            <div className="streak-label">{streakInfo.streak}/{streakInfo.threshold} correct in a row!</div>
          ) : (
            <div className="streak-label">Try again 💪 {streakInfo.streak}/{streakInfo.threshold}</div>
          )}
        </div>
      ) : currentStreak > 0 && currentWordHook?.status !== 'mastered' ? (
        <div className="streak-inline current">
          <div className="streak-circles">
            {Array.from({ length: currentThreshold }, (_, i) => (
              <span key={i} className={i < currentStreak ? 'streak-circle filled' : 'streak-circle empty'}>●</span>
            ))}
          </div>
          <div className="streak-label">{currentStreak}/{currentThreshold}</div>
        </div>
      ) : null}

      <div ref={inputContainerRef}>
        <input
          ref={inputRef}
          className="spelling-input"
          type="text"
          value={answers[step]}
          onChange={handleInput}
          placeholder="Type the word here"
          autoFocus
          onKeyDown={handleKeyDown}
          autoComplete="new-password"
          spellCheck={false}
          inputMode="text"
          autoCapitalize="off"
          autoCorrect="off"
          onFocus={handleInputFocus}
        />
      </div>
      <button className="spelling-btn" onClick={handleNext} disabled={!answers[step]}>
        {step === wordsForCurrentStage.length - 1 ? (currentStage === 'base' && listType === 'less_family' ? 'Next Stage' : 'See Results') : 'Next'}
      </button>
      <button className="spelling-skip-btn" onClick={handleSkip} disabled={!skipEnabled}>
        Skip
      </button>
    </div>
  );
} 