import React from 'react';
import { DEFAULT_PASS_THRESHOLD } from '../components/Challenge';
import './FullTestResults.css';

interface Word {
  word: string;
  sentence?: string;
}

function getBaseWord(word: string): string {
  if (word.toLowerCase().endsWith('less')) {
    return word.slice(0, -4);
  }
  return word;
}

interface FullTestResultsProps {
  words: Word[];
  answers: string[];
  onRetry: () => void;
  onComplete: () => void;
  listType: 'single' | 'less_family';
  isBaseStageResults: boolean;
  passThreshold?: number;
}

export default function FullTestResults({
  words,
  answers,
  onRetry,
  onComplete,
  listType,
  isBaseStageResults,
  passThreshold = DEFAULT_PASS_THRESHOLD,
}: FullTestResultsProps) {
  // Determine which words to check against
  const wordsForCorrectionCheck = isBaseStageResults && listType === 'less_family'
    ? words.map(item => getBaseWord(item.word))
    : words.map(item => item.word);

  // Calculate statistics
  const totalWords = words.length;
  const correctAnswers = wordsForCorrectionCheck.filter((word, idx) => {
    const answer = answers[idx];
    return answer?.trim().toLowerCase() === word.toLowerCase();
  }).length;
  const incorrectAnswers = totalWords - correctAnswers;
  const percentage = totalWords > 0 ? Math.round((correctAnswers / totalWords) * 100) : 0;
  const passed = percentage >= passThreshold;

  // Get incorrect words for display
  const incorrectWords = wordsForCorrectionCheck
    .map((word, idx) => ({
      word,
      answer: answers[idx] || '',
      index: idx,
    }))
    .filter(({ word, answer }) =>
      (answer?.trim().toLowerCase() ?? '') !== word.toLowerCase()
    );

  // Get encouraging message based on performance
  const getEncouragingMessage = () => {
    if (passed) {
      if (percentage === 100) {
        return "🎉 Absolutely amazing! You got every single word right! You're a spelling superstar! 🌟";
      } else if (percentage >= 95) {
        return "🎉 Fantastic work! You did brilliantly! You're so close to perfect! 🌟";
      } else {
        return "🎉 Well done! You passed the challenge! Great job! 🌟";
      }
    } else {
      if (percentage >= 80) {
        return "💪 You're so close! You did really well - just a little more practice and you'll get there! Keep going! 🌟";
      } else if (percentage >= 70) {
        return "💪 Great effort! You're making excellent progress! Every word you practice makes you stronger! 🌟";
      } else {
        return "💪 You tried your best, and that's what matters! Every mistake is a chance to learn and grow! Keep practicing, you've got this! 🌟";
      }
    }
  };

  return (
    <div className="spelling-container">
      <h2 className="spelling-title">📊 Your Challenge Results 📊</h2>
      
      {/* Pass/Fail Banner */}
      <div className={`full-test-results-banner ${passed ? 'passed' : 'failed'}`}>
        <div className="full-test-results-banner-title">
          {passed ? '🎉 Amazing Work!' : '💪 Great Effort!'}
        </div>
        <div className="full-test-results-banner-message">
          {getEncouragingMessage()}
        </div>
        <div className="full-test-results-banner-score">
          Your Score: {percentage}% {passed ? '✅' : `(Need ${passThreshold}% to pass)`}
        </div>
      </div>

      {/* Statistics */}
      <div className="full-test-results-stats">
        <h3 className="full-test-results-stats-title">
          Here's How You Did:
        </h3>
        <div className="full-test-results-stats-grid">
          <div className="full-test-results-stat-card total">
            <div className="full-test-results-stat-value total">
              {totalWords}
            </div>
            <div className="full-test-results-stat-label">Words You Tested</div>
          </div>
          <div className="full-test-results-stat-card correct">
            <div className="full-test-results-stat-value correct">
              {correctAnswers}
            </div>
            <div className="full-test-results-stat-label">Words You Got Right! 🎉</div>
          </div>
          {incorrectAnswers > 0 && (
            <div className="full-test-results-stat-card incorrect">
              <div className="full-test-results-stat-value incorrect">
                {incorrectAnswers}
              </div>
              <div className="full-test-results-stat-label">Words to Practice</div>
            </div>
          )}
          <div className="full-test-results-stat-card percentage">
            <div className="full-test-results-stat-value percentage">
              {percentage}%
            </div>
            <div className="full-test-results-stat-label">Your Score</div>
          </div>
        </div>
      </div>

      {/* Incorrect Words List */}
      {incorrectWords.length > 0 && (
        <div className="full-test-results-incorrect-words">
          <h3 className="full-test-results-incorrect-words-title">
            💡 Words to Practice ({incorrectWords.length})
          </h3>
          <p className="full-test-results-incorrect-words-description">
            Don't worry - these are great opportunities to learn! Practice makes perfect! 🌟
          </p>
          <ul className="spelling-results spelling-results-centered">
            {incorrectWords.map(({ word, answer, index }) => {
              return (
                <li key={index} className="incorrect">
                  <span className="correction">
                    <strong>Correct spelling: {word}</strong>
                  </span>
                  <span className="correction">You wrote: {answer || '(blank)'}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="full-test-results-actions">
        {!passed && (
          <button className={`full-test-results-btn retry`} onClick={onRetry}>
            Try Again! 💪
          </button>
        )}
        {passed && (
          <button className={`full-test-results-btn retry passed`} onClick={onRetry}>
            Take Test Again! 🎉
          </button>
        )}
        <button 
          className="full-test-results-btn back" 
          onClick={onComplete}
        >
          Back to Challenges
        </button>
      </div>
    </div>
  );
}

