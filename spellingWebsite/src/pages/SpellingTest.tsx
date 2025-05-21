import React, { useState, useEffect, useRef } from 'react';
import './SpellingTest.css';
import PracticePage from './PracticePage';
import SpellingResults from './SpellingResults';
import confetti from 'canvas-confetti';

const BASE_WORDS = [
  { word: 'care', sentence: 'Take care of yourself.' },
  { word: 'pain', sentence: 'Pain can be temporary.' },
  { word: 'home', sentence: 'Home is where the heart is.' },
];

const FULL_WORDS = [
  { word: 'careless', sentence: 'Being careless can lead to mistakes.' },
  { word: 'painless', sentence: 'The procedure was painless.' },
  { word: 'homeless', sentence: 'Many people are homeless.' },
];

function speak(text: string) {
  const utterance = new window.SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

export default function SpellingTest({ words }: { words: string[] }) {
  if (!words || !Array.isArray(words) || words.length === 0) {
    return null;
  }

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(words.length).fill(''));
  const [showResults, setShowResults] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<'base' | 'full'>('base');
  const spokenOnMount = useRef(false);

  const currentWords = currentLevel === 'base' ? BASE_WORDS : FULL_WORDS;

  useEffect(() => {
    if (
      showResults &&
      answers.length === words.length &&
      answers.every((ans, idx) => ans.trim().toLowerCase() === words[idx])
    ) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  }, [showResults, answers, words]);

  useEffect(() => {
    if (!showResults) {
      if (step === 0 && !spokenOnMount.current) {
        speak(words[0]);
        spokenOnMount.current = true;
      } else if (step !== 0) {
        speak(words[step]);
      }
    }
  }, [step, showResults, words]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[step] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (step < words.length - 1) {
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

  const handleRetry = () => {
    window.location.reload();
  };

  if (showPractice) {
    const incorrectWords = words.filter((word, idx) => 
      answers[idx].trim().toLowerCase() !== word
    );
    return <PracticePage words={incorrectWords} />;
  }

  if (showResults) {
    return (
      <SpellingResults
        words={words.map(word => ({ word, sentence: '' }))}
        answers={answers}
        onPractice={() => setShowPractice(true)}
        onRetry={handleRetry}
      />
    );
  }

  const current = words[step];

  return (
    <div className="spelling-container">
      <h2 className="spelling-title">🚀 Spelling Test 🚀</h2>
      <div className="spelling-progress">
        {currentLevel === 'base' ? 'Base Words' : 'Full Words'} - Word {step + 1} of {words.length}
      </div>
      <button className="spelling-listen-btn" onClick={() => speak(current)}>
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
        {step === words.length - 1 ? 'See Results' : 'Next'}
      </button>
    </div>
  );
} 