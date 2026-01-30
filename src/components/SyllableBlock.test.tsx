import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SyllableBlock } from './SyllableBlock';

describe('SyllableBlock', () => {
  it('renders the syllable text', () => {
    render(<SyllableBlock syllable="test" />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<SyllableBlock syllable="click" onClick={handleClick} />);

    fireEvent.click(screen.getByText('click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct styling when selected', () => {
    render(<SyllableBlock syllable="sel" isSelected={true} />);
    const button = screen.getByText('sel');
    expect(button).toHaveClass('bg-sky-500');
  });

  it('applies correct styling when correct', () => {
    render(<SyllableBlock syllable="win" isCorrect={true} />);
    const button = screen.getByText('win');
    expect(button).toHaveClass('bg-emerald-500');
  });

  it('does not trigger click when disabled', () => {
    const handleClick = vi.fn();
    render(
      <SyllableBlock syllable="nope" disabled={true} onClick={handleClick} />
    );

    fireEvent.click(screen.getByText('nope'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
