import React, { useState, useEffect, useRef } from 'react';
import './SpellingTest.css';
import PracticePage from './PracticePage';
import confetti from 'canvas-confetti';

const BASE_WORDS = [
  { word: 'harm', sentence: 'Don\'t harm others.' },
  { word: 'help', sentence: 'Help your friends.' },
  { word: 'joy', sentence: 'Joy makes us happy.' },
];

const FULL_WORDS = [
  { word: 'harmless', sentence: 'The butterfly is harmless.' },
  { word: 'helpless', sentence: 'The kitten looked helpless.' },
  { word: 'joyless', sentence: 'A rainy day can feel joyless.' },
];

function speak(text: string) {
  const utterance = new window.SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

export default function SpellingTest() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [showResults, setShowResults] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<'base' | 'full'>('base');
  const spokenOnMount = useRef(false);

  const currentWords = currentLevel === 'base' ? BASE_WORDS : FULL_WORDS;

  useEffect(() => {
    if (
      showResults &&
      answers.length === currentWords.length &&
      answers.every((ans, idx) => ans.trim().toLowerCase() === currentWords[idx].word)
    ) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  }, [showResults, answers, currentWords]);

  useEffect(() => {
    if (!showResults) {
      if (step === 0 && !spokenOnMount.current) {
        speak(currentWords[0].word);
        spokenOnMount.current = true;
      } else if (step !== 0) {
        speak(currentWords[step].word);
      }
    }
  }, [step, showResults, currentWords]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[step] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (step < currentWords.length - 1) {
      setStep(step + 1);
    } else {
      if (currentLevel === 'base') {
        // Check if all base words are correct
        const allCorrect = answers.every((ans, idx) => 
          ans.trim().toLowerCase() === BASE_WORDS[idx].word
        );
        
        if (allCorrect) {
          // Move to full words
          setCurrentLevel('full');
          setStep(0);
          setAnswers(['', '', '']);
          spokenOnMount.current = false;
        } else {
          setShowResults(true);
        }
      } else {
        setShowResults(true);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && answers[step]) {
      handleNext();
    }
  };

  if (showPractice) {
    const incorrectWords = currentWords.filter((item, idx) => 
      answers[idx].trim().toLowerCase() !== item.word
    );
    return <PracticePage words={incorrectWords.map(w => w.word)} />;
  }

  if (showResults) {
    const incorrectWords = currentWords.filter((item, idx) => 
      answers[idx].trim().toLowerCase() !== item.word
    );
    return (
      <div className="spelling-container">
        <h2 className="spelling-title">🚀 Spelling Test 🚀</h2>
        <ul className="spelling-results">
          {currentWords.map((item, idx) => {
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
          <button className="spelling-btn" onClick={() => window.location.reload()}>Try Again</button>
        )}
        {incorrectWords.length > 0 && (
          <button className="spelling-btn" style={{marginLeft: 16}} onClick={() => setShowPractice(true)}>
            Practice Misspelled Words
          </button>
        )}
      </div>
    );
  }

  const current = currentWords[step];

  return (
    <div className="spelling-container">
      <h2 className="spelling-title">🚀 Spelling Test 🚀</h2>
      <div className="spelling-progress">
        {currentLevel === 'base' ? 'Base Words' : 'Full Words'} - Word {step + 1} of {currentWords.length}
      </div>
      <button className="spelling-listen-btn" onClick={() => speak(current.word)}>
        🔊 Listen to the word
      </button>
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
        {step === currentWords.length - 1 ? 'See Results' : 'Next'}
      </button>
    </div>
  );
} 