import React from 'react';
import './WordSelection.css';

const wordLists = [
  {
    name: 'List 1',
    words: ['careless', 'painless', 'homeless'],
  },
  // Future lists can be added here
  // { name: 'List 2', words: ['joyless', 'thankless', 'useless'] },
];

const WordSelection = ({ onSelectWords }: { onSelectWords: (words: string[]) => void }) => {
  return (
    <div className="word-selection-container">
      <h2 className="word-selection-title">Select a List to Practice</h2>
      {/* Debugging Text */}
      <h3>Debugging: Word Selection Component is Rendering</h3>
      <ul className="word-list">
        {wordLists.map((list, idx) => (
          <li
            key={idx}
            className="word-list-item"
            onClick={() => onSelectWords(list.words)}
          >
            <div className="list-name">{list.name}</div>
            <div className="list-words">{list.words.join(', ')}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordSelection; 