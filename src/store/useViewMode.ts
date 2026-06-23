import { createWithEqualityFn } from 'zustand/traditional';

export const VIEW_MODE = {
  FULL: 'FULL',
  WIREFRAME: 'WIREFRAME',
} as const;

export type ViewMode = (typeof VIEW_MODE)[keyof typeof VIEW_MODE];

export interface IViewMode {
  viewMode: ViewMode;
  toggleViewMode: () => void;
}

export const useViewMode = createWithEqualityFn<IViewMode>((set) => {
  return {
    viewMode: VIEW_MODE.FULL,

    toggleViewMode: () => {
      set((state) => ({
        ...state,
        viewMode:
          state.viewMode === VIEW_MODE.FULL
            ? VIEW_MODE.WIREFRAME
            : VIEW_MODE.FULL,
      }));
    },
  };
});
