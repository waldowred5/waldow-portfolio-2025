import { afterEach, describe, expect, it } from 'vitest';

import { useCodingSceneReady } from './useCodingSceneReady';

const initialState = {
  isReady: false,
  assetsReady: false,
  portalReady: false,
  isPrewarmed: false,
};

afterEach(() => {
  useCodingSceneReady.setState(initialState);
});

describe('useCodingSceneReady', () => {
  it('starts not ready', () => {
    expect(useCodingSceneReady.getState().isReady).toBe(false);
  });

  it('is not ready until the scene has been prewarmed', () => {
    const { setAssetsReady, setPortalReady } = useCodingSceneReady.getState();
    setAssetsReady();
    setPortalReady();
    expect(useCodingSceneReady.getState().isReady).toBe(false);
  });

  it('is ready once assets, portal and prewarm are all complete', () => {
    const { setAssetsReady, setPortalReady, setPrewarmed } =
      useCodingSceneReady.getState();
    setPrewarmed();
    setPortalReady();
    expect(useCodingSceneReady.getState().isReady).toBe(false);
    setAssetsReady();
    expect(useCodingSceneReady.getState().isReady).toBe(true);
  });
});
