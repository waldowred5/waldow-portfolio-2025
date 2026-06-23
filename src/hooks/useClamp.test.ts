import { describe, expect, it } from 'vitest';

import { useClamp } from './useClamp';

describe('useClamp', () => {
  it('returns target when within range', () => {
    expect(useClamp(5, 0, 10)).toBe(5);
  });

  it('clamps to min when target is below min', () => {
    expect(useClamp(-5, 0, 10)).toBe(0);
  });

  it('clamps to max when target is above max', () => {
    expect(useClamp(15, 0, 10)).toBe(10);
  });

  it('returns min when target equals min', () => {
    expect(useClamp(0, 0, 10)).toBe(0);
  });

  it('returns max when target equals max', () => {
    expect(useClamp(10, 0, 10)).toBe(10);
  });
});
