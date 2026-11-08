import { createWithEqualityFn } from 'zustand/traditional';

interface ICodingSceneReady {
  isReady: boolean;
  assetsReady: boolean;
  portalReady: boolean;
  isPrewarmed: boolean;
  setAssetsReady: () => void;
  setPortalReady: () => void;
  setPrewarmed: () => void;
}

type ReadyFlags = Pick<
  ICodingSceneReady,
  'assetsReady' | 'portalReady' | 'isPrewarmed'
>;

const withIsReady = (flags: ReadyFlags) => ({
  ...flags,
  isReady: flags.assetsReady && flags.portalReady && flags.isPrewarmed,
});

export const useCodingSceneReady = createWithEqualityFn<ICodingSceneReady>(
  (set) => ({
    isReady: false,
    assetsReady: false,
    portalReady: false,
    isPrewarmed: false,
    setAssetsReady: () =>
      set((state) => withIsReady({ ...state, assetsReady: true })),
    setPortalReady: () =>
      set((state) => withIsReady({ ...state, portalReady: true })),
    setPrewarmed: () =>
      set((state) => withIsReady({ ...state, isPrewarmed: true })),
  }),
);
