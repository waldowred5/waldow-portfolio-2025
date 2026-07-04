import { createWithEqualityFn } from 'zustand/traditional';

interface ICodingSceneReady {
  isReady: boolean;
  assetsReady: boolean;
  portalReady: boolean;
  setAssetsReady: () => void;
  setPortalReady: () => void;
}

export const useCodingSceneReady = createWithEqualityFn<ICodingSceneReady>(
  (set) => ({
    isReady: false,
    assetsReady: false,
    portalReady: false,
    setAssetsReady: () =>
      set((state) => ({
        assetsReady: true,
        isReady: state.portalReady,
      })),
    setPortalReady: () =>
      set((state) => ({
        portalReady: true,
        isReady: state.assetsReady,
      })),
  }),
);
