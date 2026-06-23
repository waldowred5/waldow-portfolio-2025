import { createWithEqualityFn } from 'zustand/traditional';

export enum VIEW_MODE {
  FULL,
  WIREFRAME,
}

export interface IViewMode {
  viewMode: VIEW_MODE;
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
