import React from 'react';
import { DEFAULT_PASS_THRESHOLD } from '../components/Challenge';

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
    return answer && answer.trim().toLowerCase() === word.toLowerCase();
  }).length;
  const incorrectAnswers = totalWords - correctAnswers;
  const percentage = Math.round((correctAnswers / totalWords) * 100);
  const passed = percentage >= passThreshold;

  // Get incorrect words for display
  const incorrectWords = wordsForCorrectionCheck
    .map((word, idx) => ({
      word,
      answer: answers[idx] || '',
      index: idx,
    }))
    .filter(({ word, answer }) =>
      !answer || answer.trim().toLowerCase() !== word.toLowerCase()
    );

  // Get encouraging message based on performance
  const getEncouragingMessage = () => {
    if (passed) {
      if (percentage === 100) {
        return "🎉 Absolutely amazing! You got every single word right! You're a spelling superstar! 🌟";
      } else if (percentage >= 95) {
        return "🎉 Fantastic work! You did brilliantly! You're so close to perfect! 🌟";
      } else {
        return "🎉 Well done! You passed the challenge! Great job, Leo! 🌟";
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
      <div
        style={{
          padding: '20px',
          marginBottom: '24px',
          borderRadius: '12px',
          backgroundColor: passed ? '#d1fae5' : '#fef3c7',
          border: `2px solid ${passed ? '#10b981' : '#f59e0b'}`,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>
          {passed ? '🎉 Amazing Work!' : '💪 Great Effort!'}
        </div>
        <div style={{ fontSize: '1.1rem', marginBottom: '12px', lineHeight: '1.6' }}>
          {getEncouragingMessage()}
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '8px' }}>
          Your Score: {percentage}% {passed ? '✅' : `(Need ${passThreshold}% to pass)`}
        </div>
      </div>

      {/* Statistics */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '16px', textAlign: 'center', color: '#1f2937' }}>
          Here's How You Did:
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
          }}
        >
          <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
              {totalWords}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Words You Tested</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#d1fae5', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
              {correctAnswers}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Words You Got Right! 🎉</div>
          </div>
          {incorrectAnswers > 0 && (
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                {incorrectAnswers}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Words to Practice</div>
            </div>
          )}
          <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#e0e7ff', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6366f1' }}>
              {percentage}%
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Your Score</div>
          </div>
        </div>
      </div>

      {/* Incorrect Words List */}
      {incorrectWords.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: '#1f2937', textAlign: 'center' }}>
            💡 Words to Practice ({incorrectWords.length})
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#6b7280', textAlign: 'center', marginBottom: '16px', fontStyle: 'italic' }}>
            Don't worry - these are great opportunities to learn! Practice makes perfect! 🌟
          </p>
          <ul className="spelling-results spelling-results-centered">
            {incorrectWords.map(({ word, answer, index }) => {
              const wordObj = words[index];
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
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
        {!passed && (
          <button className="spelling-btn" onClick={onRetry} style={{ backgroundColor: '#2563eb' }}>
            Try Again! 💪
          </button>
        )}
        {passed && (
          <button className="spelling-btn" onClick={onRetry} style={{ backgroundColor: '#10b981' }}>
            Take Test Again! 🎉
          </button>
        )}
        <button 
          className="spelling-btn" 
          onClick={onComplete}
          style={{ backgroundColor: '#6b7280' }}
        >
          Back to Challenges
        </button>
      </div>
    </div>
  );
}

