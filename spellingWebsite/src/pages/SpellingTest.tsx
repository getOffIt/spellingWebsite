import React, { useState } from 'react';
import './SpellingTest.css';

const WORDS = [
  { word: 'cat', sentence: 'The cat is sleeping.' },
  { word: 'dog', sentence: 'The dog barks loudly.' },
  { word: 'sun', sentence: 'The sun is bright.' },
];

function speak(text: string) {
  const utterance = new window.SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

export default function SpellingTest() {
  const [step, setStep] = useState(0); // 0, 1, 2 for questions, 3 for results
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [showResults, setShowResults] = useState(false);

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

  if (showResults) {
    return (
      <div className="spelling-container">
        <h2 className="spelling-title">🎉 Results 🎉</h2>
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
      />
      <button className="spelling-btn" onClick={handleNext} disabled={!answers[step]}>
        {step === WORDS.length - 1 ? 'See Results' : 'Next'}
      </button>
    </div>
  );
} 