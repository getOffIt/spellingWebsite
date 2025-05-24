import React from 'react'
import { useWord } from '../hooks/useWord'
import { Word } from '../data/words'
import './WordChip.css'

interface WordChipProps {
  word: Word
  onClick?: () => void
}

const WordChip: React.FC<WordChipProps> = ({ word, onClick }) => {
  const { status, text } = useWord(word.id)

  const getStatusIcon = () => {
    switch (status) {
      case 'mastered':
        return '✔︎'
      case 'in-progress':
        return '🔄'
      default:
        return '❔'
    }
  }

  const getStatusClass = () => {
    switch (status) {
      case 'mastered':
        return 'word-chip-mastered'
      case 'in-progress':
        return 'word-chip-progress'
      default:
        return 'word-chip-not-started'
    }
  }

  return (
    <div 
      className={`word-chip ${getStatusClass()}`}
      onClick={onClick}
    >
      <span className="word-chip-icon">{getStatusIcon()}</span>
      <span className="word-chip-text">{text}</span>
    </div>
  )
}

export default WordChip 