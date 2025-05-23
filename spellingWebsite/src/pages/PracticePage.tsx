import React, { useState, useEffect } from 'react';
import './SpellingTest.css';
import confetti from 'canvas-confetti';

interface PracticePageProps {
  words: string[];
  onBackToTest: () => void;
}

export default function PracticePage({ words, onBackToTest }: PracticePageProps) {
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(0);
  const [input, setInput] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  }, [done]);

  if (words.length === 0) {
    return (
      <div className="spelling-container">
        <h2 className="spelling-title">No words to practice!</h2>
        <button className="spelling-btn" onClick={onBackToTest}>Back to Test</button>
      </div>
    );
  }

  const currentWord = words[step];

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = () => {
    if (input.trim().toLowerCase() === currentWord) {
      if (count < 2) {
        setCount(count + 1);
        setInput('');
      } else if (step < words.length - 1) {
        setStep(step + 1);
        setCount(0);
        setInput('');
      } else {
        setDone(true);
      }
    } else {
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input) {
      handleSubmit();
    }
  };

  if (done) {
    return (
      <div className="spelling-container">
        <h2 className="spelling-title">🎉 Great job practicing! 🎉</h2>
        <button className="spelling-btn" onClick={onBackToTest}>Back to Test</button>
      </div>
    );
  }

  return (
    <div className="spelling-container">
      <h2 className="spelling-title">Practice Misspelled Words</h2>
      <div className="spelling-progress">
        Practice: <b>{currentWord}</b> ({count + 1} of 3)
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: '16px 0 8px 0', letterSpacing: '2px' }}>{currentWord}</div>
      <input
        className="spelling-input"
        type="text"
        value={input}
        onChange={handleInput}
        autoFocus
        onKeyDown={handleKeyDown}
        autoComplete="new-password"
        spellCheck={false}
        inputMode='text'
        autoCapitalize='off'
        autoCorrect='off'
      />
      <button className="spelling-btn" onClick={handleSubmit} disabled={!input}>
        Submit
      </button>
    </div>
  );
} 