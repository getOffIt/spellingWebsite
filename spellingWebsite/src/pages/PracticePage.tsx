import React, { useState, useEffect } from 'react';
import './SpellingTest.css';
import confetti from 'canvas-confetti';

interface PracticePageProps {
  words: string[];
  onBackToTest: () => void;
}

export default function PracticePage({ words, onBackToTest }: PracticePageProps) {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState(['', '', '']);
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

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handlePlay = () => {
    // Check each attempt individually
    const results = inputs.map(input => 
      input.trim().toLowerCase() === currentWord.toLowerCase()
    );
    
    // Check if all three attempts are correct
    const allCorrect = results.every(result => result);

    if (allCorrect) {
      if (step < words.length - 1) {
        setStep(step + 1);
        setInputs(['', '', '']);
      } else {
        setDone(true);
      }
    } else {
      // Only clear incorrect attempts, keep correct ones
      const newInputs = inputs.map((input, index) => 
        results[index] ? input : ''
      );
      setInputs(newInputs);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      if (index < 2) {
        // Move to next input field
        const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      } else {
        // On last input, trigger play
        handlePlay();
      }
    }
  };

  const canPlay = inputs.every(input => input.trim() !== '');

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
        Word {step + 1} of {words.length}: <b>{currentWord}</b>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: '16px 0 8px 0', letterSpacing: '2px' }}>{currentWord}</div>
      
      <div style={{ marginBottom: '16px' }}>
        <p style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
          Write the word three times below:
        </p>
        {inputs.map((input, index) => (
          <div key={index} style={{ marginBottom: '8px' }}>
            <input
              className="spelling-input"
              type="text"
              value={input}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              autoFocus={index === 0}
              autoComplete="new-password"
              spellCheck={false}
              inputMode='text'
              autoCapitalize='off'
              autoCorrect='off'
              data-index={index}
              placeholder={`Attempt ${index + 1}`}
              style={{ marginBottom: '4px' }}
            />
          </div>
        ))}
      </div>
      
      <button 
        className="spelling-btn" 
        onClick={handlePlay} 
        disabled={!canPlay}
        style={{ 
          backgroundColor: canPlay ? '#2563eb' : '#9ca3af',
          cursor: canPlay ? 'pointer' : 'not-allowed'
        }}
      >
        Play
      </button>
    </div>
  );
} 