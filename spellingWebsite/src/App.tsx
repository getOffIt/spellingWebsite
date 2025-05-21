import React, { useState } from 'react'
import './App.css'
import WordSelection from './pages/WordSelection'
import SpellingTest from './pages/SpellingTest'

function App() {
  const [selectedWords, setSelectedWords] = useState<string[]>([])

  const handleSelectWords = (words: string[]) => {
    setSelectedWords(words)
  }

  return (
    <>
      {selectedWords.length > 0 ? (
        <SpellingTest words={selectedWords} />
      ) : (
        <WordSelection onSelectWords={handleSelectWords} />
      )}
    </>
  )
}

export default App
