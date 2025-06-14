import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SpellingTest.css';
import PracticePage from './PracticePage';
import SpellingResults from './SpellingResults';
import CongratulationsPage from './CongratulationsPage';
import { useWord } from '../hooks/useWord';
import { useProgress } from '../contexts/ProgressProvider';

interface Word {
  word: string;
  sentence?: string; // Optional sentence for now, can be added later
}

function speak(text: string) {
  window.speechSynthesis.cancel(); // Stop any ongoing speech
  const utterance = new window.SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
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
  onComplete: () => void;
}

export default function SpellingTest({ words, listType, onComplete }: SpellingTestProps) {
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

  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[step] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    // Update progress for the current word using the new attempt model
    const currentWord = wordsForCurrentStage[step];
    const userAttempt = answers[step];
    const isCorrect = userAttempt.trim().toLowerCase() === currentWord.toLowerCase();
    // Use the useWord hook for this word (from the top-level map)
    const { recordAttempt } = (currentStage === 'base' && listType === 'less_family')
      ? baseWordHooks[currentWord]
      : wordHooks[currentWord];
    console.log('Calling recordAttempt from SpellingTest', { currentWord, isCorrect, userAttempt });
    recordAttempt(currentWord, isCorrect, userAttempt);

    // Check if it's the last word in the current stage
    if (step === wordsForCurrentStage.length - 1) {
      // If it's the base word stage for a less_family list
      if (currentStage === 'base' && listType === 'less_family') {
        // Check if all base words were correct
        if (areCurrentStageWordsCorrect) {
          // Transition to the full word stage
          setCurrentStage('full');
          setStep(0); // Reset step for the new stage
          setAnswers(Array(words.length).fill('')); // Initialize answers for full words
          // The useEffect triggered by currentStage/step change will set the next word to utter
        } else {
          // If base words were incorrect, show results for base words
          setShowResults(true);
        }
      } else {
        // If it's the full word stage or a single list
        if (areCurrentStageWordsCorrect) {
          // If all words are correct, show congratulations
          setDone(true);
        } else {
          // If there are mistakes, show results
          setShowResults(true);
        }
      }
    } else {
      // Not the last word, move to the next step in the current stage
      setStep(step + 1);
      // The useEffect triggered by step change will set the next word to utter
    }
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

  if (showPractice) {
    // Filter incorrect words from the completed stage
    const incorrectWords = wordsForResultsOrPractice.filter((word, idx) =>
      answersForResultsOrPractice[idx].trim().toLowerCase() !== word.toLowerCase()
    );

    // Pass the filtered incorrect words (which are strings) to PracticePage
    return <PracticePage 
      words={incorrectWords} 
      onBackToTest={() => {
        setShowPractice(false);
        setShowResults(false);
        setStep(0);
        setAnswers(Array(wordsForCurrentStage.length).fill(''));
      }} 
    />;
  }

  if (showResults) {
    // For results, always show the comparison against the final word list (full words if less_family, otherwise the single list)
    const wordsForSpellingResults = listType === 'less_family' ? words : wordsForCurrentStage;

    // We need to pair the words shown on the results page with the answers given for the completed stage
    // This mapping might need adjustment depending on how SpellingResults uses the words and answers props
    // For now, passing the final words list and the answers from the last completed stage.
    // The SpellingResults component needs to handle the index mapping correctly.
    return (
      <SpellingResults
        words={wordsForSpellingResults.map(word => ({ word, sentence: '' }))} // Pass the relevant word objects
        answers={answersForResultsOrPractice} // Use answers from the last attempted stage
        onPractice={() => setShowPractice(true)}
        onRetry={handleRetry}
        listType={listType} // Pass the list type
        isBaseStageResults={listType === 'less_family' && currentStage === 'base'} // Indicate if these are base word results for less_family
      />
    );
  }

  const currentWord = wordsForCurrentStage[step];

  return (
    <div className="spelling-test-container" style={{ minHeight: '100vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <h2 className="spelling-title">🚀 Spelling Test 🚀</h2>
      <div className="spelling-progress">
        {currentStage === 'base' ? 'Base Words' : 'Full Words'} - Word {step + 1} of {wordsForCurrentStage.length}
      </div>
      <button className="spelling-listen-btn" onClick={() => speak(currentWord)}>
        🔊 Listen to the word
      </button>
      {/* Removed sentence display as requested previously */}
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
    </div>
  );
} 