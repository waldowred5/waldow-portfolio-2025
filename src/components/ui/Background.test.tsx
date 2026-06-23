import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Background } from './Background';

describe('Background', () => {
  it('renders without crashing', () => {
    const { container } = render(<Background />);
    expect(container).toBeInTheDocument();
  });

  it('renders SVG from BackgroundBeams', () => {
    const { container } = render(<Background />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders border div from RoundedFrame', () => {
    const { container } = render(<Background />);
    expect(container.querySelector('.border-1')).toBeInTheDocument();
  });
});
