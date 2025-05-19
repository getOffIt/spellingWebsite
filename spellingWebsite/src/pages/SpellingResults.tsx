import React from 'react';
import PracticePage from './PracticePage';

interface Word {
  word: string;
  sentence: string;
}

interface SpellingResultsProps {
  words: Word[];
  answers: string[];
  onPractice: () => void;
  onRetry: () => void;
}

export default function SpellingResults({ words, answers, onPractice, onRetry }: SpellingResultsProps) {
  const incorrectWords = words.filter((item, idx) => 
    answers[idx].trim().toLowerCase() !== item.word
  );

  return (
    <div className="spelling-container">
      <h2 className="spelling-title">🚀 Spelling Test 🚀</h2>
      <ul className="spelling-results">
        {words.map((item, idx) => {
          const correct = answers[idx].trim().toLowerCase() === item.word;
          return (
            <li key={item.word} className={correct ? 'correct' : 'incorrect'}>
              <strong>{item.word}</strong>:&nbsp;
              {correct ? (
                <span>✅ Great job!</span>
              ) : (
                <span>
                  ❌ Oops! You wrote: "{answers[idx]}"<br />
                  <span className="correction">Correct spelling: <b>{item.word}</b></span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
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