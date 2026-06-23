import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCanvasLoaded } from '@/store/useCanvasLoaded.ts';

import { Hero2DFallback } from './Hero2DFallback';

beforeEach(() => {
  vi.useFakeTimers();
  useCanvasLoaded.setState({
    isLoaded: false,
    isCanvasReady: false,
    isFontsReady: false,
    isGlowFading: false,
  });
});

afterEach(() => {
  vi.useRealTimers();
  useCanvasLoaded.setState({
    isLoaded: false,
    isCanvasReady: false,
    isFontsReady: false,
    isGlowFading: false,
  });
});

describe('Hero2DFallback', () => {
  it('renders the glow div initially', () => {
    const { container } = render(<Hero2DFallback />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('glow div starts with scale(0) transform', () => {
    const { container } = render(<Hero2DFallback />);
    const glowDiv = container.querySelector('.will-change-transform');
    expect(glowDiv).toHaveStyle('transform: translate(-50%, -50%) scale(0)');
  });

  it('does not crash when canvas becomes loaded', async () => {
    const { container } = render(<Hero2DFallback />);
    await act(async () => {
      useCanvasLoaded.setState({
        isLoaded: true,
        isCanvasReady: true,
        isFontsReady: true,
        isGlowFading: false,
      });
    });
    // component still present — rAF loop drives the fade, not directly testable
    expect(container).toBeInTheDocument();
  });

  it('has opacity-100 class before fade', () => {
    const { container } = render(<Hero2DFallback />);
    expect(container.firstChild).toHaveClass('opacity-100');
  });
});

describe('Hero2DFallback RAF animation', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: [
        'requestAnimationFrame',
        'cancelAnimationFrame',
        'setTimeout',
        'clearTimeout',
      ],
    });
    useCanvasLoaded.setState({
      isLoaded: false,
      isCanvasReady: false,
      isFontsReady: false,
      isGlowFading: false,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    useCanvasLoaded.setState({
      isLoaded: false,
      isCanvasReady: false,
      isFontsReady: false,
      isGlowFading: false,
    });
  });

  it('applies opacity-0 class when animation completes after canvas loads', async () => {
    useCanvasLoaded.setState({
      isLoaded: true,
      isCanvasReady: true,
      isFontsReady: true,
      isGlowFading: false,
    });
    const { container } = render(<Hero2DFallback />);

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(container.firstChild).toHaveClass('opacity-0');
  });

  it('unmounts after 900ms timeout following fadeOut', async () => {
    useCanvasLoaded.setState({
      isLoaded: true,
      isCanvasReady: true,
      isFontsReady: true,
      isGlowFading: false,
    });
    const { container } = render(<Hero2DFallback />);

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(container.firstChild).toHaveClass('opacity-0');

    await act(async () => {
      vi.advanceTimersByTime(950);
    });
    expect(container.firstChild).toBeNull();
  });

  it('keeps animating without completing when not loaded', async () => {
    const { container } = render(<Hero2DFallback />);

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(container.firstChild).toHaveClass('opacity-100');
  });
});
