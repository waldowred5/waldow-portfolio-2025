import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SuspenseResolved } from './SuspenseResolved';

describe('SuspenseResolved', () => {
  it('calls onResolved once mounted', () => {
    const onResolved = vi.fn();
    const { container } = render(<SuspenseResolved onResolved={onResolved} />);
    expect(onResolved).toHaveBeenCalledTimes(1);
    expect(container).toBeEmptyDOMElement();
  });
});
