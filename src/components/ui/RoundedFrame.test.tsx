import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RoundedFrame } from './RoundedFrame';

describe('RoundedFrame', () => {
  it('renders a fixed full-screen container', () => {
    const { container } = render(<RoundedFrame />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders inner border div', () => {
    const { container } = render(<RoundedFrame />);
    const inner = container.querySelector('.border-1');
    expect(inner).toBeInTheDocument();
  });
});
