import { createWithEqualityFn } from 'zustand/traditional';

interface IToonMode {
  isToon: boolean;
  toggleToon: () => void;
}

export const useToonMode = createWithEqualityFn<IToonMode>((set) => ({
  isToon: false,
  toggleToon: () => set((state) => ({ isToon: !state.isToon })),
}));
