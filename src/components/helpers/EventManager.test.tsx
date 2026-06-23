import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useScroll } from '@/store/useScroll.ts';
import { useWindowSize } from '@/store/useWindowSize.ts';

import { EventManager } from './EventManager';

afterEach(() => {
  useScroll.setState({ scrollPercentage: 0 });
  useWindowSize.setState({ innerHeight: 0, innerWidth: 0 });
});

describe('EventManager', () => {
  it('renders without crashing', () => {
    const { unmount } = render(<EventManager />);
    unmount();
  });

  it('updates scroll store on window scroll event', () => {
    Object.defineProperty(window, 'scrollY', {
      value: 200,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 400,
      configurable: true,
    });

    render(<EventManager />);
    window.dispatchEvent(new Event('scroll'));

    expect(useScroll.getState().scrollPercentage).toBe(0.5);
  });

  it('updates window size store on window resize event', () => {
    Object.defineProperty(window, 'innerHeight', {
      value: 900,
      configurable: true,
    });
    Object.defineProperty(window, 'innerWidth', {
      value: 1440,
      configurable: true,
    });

    render(<EventManager />);
    window.dispatchEvent(new Event('resize'));

    expect(useWindowSize.getState().innerHeight).toBe(900);
    expect(useWindowSize.getState().innerWidth).toBe(1440);
  });

  it('removes scroll listener on unmount', () => {
    Object.defineProperty(window, 'scrollY', {
      value: 100,
      configurable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 500,
      configurable: true,
    });

    const { unmount } = render(<EventManager />);
    unmount();
    window.dispatchEvent(new Event('scroll'));

    expect(useScroll.getState().scrollPercentage).toBe(0);
  });

  it('removes resize listener on unmount', () => {
    Object.defineProperty(window, 'innerHeight', {
      value: 1200,
      configurable: true,
    });
    Object.defineProperty(window, 'innerWidth', {
      value: 1920,
      configurable: true,
    });

    const { unmount } = render(<EventManager />);
    unmount();
    window.dispatchEvent(new Event('resize'));

    expect(useWindowSize.getState().innerHeight).toBe(0);
    expect(useWindowSize.getState().innerWidth).toBe(0);
  });
});
