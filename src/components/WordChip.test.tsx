import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import WordChip from './WordChip'
import { ProgressProvider } from '../contexts/ProgressProvider'
import { useAuth } from 'react-oidc-context';
import * as useProgressApi from '../hooks/useProgressApi';

// Mock dependencies
vi.mock('react-oidc-context');
vi.mock('../hooks/useProgressApi');

describe('WordChip', () => {
  const mockWord = {
    text: 'test',
    year: 1 as const,
    category: 'common'
  }

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useAuth to return authenticated user
    vi.mocked(useAuth).mockReturnValue({
      user: {
        profile: { sub: 'test-user' },
        access_token: 'test-token',
      },
      isLoading: false,
    } as any);

    // Mock API to return empty progress by default
    vi.mocked(useProgressApi.getAllProgress).mockResolvedValue([]);
  })

  it('shows grey ❔ on first render (no progress)', async () => {
    render(
      <ProgressProvider>
        <WordChip word={mockWord} />
      </ProgressProvider>
    )
    // Wait for ProgressProvider to finish loading
    await waitFor(() => {
      expect(screen.getByText('❔')).toBeInTheDocument()
    })
  })

  it('shows green ✔︎ when word is mastered (10+ streak)', async () => {
    // Mock API to return progress with 10 consecutive correct attempts
    const masteredProgress = [{
      wordId: 'test',
      progress: Array.from({ length: 10 }, (_, i) => ({
        date: new Date(2026, 0, i + 1).toISOString(),
        correct: true,
        attempt: 'test'
      }))
    }];
    vi.mocked(useProgressApi.getAllProgress).mockResolvedValue(masteredProgress as any);

    render(
      <ProgressProvider>
        <WordChip word={mockWord} />
      </ProgressProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('✔︎')).toBeInTheDocument()
    })
  })

  it('shows 🔄 when word is in-progress (some attempts, not mastered)', async () => {
    // Mock API to return progress with some attempts but not mastered
    const inProgressData = [{
      wordId: 'test',
      progress: [
        { date: new Date(2026, 0, 1).toISOString(), correct: true, attempt: 'test' },
        { date: new Date(2026, 0, 2).toISOString(), correct: false, attempt: 'tset' },
        { date: new Date(2026, 0, 3).toISOString(), correct: true, attempt: 'test' },
      ]
    }];
    vi.mocked(useProgressApi.getAllProgress).mockResolvedValue(inProgressData as any);

    render(
      <ProgressProvider>
        <WordChip word={mockWord} />
      </ProgressProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('🔄')).toBeInTheDocument()
    })
  })
})
