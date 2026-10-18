import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WeeklySpellingsSelection from './WeeklySpellingsSelection';
import { WEEKLY_SPELLING_WORDS } from '../data/words';

vi.mock('../hooks/useWord', () => ({
  useWord: (word: string) => ({ status: word === 'favourite' ? 'mastered' : 'not-started', streak: 0 }),
}));

describe('photographed Words of the Week', () => {
  it('offers all ten for a full test while leaving green words out of practice', () => {
    const select = vi.fn();
    render(<MemoryRouter><WeeklySpellingsSelection onSelectWords={select} /></MemoryRouter>);
    expect(screen.getByText(/Words of the Week — 18 October/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Take Full Challenge Test/ }));
    expect(select).toHaveBeenLastCalledWith(WEEKLY_SPELLING_WORDS.map(word => word.text), 'single', 'full_test', 85);
    fireEvent.click(screen.getByRole('heading', { name: 'Words of the Week' }));
    expect(select).toHaveBeenLastCalledWith(['gold', 'omnivore', 'cold'], 'single');
    fireEvent.click(screen.getByText(/Ready to practise this week's words/));
    expect(select).toHaveBeenLastCalledWith(['gold', 'omnivore', 'cold'], 'single', 'practice');
  });
});
