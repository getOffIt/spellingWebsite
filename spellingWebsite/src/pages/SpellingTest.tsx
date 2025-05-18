import React, { useState, useEffect, useRef } from 'react';
import './SpellingTest.css';
import PracticePage from './PracticePage';

const WORDS = [
  { word: 'harmless', sentence: 'The butterfly is harmless.' },
  { word: 'helpless', sentence: 'The kitten looked helpless.' },
  { word: 'joyless', sentence: 'A rainy day can feel joyless.' },
];

function speak(text: string) {
  const utterance = new window.SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

export default function SpellingTest() {
  const [step, setStep] = useState(0); // 0, 1, 2 for questions, 3 for results
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [showResults, setShowResults] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const spokenOnMount = useRef(false);

  useEffect(() => {
    if (!showResults) {
      // Only speak on mount once, or on step change after mount
      if (step === 0 && !spokenOnMount.current) {
        speak(WORDS[0].word);
        spokenOnMount.current = true;
      } else if (step !== 0) {
        speak(WORDS[step].word);
      }
    }
  }, [step, showResults]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[step] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (step < WORDS.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && answers[step]) {
      handleNext();
    }
  };

  if (showPractice) {
    // Pass the list of incorrect words to the practice page
    const incorrectWords = WORDS.filter((item, idx) => answers[idx].trim().toLowerCase() !== item.word);
    return <PracticePage words={incorrectWords.map(w => w.word)} />;
  }

  if (showResults) {
    const incorrectWords = WORDS.filter((item, idx) => answers[idx].trim().toLowerCase() !== item.word);
    return (
      <div className="spelling-container">
        <h2 className="spelling-title">🚀 Spelling Test 🚀</h2>
        <ul className="spelling-results">
          {WORDS.map((item, idx) => {
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
        <button className="spelling-btn" onClick={() => window.location.reload()}>Try Again</button>
        {incorrectWords.length > 0 && (
          <button className="spelling-btn" style={{marginLeft: 16}} onClick={() => setShowPractice(true)}>
            Practice Misspelled Words
          </button>
        )}
      </div>
    );
  }

  const current = WORDS[step];

  return (
    <div className="spelling-container">
      <h2 className="spelling-title">🚀 Spelling Test 🚀</h2>
      <div className="spelling-progress">Word {step + 1} of {WORDS.length}</div>
      <button className="spelling-listen-btn" onClick={() => speak(current.word)}>
        🔊 Listen to the word
      </button>
      <div className="spelling-sentence">(Hint: {current.sentence})</div>
      <input
        className="spelling-input"
        type="text"
        value={answers[step]}
        onChange={handleInput}
        placeholder="Type the word here"
        autoFocus
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck={false}
      />
      <button className="spelling-btn" onClick={handleNext} disabled={!answers[step]}>
        {step === WORDS.length - 1 ? 'See Results' : 'Next'}
      </button>
    </div>
  );
} 