import React from 'react';
import './WordSelection.css';

interface WordList {
  name: string;
  words: string[];
  type: 'single' | 'less_family';
}

const wordLists: WordList[] = [
  {
    name: 'List 1 (-less family)',
    words: ['careless', 'painless', 'homeless'],
    type: 'less_family',
  },
  {
    name: 'List 2',
    words: ['harmless', 'homeless', 'joyless'],
    type: 'single',
  },
  // Future lists can be added here
  // { name: 'List 2', words: ['joyless', 'thankless', 'useless'] },
];

const WordSelection = ({ onSelectWords }: { onSelectWords: (words: string[], type: 'single' | 'less_family') => void }) => {
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
            onClick={() => onSelectWords(list.words, list.type)}
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