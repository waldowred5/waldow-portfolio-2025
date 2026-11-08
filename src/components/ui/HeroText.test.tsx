import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCodingSceneReady } from '@/store/useCodingSceneReady.ts';

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

  it('renders the Meet the Dev CTA by default', () => {
    const { getByRole } = render(<HeroText />);
    expect(getByRole('button')).toBeInTheDocument();
  });

  it('omits the CTA when showCta is false', () => {
    const { queryByRole } = render(<HeroText showCta={false} />);
    expect(queryByRole('button')).not.toBeInTheDocument();
  });

  it('holds the divider collapsed and the text behind it until revealed', () => {
    const { getByText, container } = render(<HeroText isRevealed={false} />);
    expect(
      (container.querySelector('.h-\\[2px\\]') as HTMLElement).style.transform,
    ).toBe('scaleX(0)');
    expect(getByText('WALDOW').parentElement!.style.transform).toContain(
      '100%',
    );
    expect(
      container.querySelector('h3')!.parentElement!.style.transform,
    ).toContain('-60px');
  });

  it('keeps the CTA fully transparent until revealed', () => {
    const { getByRole } = render(<HeroText isRevealed={false} />);
    expect(getByRole('button').parentElement!.style.opacity).toBe('0');
  });

  it('starts the CTA label animation as the CTA begins fading in', async () => {
    useCodingSceneReady.setState({ isReady: true });
    const { queryByText } = render(<HeroText />);
    expect(queryByText('Meet the Dev')).not.toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1900);
    });
    expect(queryByText('Meet the Dev')).not.toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    expect(queryByText('Meet the Dev')).toBeInTheDocument();
    useCodingSceneReady.setState({ isReady: false });
  });
});
