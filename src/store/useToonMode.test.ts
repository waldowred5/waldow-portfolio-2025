import { afterEach, describe, expect, it } from 'vitest';

import { useToonMode } from './useToonMode';

afterEach(() => {
  useToonMode.setState({ isToon: false });
});

describe('useToonMode', () => {
  it('starts with the original look', () => {
    expect(useToonMode.getState().isToon).toBe(false);
  });

  it('toggleToon switches between the two looks', () => {
    useToonMode.getState().toggleToon();
    expect(useToonMode.getState().isToon).toBe(true);
    useToonMode.getState().toggleToon();
    expect(useToonMode.getState().isToon).toBe(false);
  });
});
