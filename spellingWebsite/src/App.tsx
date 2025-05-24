import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import WordSelection from './pages/WordSelection'
import SpellingTest from './pages/SpellingTest'
import NotFoundPage from './pages/NotFoundPage'
import KS1_1 from './pages/KS1_1'

function App() {
  const [selectedList, setSelectedList] = useState<{ words: string[]; type: 'single' | 'less_family' } | null>(null)
  const navigate = useNavigate()

  const handleSelectWords = (words: string[], type: 'single' | 'less_family') => {
    setSelectedList({ words, type })
  }

  const handleReset = () => {
    setSelectedList(null)
  }

  return (
    <Routes>
      <Route path="/" element={
        selectedList ? (
          <SpellingTest 
            words={selectedList.words} 
            listType={selectedList.type} 
            onComplete={handleReset}
          />
        ) : (
          <WordSelection onSelectWords={handleSelectWords} />
        )
      } />
      <Route path="/ks1-1" element={<KS1_1 onSelectWords={handleSelectWords} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
