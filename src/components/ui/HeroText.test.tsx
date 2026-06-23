import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { HeroText } from './HeroText';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('HeroText', () => {
  it('renders the name DANIEL WALDOW', () => {
    const { getByText } = render(<HeroText />);
    expect(getByText('DANIEL')).toBeInTheDocument();
    expect(getByText('WALDOW')).toBeInTheDocument();
  });

  it('renders a tagline on mount', () => {
    const { container } = render(<HeroText />);
    const h3 = container.querySelector('h3');
    expect(h3).toBeInTheDocument();
    expect(h3!.textContent!.length).toBeGreaterThan(0);
  });

  it('renders three dot spans for ellipsis animation', () => {
    const { container } = render(<HeroText />);
    const dots = container.querySelectorAll('span[aria-hidden="true"] span');
    expect(dots).toHaveLength(3);
  });

  it('mounts with opacity-0 then transitions to opacity-100', async () => {
    const { container } = render(<HeroText />);
    const wrapper = container.querySelector('.transition-opacity');
    expect(wrapper).toHaveClass('opacity-0');
    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    expect(wrapper).toHaveClass('opacity-100');
  });

  it('does not crash after tagline rotation interval fires', async () => {
    const { container } = render(<HeroText />);
    await act(async () => {
      vi.advanceTimersByTime(7000);
    });
    expect(container.querySelector('h3')).toBeInTheDocument();
  });
});
