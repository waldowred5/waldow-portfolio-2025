import { createWithEqualityFn } from 'zustand/traditional';

interface IPerformanceTier {
  isLowPerf: boolean;
  setIsLowPerf: (value: boolean) => void;
}

export const usePerformanceTier = createWithEqualityFn<IPerformanceTier>(
  (set) => ({
    isLowPerf: false,
    setIsLowPerf: (isLowPerf) => set({ isLowPerf }),
  }),
);
