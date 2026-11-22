import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { ProgressProvider, useProgress } from '../contexts/ProgressProvider';
import * as api from '../hooks/useProgressApi';
import ChallengesPage from './ChallengesPage';
import AnimalDietsSelection from './AnimalDietsSelection';
import WeeklySpellingsSelection from './WeeklySpellingsSelection';
import { ANIMAL_DIET_WORDS, ALL_WORDS, WEEKLY_SPELLING_WORDS } from '../data/words';

vi.mock('react-oidc-context');
vi.mock('../hooks/useProgressApi');

function Location() {
  const location = useLocation();
  return <><output data-testid="return-to">{location.state?.returnTo}</output><output data-testid="practice-selection">{JSON.stringify(location.state?.practiceWords)}</output></>;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useAuth).mockReturnValue({ user: { profile: { sub: 'leo' }, access_token: 'test' }, isLoading: false } as ReturnType<typeof useAuth>);
  vi.mocked(api.getAllProgress).mockResolvedValue(['carnivore', 'centre'].map(word => ({
    wordId: word,
    progress: Array.from({ length: 10 }, () => ({ date: '2026-10-18T10:00:00Z', correct: true, attempt: word })),
  })));
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
});

describe.each([
  { title: 'Animal Diets', Page: AnimalDietsSelection, words: ANIMAL_DIET_WORDS, next: ['herbivore', 'omnivore'], green: 'carnivore', route: '/animal-diets', group: 'Animal diets', groupWords: ['carnivore', 'herbivore', 'omnivore'] },
  { title: 'Words of the Week — Week 47', Page: WeeklySpellingsSelection, words: WEEKLY_SPELLING_WORDS, next: ['business', 'February', 'interest'], green: 'centre', route: '/weekly-spellings', group: 'Should · Spelling Frame · Due 24 November', groupWords: ['again', 'any', 'central', 'centre', 'concentrate', 'concentrating', 'concentration', 'many', 'most', 'who'] },
])('$title shared chart', ({ title, Page, words, next, green, route, group, groupWords }) => {
  it('uses chart rows, green history, full-list tests and non-green next-word selection', async () => {
    const select = vi.fn();
    render(<MemoryRouter><ProgressProvider><Page onSelectWords={select} /><Location /></ProgressProvider></MemoryRouter>);
    expect(await screen.findByRole('heading', { name: title })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: `${title} spelling chart` }).querySelector('.spelling-chart-grid')).toBeTruthy();
    const [mastered] = await screen.findAllByRole('button', { name: `${green}: mastered. View effort and history` });
    expect(within(mastered).getByText('✓')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: `Test all words · ${words.length} words` }));
    expect(select).toHaveBeenLastCalledWith(words.map(word => word.text), 'single', 'full_test');
    expect(screen.getByTestId('return-to')).toHaveTextContent(route);
    fireEvent.click(screen.getByRole('button', { name: `Test next ${next.length}` }));
    expect(select).toHaveBeenLastCalledWith(next, 'single', 'full_test');
    fireEvent.click(screen.getByRole('button', { name: `Test group: ${group}` }));
    expect(select).toHaveBeenLastCalledWith(groupWords, 'single', 'full_test');
    fireEvent.click(mastered);
    expect(within(screen.getByRole('dialog')).getAllByRole('row')).toHaveLength(11);
    fireEvent.click(screen.getByRole('button', { name: 'Test this word' }));
    expect(select).toHaveBeenLastCalledWith([green], 'single', 'full_test');
    fireEvent.click(screen.getByRole('button', { name: 'Practise this word' }));
    expect(screen.getByTestId('practice-selection')).toHaveTextContent(JSON.stringify([green]));
    expect(screen.getByTestId('return-to')).toHaveTextContent(route);
  });
});

it('registers exactly the three requested animal-diet words for shared history', () => {
  expect(ANIMAL_DIET_WORDS.map(word => word.text)).toEqual(['carnivore', 'herbivore', 'omnivore']);
  for (const word of ANIMAL_DIET_WORDS) expect(ALL_WORDS).toContain(word);
});

it('shows next five from the Year 3 personal list', async () => {
  render(<MemoryRouter><ProgressProvider><WeeklySpellingsSelection onSelectWords={vi.fn()} /></ProgressProvider></MemoryRouter>);
  expect(await screen.findByRole('heading', { name: 'Perso · Must · Year 3 words' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Open Year 3 words →' })).toHaveAttribute('href', '/october-spelling-chart');
  expect(screen.getByRole('button', { name: 'Test group: Perso · Must · Your five' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Could · Optional history words' })).toBeInTheDocument();
});

it('keeps the same personal five when a word becomes green', async () => {
  const attempts = Array.from({ length: 9 }, () => ({ date: '2026-11-22T10:00:00Z', correct: true, attempt: 'business' }));
  vi.mocked(api.getAllProgress).mockResolvedValue([{ wordId: 'business', progress: attempts }]);
  vi.mocked(api.putWordProgress).mockImplementation(async (_token, wordId, newAttempts) => [
    { wordId, progress: [...attempts, ...newAttempts] },
  ]);
  const select = vi.fn();
  function FinishWord() {
    const { recordAttempt } = useProgress();
    return <button onClick={() => recordAttempt('business', true, 'business')}>Finish business</button>;
  }
  render(<MemoryRouter><ProgressProvider><WeeklySpellingsSelection onSelectWords={select} /><FinishWord /></ProgressProvider></MemoryRouter>);
  await screen.findByRole('button', { name: 'business: in progress. View effort and history' });
  fireEvent.click(screen.getByRole('button', { name: 'Finish business' }));
  await screen.findByRole('button', { name: 'business: mastered. View effort and history' });
  fireEvent.click(screen.getByRole('button', { name: 'Test group: Perso · Must · Your five' }));
  expect(select).toHaveBeenLastCalledWith(['business', 'February', 'interest', 'possession', 'accidentally'], 'single', 'full_test');
});

it('shows only this week and Year 3 words on the challenge screen', async () => {
  render(<MemoryRouter><ProgressProvider><ChallengesPage /></ProgressProvider></MemoryRouter>);
  expect(await screen.findByRole('heading', { name: '📋 Year 3 words' })).toBeInTheDocument();
  expect(document.querySelectorAll('.challenge-card')).toHaveLength(2);
  expect(screen.queryByText('Other Challenges')).not.toBeInTheDocument();
});
