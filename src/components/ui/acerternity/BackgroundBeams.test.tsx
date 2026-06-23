import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { THEME, useTheme } from '@/store/useTheme.ts';

import { BackgroundBeams } from './BackgroundBeams';

afterEach(() => {
  useTheme.setState({ theme: THEME.ELECTRIC_BLUE });
});

describe('BackgroundBeams', () => {
  it('renders an SVG element', () => {
    const { container } = render(<BackgroundBeams />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders 50 animated beam paths', () => {
    const { container } = render(<BackgroundBeams />);
    // 50 individual beam paths + 1 background path
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThanOrEqual(50);
  });

  it('renders 50 linear gradients for beams', () => {
    const { container } = render(<BackgroundBeams />);
    const gradients = container.querySelectorAll('linearGradient');
    expect(gradients.length).toBe(50);
  });

  it('accepts an optional className prop', () => {
    const { container } = render(<BackgroundBeams className={'test-class'} />);
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('renders without crashing on theme change', () => {
    const { rerender } = render(<BackgroundBeams />);
    useTheme.setState({ theme: THEME.FIRE });
    expect(() => rerender(<BackgroundBeams />)).not.toThrow();
  });
});
