import React, { useState } from 'react';

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
      <div>
        <h2>Results</h2>
        <ul>
          {WORDS.map((item, idx) => {
            const correct = answers[idx].trim().toLowerCase() === item.word;
            return (
              <li key={item.word}>
                <strong>{item.word}</strong>:&nbsp;
                {correct ? (
                  <span style={{ color: 'green' }}>Correct!</span>
                ) : (
                  <span style={{ color: 'red' }}>
                    Incorrect (You wrote: "{answers[idx]}")
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  const current = WORDS[step];

  return (
    <div>
      <h2>Spelling Test</h2>
      <p>Word {step + 1} of {WORDS.length}</p>
      <button onClick={() => speak(current.word)}>🔊 Listen to the word</button>
      <br />
      <input
        type="text"
        value={answers[step]}
        onChange={handleInput}
        placeholder="Type the word here"
        autoFocus
      />
      <br />
      <button onClick={handleNext} disabled={!answers[step]}>
        {step === WORDS.length - 1 ? 'See Results' : 'Next'}
      </button>
    </div>
  );
} 