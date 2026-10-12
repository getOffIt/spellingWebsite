import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { ProgressProvider } from '../contexts/ProgressProvider';
import * as api from '../hooks/useProgressApi';
import SpellingChart from './SpellingChart';
import { SPELLING_CHART_COLUMNS, SPELLING_CHART_WORDS } from '../data/spellingChart';
import { SPELLING_LIST_B } from '../data/words';

vi.mock('react-oidc-context');
vi.mock('../hooks/useProgressApi');

function setup() {
  const select = vi.fn();
  render(<MemoryRouter><ProgressProvider><SpellingChart onSelectWords={select} /></ProgressProvider></MemoryRouter>);
  return select;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useAuth).mockReturnValue({ user: { profile: { sub: 'leo' }, access_token: 'test' }, isLoading: false } as ReturnType<typeof useAuth>);
  vi.mocked(api.getAllProgress).mockResolvedValue([]);
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
});

describe('school spelling chart', () => {
  it('contains all 64 words once, in six columns and the actual photo rule boundaries', () => {
    expect(SPELLING_CHART_COLUMNS).toHaveLength(6);
    expect(SPELLING_CHART_WORDS).toHaveLength(64);
    expect(new Set(SPELLING_CHART_WORDS.map(word => word.text)).size).toBe(64);
    expect(SPELLING_CHART_WORDS.map(word => word.text)).toEqual(SPELLING_LIST_B.map(word => word.text));
    expect(SPELLING_CHART_COLUMNS[0].map(section => section.words)).toEqual([
      ['door', 'floor', 'poor'], ['break', 'great', 'steak'], ['could', 'should', 'would'],
    ]);
  });

  it('tests the whole chart including mastered words using the existing full-test mode', async () => {
    const select = setup();
    fireEvent.click(await screen.findByRole('button', { name: 'Test full year · 64 words' }));
    expect(select).toHaveBeenCalledWith(SPELLING_LIST_B.map(word => word.text), 'single', 'full_test');
  });

  it('tests only the exact selected rule, not the old merged category', async () => {
    const select = setup();
    fireEvent.click(await screen.findByRole('button', { name: "Test rule: 'ay' sound spelt 'ea'" }));
    expect(select).toHaveBeenCalledWith(['break', 'great', 'steak'], 'single', 'full_test');
  });

  it('uses live history for green ticks, prioritises lost mastery and opens every attempt', async () => {
    const good = Array.from({ length: 10 }, (_, i) => ({ date: `2026-06-${String(i + 1).padStart(2, '0')}T10:00:00Z`, correct: true, attempt: 'door' }));
    vi.mocked(api.getAllProgress).mockResolvedValue([
      { wordId: 'door', progress: good },
      { wordId: 'water', progress: [...good.map(a => ({ ...a, attempt: 'water' })), { date: '2026-09-01T10:00:00Z', correct: false, attempt: 'waot' }] },
    ]);
    const select = setup();
    const door = await screen.findByRole('button', { name: 'door: mastered. View effort and history' });
    expect(within(door).getByText('✓')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Test next 5' }));
    expect(select).toHaveBeenCalledWith(['water', 'floor', 'poor', 'break', 'great'], 'single', 'full_test');
    fireEvent.click(screen.getByRole('button', { name: /water: unmastered/ }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('waot')).toBeInTheDocument();
    expect(within(dialog).getAllByRole('row')).toHaveLength(12);
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close word history' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('disables next-five tests when all words are green but keeps full tests available', async () => {
    vi.mocked(api.getAllProgress).mockResolvedValue(SPELLING_LIST_B.map(word => ({ wordId: word.text, progress: Array.from({ length: 10 }, () => ({ date: '2026-06-01T10:00:00Z', correct: true, attempt: word.text })) })));
    setup();
    expect(await screen.findByRole('button', { name: 'Test next 5' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Test full year · 64 words' })).toBeEnabled();
    expect(screen.getByText('64/64 green ✓')).toBeInTheDocument();
  });
});
