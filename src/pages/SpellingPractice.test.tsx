import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import SpellingTest from './SpellingTest';
import PracticePage from './PracticePage';

const { recordAttempt } = vi.hoisted(() => ({ recordAttempt: vi.fn() }));
vi.mock('../hooks/useWord', () => ({ useWord: () => ({ streak: 0, status: 'mastered', recordAttempt }) }));
vi.mock('../services/VoiceService', () => ({ VoiceService: class { speak = vi.fn().mockResolvedValue(undefined); } }));
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

function PracticeRoute() {
  const { state } = useLocation();
  return <><output data-testid="practice-words">{JSON.stringify(state.practiceWords)}</output><output data-testid="return-to">{state.returnTo}</output><PracticePage words={state.practiceWords} onComplete={vi.fn()} /></>;
}

beforeEach(() => { vi.clearAllMocks(); Element.prototype.scrollIntoView = vi.fn(); });

describe.each(['full_test', 'practice'] as const)('%s results', mode => {
  it.each([true, false])('can practise the complete tested set again after allCorrect=%s', allCorrect => {
    render(<MemoryRouter initialEntries={[{ pathname: '/spelling-test', state: { returnTo: '/animal-diets' } }]}><Routes>
      <Route path="/spelling-test" element={<SpellingTest words={['carnivore', 'omnivore']} listType="single" testMode={mode} onComplete={vi.fn()} />} />
      <Route path="/spelling-practice" element={<PracticeRoute />} />
    </Routes></MemoryRouter>);
    fireEvent.change(screen.getByPlaceholderText('Type the word here'), { target: { value: 'carnivore' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.change(screen.getByPlaceholderText('Type the word here'), { target: { value: allCorrect ? 'omnivore' : 'omni' } });
    fireEvent.click(screen.getByRole('button', { name: 'See Results' }));
    expect(recordAttempt).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByRole('button', { name: 'Practise again' }));
    expect(screen.getByRole('heading', { name: 'Spelling Practice' })).toBeInTheDocument();
    expect(screen.getByTestId('practice-words')).toHaveTextContent('["carnivore","omnivore"]');
    expect(screen.getByTestId('return-to')).toHaveTextContent('/animal-diets');
    expect(screen.getByPlaceholderText('Type the word five times here...')).toHaveValue('');
    expect(recordAttempt).toHaveBeenCalledTimes(2); // Opening guided practice does not fabricate mastery attempts.
  });
});

describe.each(['test', 'practice'])('%s answer entry', mode => {
  function openField() {
    render(<MemoryRouter>{mode === 'test'
      ? <SpellingTest words={['carnivore']} listType="single" onComplete={vi.fn()} />
      : <PracticePage words={['carnivore']} onComplete={vi.fn()} />}</MemoryRouter>);
    return screen.getByRole('textbox');
  }

  it.each(['paste', 'drop'])('blocks %s without altering the answer or recording progress', type => {
    const field = openField();
    fireEvent.change(field, { target: { value: 'car' } });
    const event = new Event(type, { bubbles: true, cancelable: true });
    fireEvent(field, event);
    expect(event.defaultPrevented).toBe(true);
    expect(field).toHaveValue('car');
    expect(screen.getByRole('status')).toHaveTextContent('Type it yourself, ninja');
    expect(recordAttempt).not.toHaveBeenCalled();
    fireEvent.change(field, { target: { value: 'carn' } });
    expect(field).toHaveValue('carn');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it.each(['insertFromPaste', 'insertFromPasteAsQuotation', 'insertFromDrop'])('blocks native %s insertion', inputType => {
    const field = openField();
    const event = new InputEvent('beforeinput', { inputType, data: 'carnivore', bubbles: true, cancelable: true });
    fireEvent(field, event);
    expect(event.defaultPrevented).toBe(true);
    expect(field).toHaveValue('');
    expect(recordAttempt).not.toHaveBeenCalled();
  });

  it.each(['insertText', 'deleteContentBackward', 'insertCompositionText'])('allows normal %s editing and copying', inputType => {
    const field = openField();
    const event = new InputEvent('beforeinput', { inputType, bubbles: true, cancelable: true });
    fireEvent(field, event);
    expect(event.defaultPrevented).toBe(false);
    const copy = new Event('copy', { bubbles: true, cancelable: true });
    fireEvent(field, copy);
    expect(copy.defaultPrevented).toBe(false);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
