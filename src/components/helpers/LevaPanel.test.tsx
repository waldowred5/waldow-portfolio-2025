import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('leva', () => ({
  Leva: () => <div data-testid={'leva'} />,
}));

const { LevaPanel } = await import('./LevaPanel');

describe('LevaPanel', () => {
  it('renders without crashing', () => {
    const { container } = render(<LevaPanel />);
    expect(container).toBeInTheDocument();
  });

  it('renders the Leva component', () => {
    const { getByTestId } = render(<LevaPanel />);
    expect(getByTestId('leva')).toBeInTheDocument();
  });
});
