import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import WordChip from './WordChip'
import { ProgressProvider } from '../contexts/ProgressProvider'

describe('WordChip', () => {
  const mockWord = {
    id: 'test-word',
    text: 'test',
    year: 1,
    category: 'common'
  }

  beforeEach(() => {
    localStorage.clear()
  })

  it('shows grey ❔ on first render', () => {
    render(
      <ProgressProvider>
        <WordChip word={mockWord} />
      </ProgressProvider>
    )
    expect(screen.getByText('❔')).toBeInTheDocument()
  })

  it('shows green ✔︎ after setStatus("mastered")', () => {
    render(
      <ProgressProvider>
        <WordChip word={mockWord} />
      </ProgressProvider>
    )
    
    const chip = screen.getByText('❔')
    fireEvent.click(chip)
    
    // Simulate quiz completion with mastery
    const { useWord } = require('../hooks/useWord')
    const word = useWord(mockWord.id)
    word.setStatus('mastered')
    
    expect(screen.getByText('✔︎')).toBeInTheDocument()
  })

  it('persists mastered status after page reload', () => {
    // First render and set status
    const { unmount } = render(
      <ProgressProvider>
        <WordChip word={mockWord} />
      </ProgressProvider>
    )
    
    const chip = screen.getByText('❔')
    fireEvent.click(chip)
    
    const { useWord } = require('../hooks/useWord')
    const word = useWord(mockWord.id)
    word.setStatus('mastered')
    
    unmount()

    // Re-render and check persistence
    render(
      <ProgressProvider>
        <WordChip word={mockWord} />
      </ProgressProvider>
    )
    
    expect(screen.getByText('✔︎')).toBeInTheDocument()
  })
}) 