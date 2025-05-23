import React from 'react';
import { useNavigate } from 'react-router-dom';
import PracticePage from './PracticePage';

interface Word {
  word: string;
  sentence?: string;
}

// Helper to derive base word from '-less' word
function getBaseWord(word: string): string {
  if (word.toLowerCase().endsWith('less')) {
    return word.slice(0, -4);
  }
  return word;
}

interface WordResultProps {
  word: Word;
  answer: string;
  isCorrect: boolean;
  showCorrection: boolean;
  isBaseStageResult: boolean; // New prop to indicate if showing base word results
}

const WordResult: React.FC<WordResultProps> = ({ word, answer, isCorrect, showCorrection, isBaseStageResult }) => {
  // Determine which word to display based on the stage
  const displayedWord = isBaseStageResult ? getBaseWord(word.word) : word.word;
  const correctionWord = isBaseStageResult ? getBaseWord(word.word) : word.word;

  return (
    <li className={isCorrect ? 'correct' : 'incorrect'}>
      {displayedWord}
      {!isCorrect && showCorrection && <span className="correction">Correction: {correctionWord}</span>}
      <span className="correction">Your answer: {answer}</span>
    </li>
  );
};

interface SpellingResultsProps {
  words: Word[];
  answers: string[];
  onPractice: () => void;
  onRetry: () => void;
  listType: 'single' | 'less_family';
  isBaseStageResults: boolean; // Already present, indicates if the test run was for base words
}

export default function SpellingResults({ words, answers, onPractice, onRetry, listType, isBaseStageResults }: SpellingResultsProps) {
  const navigate = useNavigate();
  // We need to check correctness against the words corresponding to the stage being displayed
  // Map over the word objects and get the base word string if it's the base stage
  const wordsForCorrectionCheck = isBaseStageResults && listType === 'less_family'
    ? words.map(item => getBaseWord(item.word))
    : words.map(item => item.word); // Otherwise, just use the word string from the item


  const incorrectWords = wordsForCorrectionCheck.filter((word, idx) =>
    answers[idx].trim().toLowerCase() !== word.toLowerCase()
  );

  return (
    <div className="spelling-container">
      <h2 className="spelling-title">🚀 Spelling Test Results 🚀</h2>
      <ul className="spelling-results">
        {words.map((item, idx) => {
          // Check correctness against the correct word for the stage
          const correct = answers[idx].trim().toLowerCase() === wordsForCorrectionCheck[idx].toLowerCase();
          return (
            <WordResult
              key={item.word}
              word={item}
              answer={answers[idx]}
              isCorrect={correct}
              showCorrection={!correct && !isBaseStageResults} // Still hide full word correction in base stage
              isBaseStageResult={isBaseStageResults} // Pass the new prop
            />
          );
        })}
      </ul>
      {/* Buttons logic remains the same, based on incorrectWords from the current stage results */}
      {incorrectWords.length === 0 && (
        <button className="spelling-btn" onClick={onRetry}>Try Again</button>
      )}
      {incorrectWords.length > 0 && (
        <button className="spelling-btn" style={{marginLeft: 16}} onClick={onPractice}>
          Practice Misspelled Words
        </button>
      )}
    </div>
  );
} 