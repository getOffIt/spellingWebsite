import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import './SpellingTest.css';

interface CongratulationsPageProps {
  onComplete: () => void;
  onPracticeAgain?: () => void;
}

export default function CongratulationsPage({ onComplete, onPracticeAgain }: CongratulationsPageProps) {
  useEffect(() => {
    // Trigger confetti when the component mounts
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
  }, []); // Empty dependency array means this runs once when mounted

  return (
    <div className="spelling-container">
      <h2 className="spelling-title">🎉 Congratulations! 🎉</h2>
      <div style={{ 
        fontSize: '1.5rem', 
        color: '#2563eb', 
        margin: '20px 0',
        textAlign: 'center',
        lineHeight: '1.5'
      }}>
        You've completed all the words correctly!<br />
        Great job! 🌟
      </div>
      {onPracticeAgain && <button className="spelling-btn" onClick={onPracticeAgain}>Practise again</button>}
      <button 
        className="spelling-btn" 
        onClick={onComplete}
      >
        Done
      </button>
    </div>
  );
} 