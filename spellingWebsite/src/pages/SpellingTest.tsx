import React, { useState, useEffect, useRef } from 'react';
import './SpellingTest.css';
import PracticePage from './PracticePage';
import SpellingResults from './SpellingResults';
import confetti from 'canvas-confetti';

interface Word {
  word: string;
  sentence?: string; // Optional sentence for now, can be added later
}

function speak(text: string) {
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

export default function SpellingTest({ words, listType }: { words: string[]; listType: 'single' | 'less_family' }) {
  // If listType is 'less_family', generate base words
  const baseWords = listType === 'less_family' ? words.map(word => getBaseWord(word)) : [];

  const [currentStage, setCurrentStage] = useState<'base' | 'full'>(listType === 'less_family' ? 'base' : 'full');
  
  // Determine the actual words for the current stage
  const wordsForCurrentStage = currentStage === 'base' ? baseWords : words;

  const [step, setStep] = useState(0);
  // Initialize answers based on the words for the initial stage
  const [answers, setAnswers] = useState<string[]>(Array(wordsForCurrentStage.length).fill(''));
  const [showResults, setShowResults] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const spokenOnMount = useRef(false);

  // Check if the words for the current stage are all correct
  const areCurrentStageWordsCorrect = answers.every((ans, idx) => 
    ans.trim().toLowerCase() === wordsForCurrentStage[idx].toLowerCase()
  );

  // Effect for speaking the word
  useEffect(() => {
    if (!showResults && wordsForCurrentStage.length > 0) {
      if (step === 0 && !spokenOnMount.current) {
        speak(wordsForCurrentStage[0]);
        spokenOnMount.current = true;
      } else if (step > 0 && step < wordsForCurrentStage.length) {
        speak(wordsForCurrentStage[step]);
      }
    }
  }, [step, showResults, wordsForCurrentStage]);

  // Effect for confetti on completing all words in the test (last stage)
  useEffect(() => {
    if (
      showResults && 
      listType === 'single' ? 
      areCurrentStageWordsCorrect : // For single list, confetti if all are correct in the only stage
      (currentStage === 'full' && areCurrentStageWordsCorrect) // For less_family, confetti only if full words are correct
    ) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  }, [showResults, areCurrentStageWordsCorrect, currentStage, listType]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[step] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
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
          spokenOnMount.current = false; // Allow speaking the first full word
        } else {
          // If base words were incorrect, show results for base words
          setShowResults(true);
        }
      } else {
        // If it's the full word stage or a single list, show final results
        setShowResults(true);
      }
    } else {
      // Not the last word, move to the next step in the current stage
      setStep(step + 1);
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
    setAnswers(Array(wordsForCurrentStage.length).fill('')); // Initialize for the initial stage
    setShowResults(false);
    setShowPractice(false);
    spokenOnMount.current = false;
  };

  // Determine which words to show on the results/practice page
  const wordsForResultsOrPractice = listType === 'less_family' && currentStage === 'base' ? baseWords : words;
  const answersForResultsOrPractice = listType === 'less_family' && currentStage === 'base' ? answers : answers; // Answers are always for the last completed stage

  if (showPractice) {
    // Determine the words that were relevant to the stage just completed.
    // If it was the base word stage for a less_family list, these are the base words.
    // Otherwise, they are the full words.
    const completedStageWords = listType === 'less_family' && currentStage === 'base' ? baseWords : words;

    // Filter the completed stage words to find the ones that were answered incorrectly.
    // Compare the answer to the word from the completed stage.
    const incorrectWords = completedStageWords.filter((word, idx) =>
      answersForResultsOrPractice[idx].trim().toLowerCase() !== word.toLowerCase()
    );

    // Pass the filtered incorrect words (which are strings) to PracticePage
    return <PracticePage words={incorrectWords} />;
  }

  if (showResults) {
    // For results, always show the comparison against the final word list (full words if less_family, otherwise the single list)
    const finalWords = listType === 'less_family' ? words : wordsForCurrentStage; // words is the full list, wordsForCurrentStage is for the last stage
    // Need to map answers correctly to finalWords, might need to store answers per stage
    // For now, assuming answers corresponds to the last attempted stage
    return (
      <SpellingResults
        words={finalWords.map(word => ({ word, sentence: '' }))} // Assuming SpellingResults expects Word[]
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
    <div className="spelling-container">
      <h2 className="spelling-title">🚀 Spelling Test 🚀</h2>
      <div className="spelling-progress">
        {currentStage === 'base' ? 'Base Words' : 'Full Words'} - Word {step + 1} of {wordsForCurrentStage.length}
      </div>
      <button className="spelling-listen-btn" onClick={() => speak(currentWord)}>
        🔊 Listen to the word
      </button>
      {/* Removed sentence display as requested previously */}
      <input
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
      />
      <button className="spelling-btn" onClick={handleNext} disabled={!answers[step]}>
        {step === wordsForCurrentStage.length - 1 ? (currentStage === 'base' && listType === 'less_family' ? 'Next Stage' : 'See Results') : 'Next'}
      </button>
    </div>
  );
} 