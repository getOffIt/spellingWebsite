import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { ProgressProvider } from '../contexts/ProgressProvider';
import * as api from '../hooks/useProgressApi';
import OctoberSpellingChart from './OctoberSpellingChart';
import { OCTOBER_CHART_COLUMNS, OCTOBER_CHART_WORDS } from '../data/octoberSpellingChart';
import { ALL_WORDS } from '../data/words';

vi.mock('react-oidc-context');
vi.mock('../hooks/useProgressApi');

function setup() {
  const select = vi.fn();
  render(<MemoryRouter><ProgressProvider><OctoberSpellingChart onSelectWords={select} /></ProgressProvider></MemoryRouter>);
  return select;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useAuth).mockReturnValue({ user: { profile: { sub: 'leo' }, access_token: 'test' }, isLoading: false } as ReturnType<typeof useAuth>);
  vi.mocked(api.getAllProgress).mockResolvedValue([]);
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
});

describe('October school spelling chart', () => {
  it('contains all 57 words once, in six columns and the actual photo rule boundaries', () => {
    expect(OCTOBER_CHART_COLUMNS).toHaveLength(6);
    expect(OCTOBER_CHART_WORDS).toHaveLength(57);
    expect(new Set(OCTOBER_CHART_WORDS.map(word => word.text)).size).toBe(57);
    for (const word of OCTOBER_CHART_WORDS) expect(ALL_WORDS).toContain(word);
    expect(OCTOBER_CHART_COLUMNS.map(column => column.flatMap(section => section.words))).toEqual([
      ['question', 'mention', 'possession', 'busy', 'business', 'accidentally', 'actually', 'occasionally', 'probably'],
      ['February', 'history', 'interest', 'appear', 'different', 'difficult', 'disappear', 'possess', 'possible', 'pressure'],
      ['bicycle', 'centre', 'century', 'certain', 'circle', 'medicine', 'sentence', 'early', 'earth', 'heard', 'heart', 'learn'],
      ['group', 'increase', 'length', 'quarter', 'remember', 'straight', 'strength', 'various', 'describe', 'extreme', 'surprise'],
      ['actual', 'famous', 'important', 'perhaps', 'potatoes', 'strange', 'therefore', 'though', 'woman', 'women'],
      ['eight', 'eighth', 'weight', 'height', 'caught'],
    ]);
    expect(OCTOBER_CHART_COLUMNS[0].map(section => section.words)).toEqual([
      ['question', 'mention', 'possession'], ['busy', 'business'], ['accidentally', 'actually', 'occasionally', 'probably'],
    ]);
  });

  it('tests the whole chart including mastered words using the existing full-test mode', async () => {
    const select = setup();
    fireEvent.click(await screen.findByRole('button', { name: 'Test all words · 57 words' }));
    expect(select).toHaveBeenCalledWith(OCTOBER_CHART_WORDS.map(word => word.text), 'single', 'full_test');
  });

  it('tests only the exact selected rule, not the old merged category', async () => {
    const select = setup();
    fireEvent.click(await screen.findByRole('button', { name: "Test rule: 'eigh'" }));
    expect(select).toHaveBeenCalledWith(['eight', 'eighth', 'weight', 'height'], 'single', 'full_test');
  });

  it('uses live history for green ticks, prioritises lost mastery and opens every attempt', async () => {
    const good = Array.from({ length: 10 }, (_, i) => ({ date: `2026-06-${String(i + 1).padStart(2, '0')}T10:00:00Z`, correct: true, attempt: 'question' }));
    vi.mocked(api.getAllProgress).mockResolvedValue([
      { wordId: 'question', progress: good },
      { wordId: 'women', progress: [...good.map(a => ({ ...a, attempt: 'women' })), { date: '2026-09-01T10:00:00Z', correct: false, attempt: 'womin' }] },
    ]);
    const select = setup();
    const question = await screen.findByRole('button', { name: 'question: mastered. View effort and history' });
    expect(within(question).getByText('✓')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Test next 5' }));
    expect(select).toHaveBeenCalledWith(['women', 'mention', 'possession', 'busy', 'business'], 'single', 'full_test');
    fireEvent.click(screen.getByRole('button', { name: /women: unmastered/ }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('womin')).toBeInTheDocument();
    expect(within(dialog).getAllByRole('row')).toHaveLength(12);
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close word history' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('disables next-five tests when all words are green but keeps full tests available', async () => {
    vi.mocked(api.getAllProgress).mockResolvedValue(OCTOBER_CHART_WORDS.map(word => ({ wordId: word.text, progress: Array.from({ length: 10 }, () => ({ date: '2026-06-01T10:00:00Z', correct: true, attempt: word.text })) })));
    setup();
    expect(await screen.findByRole('button', { name: 'Test next 5' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Test all words · 57 words' })).toBeEnabled();
    expect(screen.getByText('57/57 green ✓')).toBeInTheDocument();
  });
});
