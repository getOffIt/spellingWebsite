import React, { useState, useEffect, useRef } from 'react';
import './SpellingTest.css';
import confetti from 'canvas-confetti';

interface PracticePageProps {
  words: string[];
  onComplete: () => void;
}

export default function PracticePage({ words, onComplete }: PracticePageProps) {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [done, setDone] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        <button className="spelling-btn" onClick={onComplete}>Back to Home</button>
      </div>
    );
  }

  const currentWord = words[step];

  // Parse the input to extract individual words
  const getWordsFromInput = (text: string): string[] => {
    return text.split(/[\s\n]+/).filter(word => word.trim() !== '');
  };

  const inputWords = getWordsFromInput(input);
  
  // Check which words are correct
  const correctWords = inputWords.filter(word => 
    word.trim().toLowerCase() === currentWord.toLowerCase()
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handlePlay = () => {
    // Check if we have at least 5 correct attempts
    if (correctWords.length >= 5) {
      if (step < words.length - 1) {
        setStep(step + 1);
        setInput('');
        // Focus the textarea for the next word
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 100);
      } else {
        setDone(true);
      }
    } else {
      // Clear the input if not enough correct attempts
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePlay();
    }
  };

  const canPlay = correctWords.length >= 5;

  // Create a visual representation of the input with correct words highlighted
  const renderInputPreview = () => {
    if (!input.trim()) return null;

    const words = input.split(/[\s\n]+/);
    return (
      <div className="input-preview" style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#f9fafb',
        marginBottom: '16px',
        minHeight: '60px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        fontSize: '16px',
        lineHeight: '1.5'
      }}>
        {words.map((word, index) => {
          const isCorrect = word.trim().toLowerCase() === currentWord.toLowerCase();
          return (
            <span
              key={index}
              style={{
                color: isCorrect ? '#059669' : '#374151',
                fontWeight: isCorrect ? 'bold' : 'normal',
                marginRight: '4px'
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  };

  if (done) {
    return (
      <div className="spelling-container">
        <h2 className="spelling-title">🎉 Great job practicing! 🎉</h2>
        <button className="spelling-btn" onClick={onComplete}>Back to Home</button>
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
          Write the word five times below (separate with spaces or line returns):
        </p>
        
        {renderInputPreview()}
        
        <textarea
          ref={textareaRef}
          className="spelling-input"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="new-password"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          placeholder="Type the word five times here..."
          style={{
            width: '100%',
            minHeight: '120px',
            resize: 'vertical',
            fontFamily: 'monospace',
            fontSize: '16px',
            lineHeight: '1.5',
            padding: '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            outline: 'none'
          }}
        />
        
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
          Correct attempts: {correctWords.length}/5
        </div>
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
        {canPlay ? 'Next Word' : 'Play'}
      </button>
    </div>
  );
} 