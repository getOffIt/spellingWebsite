import React, { useState } from 'react'
import './App.css'
import WordSelection from './pages/WordSelection'
import SpellingTest from './pages/SpellingTest'

function App() {
  const [selectedList, setSelectedList] = useState<{ words: string[]; type: 'single' | 'less_family' } | null>(null)

  const handleSelectWords = (words: string[], type: 'single' | 'less_family') => {
    setSelectedList({ words, type })
  }

  return (
    <>
      {selectedList ? (
        <SpellingTest words={selectedList.words} listType={selectedList.type} />
      ) : (
        <WordSelection onSelectWords={handleSelectWords} />
      )}
    </>
  )
}

export default App
