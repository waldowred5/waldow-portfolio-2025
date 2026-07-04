import { createWithEqualityFn } from 'zustand/traditional';

interface IAboutMePanel {
  isVisible: boolean;
  showPanel: () => void;
  hidePanel: () => void;
}

export const useAboutMePanel = createWithEqualityFn<IAboutMePanel>((set) => {
  return {
    isVisible: false,

    showPanel: () => {
      set(() => ({ isVisible: true }));
    },
    hidePanel: () => {
      set(() => ({ isVisible: false }));
    },
  };
});
