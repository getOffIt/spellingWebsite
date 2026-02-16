import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWord } from './useWord';
import { ProgressProvider, useProgress } from '../contexts/ProgressProvider';
import * as useProgressApi from './useProgressApi';
import { useAuth } from 'react-oidc-context';

// Mock dependencies
vi.mock('react-oidc-context');
vi.mock('./useProgressApi');

// Mock word data
vi.mock('../data/words', () => ({
  ALL_WORDS: [
    { id: 'test-word-1', text: 'apple', year: 1, category: 'fruit' },
    { id: 'test-word-2', text: 'banana', year: 1, category: 'fruit' },
  ],
}));

describe('useWord', () => {
  const mockToken = 'test-token';
  const mockUserId = 'test-user-123';

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useAuth to return authenticated user
    vi.mocked(useAuth).mockReturnValue({
      user: {
        profile: { sub: mockUserId },
        access_token: mockToken,
      },
      isLoading: false,
    } as any);

    // Mock API to return empty progress by default
    vi.mocked(useProgressApi.getAllProgress).mockResolvedValue([]);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ProgressProvider>{children}</ProgressProvider>
  );

  it('returns word data with not-started status for new word', async () => {
    const { result } = renderHook(() => useWord('test-word-1'), { wrapper });

    await waitFor(() => {
      expect(result.current.id).toBe('test-word-1');
      expect(result.current.text).toBe('apple');
      expect(result.current.status).toBe('not-started');
      expect(result.current.streak).toBe(0);
      expect(result.current.attempts).toEqual([]);
    });
  });

  it('returns in-progress status for word with attempts', async () => {
    const attempts = [
      { date: '2026-02-01T10:00:00Z', correct: true, attempt: 'apple' },
      { date: '2026-02-01T10:01:00Z', correct: true, attempt: 'apple' },
      { date: '2026-02-01T10:02:00Z', correct: true, attempt: 'apple' },
    ];

    vi.mocked(useProgressApi.getAllProgress).mockResolvedValue([
      { wordId: 'test-word-1', progress: attempts },
    ]);

    const { result } = renderHook(() => useWord('test-word-1'), { wrapper });

    await waitFor(() => {
      expect(result.current.status).toBe('in-progress');
      expect(result.current.streak).toBe(3);
      expect(result.current.attempts).toEqual(attempts);
    });
  });

  it('returns mastered status when streak reaches 10', async () => {
    const attempts = Array.from({ length: 10 }, (_, i) => ({
      date: `2026-02-01T10:${String(i).padStart(2, '0')}:00Z`,
      correct: true,
      attempt: 'apple',
    }));

    vi.mocked(useProgressApi.getAllProgress).mockResolvedValue([
      { wordId: 'test-word-1', progress: attempts },
    ]);

    const { result } = renderHook(() => useWord('test-word-1'), { wrapper });

    await waitFor(() => {
      expect(result.current.status).toBe('mastered');
      expect(result.current.streak).toBe(10);
    });
  });

  it('detects unmastered status when word was mastered but lost streak', async () => {
    // Word had 10 correct (mastered), then got one wrong
    const attempts = [
      ...Array.from({ length: 10 }, (_, i) => ({
        date: `2026-02-01T10:${String(i).padStart(2, '0')}:00Z`,
        correct: true,
        attempt: 'apple',
      })),
      { date: '2026-02-01T10:10:00Z', correct: false, attempt: 'aple' },
    ];

    vi.mocked(useProgressApi.getAllProgress).mockResolvedValue([
      { wordId: 'test-word-1', progress: attempts },
    ]);

    const { result } = renderHook(() => useWord('test-word-1'), { wrapper });

    await waitFor(() => {
      expect(result.current.status).toBe('unmastered');
      expect(result.current.streak).toBe(0);
    });
  });

  it('detects unmastered even after rebuilding some streak', async () => {
    // Word had 10 correct (mastered), then got one wrong, then 5 more correct
    const attempts = [
      ...Array.from({ length: 10 }, (_, i) => ({
        date: `2026-02-01T10:${String(i).padStart(2, '0')}:00Z`,
        correct: true,
        attempt: 'apple',
      })),
      { date: '2026-02-01T10:10:00Z', correct: false, attempt: 'aple' },
      ...Array.from({ length: 5 }, (_, i) => ({
        date: `2026-02-01T10:${String(i + 11).padStart(2, '0')}:00Z`,
        correct: true,
        attempt: 'apple',
      })),
    ];

    vi.mocked(useProgressApi.getAllProgress).mockResolvedValue([
      { wordId: 'test-word-1', progress: attempts },
    ]);

    const { result } = renderHook(() => useWord('test-word-1'), { wrapper });

    await waitFor(() => {
      expect(result.current.status).toBe('unmastered');
      expect(result.current.streak).toBe(5);
    });
  });

  it('returns mastered (not unmastered) when word regains mastery', async () => {
    // Word had 10 correct (mastered), got one wrong, then 10 more correct (remastered)
    const attempts = [
      ...Array.from({ length: 10 }, (_, i) => ({
        date: `2026-02-01T10:${String(i).padStart(2, '0')}:00Z`,
        correct: true,
        attempt: 'apple',
      })),
      { date: '2026-02-01T10:10:00Z', correct: false, attempt: 'aple' },
      ...Array.from({ length: 10 }, (_, i) => ({
        date: `2026-02-01T10:${String(i + 11).padStart(2, '0')}:00Z`,
        correct: true,
        attempt: 'apple',
      })),
    ];

    vi.mocked(useProgressApi.getAllProgress).mockResolvedValue([
      { wordId: 'test-word-1', progress: attempts },
    ]);

    const { result } = renderHook(() => useWord('test-word-1'), { wrapper });

    await waitFor(() => {
      expect(result.current.status).toBe('mastered');
      expect(result.current.streak).toBe(10);
    });
  });

  it('does not mark as unmastered if never reached mastery', async () => {
    // Word had 9 correct (not mastered), then got one wrong
    const attempts = [
      ...Array.from({ length: 9 }, (_, i) => ({
        date: `2026-02-01T10:${String(i).padStart(2, '0')}:00Z`,
        correct: true,
        attempt: 'apple',
      })),
      { date: '2026-02-01T10:09:00Z', correct: false, attempt: 'aple' },
    ];

    vi.mocked(useProgressApi.getAllProgress).mockResolvedValue([
      { wordId: 'test-word-1', progress: attempts },
    ]);

    const { result } = renderHook(() => useWord('test-word-1'), { wrapper });

    await waitFor(() => {
      expect(result.current.status).toBe('in-progress');
      expect(result.current.streak).toBe(0);
    });
  });
});
