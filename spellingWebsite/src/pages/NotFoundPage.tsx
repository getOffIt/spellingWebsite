import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SpellingTest.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="spelling-container">
      <h2 className="spelling-title">Oops! 🎈</h2>
      <div style={{ 
        fontSize: '1.5rem', 
        color: '#2563eb', 
        margin: '20px 0',
        textAlign: 'center',
        lineHeight: '1.5'
      }}>
        Looks like we got a bit lost!<br />
        But that's okay - even the best spellers make mistakes!<br />
        Let's go back to the fun spelling games! 🎮
      </div>
      <div style={{ 
        fontSize: '4rem', 
        margin: '20px 0',
        textAlign: 'center'
      }}>
        🎨 🎮 🎯
      </div>
      <button 
        className="spelling-btn" 
        onClick={() => navigate('/')}
        style={{ marginTop: '20px' }}
      >
        Back to Spelling Fun! 🚀
      </button>
    </div>
  );
} 