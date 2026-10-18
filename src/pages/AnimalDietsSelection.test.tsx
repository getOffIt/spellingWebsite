import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AnimalDietsSelection from './AnimalDietsSelection';
import { ANIMAL_DIET_WORDS, ALL_WORDS } from '../data/words';

vi.mock('../hooks/useWord', () => ({
  useWord: (word: string) => ({ status: word === 'carnivore' ? 'mastered' : 'not-started', streak: 0 }),
}));

describe('Animal Diets custom list', () => {
  it('contains exactly the requested words and registers them for shared history', () => {
    expect(ANIMAL_DIET_WORDS.map(word => word.text)).toEqual(['carnivore', 'herbivore', 'omnivore']);
    for (const word of ANIMAL_DIET_WORDS) expect(ALL_WORDS).toContain(word);
  });

  it('offers all three for the full test but excludes mastered words from practice', () => {
    const select = vi.fn();
    render(<MemoryRouter><AnimalDietsSelection onSelectWords={select} /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Animal Diets' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Test/ }));
    expect(select).toHaveBeenLastCalledWith(['carnivore', 'herbivore', 'omnivore'], 'single', 'full_test');
    fireEvent.click(screen.getByRole('heading', { name: 'Animal diets' }));
    expect(select).toHaveBeenLastCalledWith(['herbivore', 'omnivore'], 'single');
  });
});
