import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { ProgressProvider, useProgress } from './ProgressProvider';
import * as useProgressApi from '../hooks/useProgressApi';
import { useAuth } from 'react-oidc-context';

// Mock dependencies
vi.mock('react-oidc-context');
vi.mock('../hooks/useProgressApi');

describe('ProgressProvider', () => {
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

  describe('getWordStats', () => {
    it('returns not-started status for word with no attempts', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ProgressProvider>{children}</ProgressProvider>
      );

      const { result } = renderHook(() => useProgress(), { wrapper });

      await waitFor(() => {
        const stats = result.current.getWordStats('test-word');
        expect(stats.status).toBe('not-started');
        expect(stats.attempts).toBe(0);
        expect(stats.streak).toBe(0);
        expect(stats.lastSeen).toBe(null);
      });
    });

    it('returns in-progress status for word with 1-9 consecutive correct', async () => {
      const attempts = [
        { date: '2026-02-01T10:00:00Z', correct: true, attempt: 'test' },
        { date: '2026-02-01T10:01:00Z', correct: true, attempt: 'test' },
        { date: '2026-02-01T10:02:00Z', correct: true, attempt: 'test' },
      ];

      vi.mocked(useProgressApi.getAllProgress).mockResolvedValue([
        { wordId: 'test-word', progress: attempts },
      ]);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ProgressProvider>{children}</ProgressProvider>
      );

      const { result } = renderHook(() => useProgress(), { wrapper });

      await waitFor(() => {
        const stats = result.current.getWordStats('test-word');
        expect(stats.status).toBe('in-progress');
        expect(stats.attempts).toBe(3);
        expect(stats.streak).toBe(3);
        expect(stats.lastSeen).toBe('2026-02-01T10:02:00Z');
      });
    });

    it('returns mastered status when streak reaches 10', async () => {
      const attempts = Array.from({ length: 10 }, (_, i) => ({
        date: `2026-02-01T10:${String(i).padStart(2, '0')}:00Z`,
        correct: true,
        attempt: 'test',
      }));

      vi.mocked(useProgressApi.getAllProgress).mockResolvedValue([
        { wordId: 'test-word', progress: attempts },
      ]);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ProgressProvider>{children}</ProgressProvider>
      );

      const { result } = renderHook(() => useProgress(), { wrapper });

      await waitFor(() => {
        const stats = result.current.getWordStats('test-word');
        expect(stats.status).toBe('mastered');
        expect(stats.attempts).toBe(10);
        expect(stats.streak).toBe(10);
      });
    });

    it('returns mastered status when streak exceeds 10', async () => {
      const attempts = Array.from({ length: 15 }, (_, i) => ({
        date: `2026-02-01T10:${String(i).padStart(2, '0')}:00Z`,
        correct: true,
        attempt: 'test',
      }));

      vi.mocked(useProgressApi.getAllProgress).mockResolvedValue([
        { wordId: 'test-word', progress: attempts },
      ]);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ProgressProvider>{children}</ProgressProvider>
      );

      const { result } = renderHook(() => useProgress(), { wrapper });

      await waitFor(() => {
        const stats = result.current.getWordStats('test-word');
        expect(stats.status).toBe('mastered');
        expect(stats.attempts).toBe(15);
        expect(stats.streak).toBe(15);
      });
    });

    it('calculates streak as consecutive correct from the end', async () => {
      const attempts = [
        { date: '2026-02-01T10:00:00Z', correct: true, attempt: 'test' },
        { date: '2026-02-01T10:01:00Z', correct: true, attempt: 'test' },
        { date: '2026-02-01T10:02:00Z', correct: false, attempt: 'wrong' },
        { date: '2026-02-01T10:03:00Z', correct: true, attempt: 'test' },
        { date: '2026-02-01T10:04:00Z', correct: true, attempt: 'test' },
      ];

      vi.mocked(useProgressApi.getAllProgress).mockResolvedValue([
        { wordId: 'test-word', progress: attempts },
      ]);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ProgressProvider>{children}</ProgressProvider>
      );

      const { result } = renderHook(() => useProgress(), { wrapper });

      await waitFor(() => {
        const stats = result.current.getWordStats('test-word');
        expect(stats.status).toBe('in-progress');
        expect(stats.streak).toBe(2);
        expect(stats.attempts).toBe(5);
      });
    });

    it('resets streak to 0 after incorrect attempt', async () => {
      const attempts = [
        { date: '2026-02-01T10:00:00Z', correct: true, attempt: 'test' },
        { date: '2026-02-01T10:01:00Z', correct: true, attempt: 'test' },
        { date: '2026-02-01T10:02:00Z', correct: false, attempt: 'wrong' },
      ];

      vi.mocked(useProgressApi.getAllProgress).mockResolvedValue([
        { wordId: 'test-word', progress: attempts },
      ]);

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ProgressProvider>{children}</ProgressProvider>
      );

      const { result } = renderHook(() => useProgress(), { wrapper });

      await waitFor(() => {
        const stats = result.current.getWordStats('test-word');
        expect(stats.status).toBe('in-progress');
        expect(stats.streak).toBe(0);
        expect(stats.attempts).toBe(3);
      });
    });
  });
});
