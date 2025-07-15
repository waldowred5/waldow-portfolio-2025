import { createWithEqualityFn } from 'zustand/traditional';

export interface SettingsState {
  bloomEnabled: boolean;
  statsDebugPanelEnabled: boolean;

  // Actions
  updateBloomEnabled: (newScrollPercentage: boolean) => void;
  updateStatsDebugPanelEnabled: (newStatsDebugPanelEnabled: boolean) => void;
}
export const useSettings = createWithEqualityFn<SettingsState>((set) => {
  return {
    bloomEnabled: true,
    statsDebugPanelEnabled: false,

    // Actions
    updateBloomEnabled: (newBloomEnabled: boolean) => {
      set(() => {
        return {
          bloomEnabled: newBloomEnabled,
        };
      });
    },

    updateStatsDebugPanelEnabled: (newStatsDebugPanelEnabled: boolean) => {
      set(() => {
        return {
          statsDebugPanelEnabled: newStatsDebugPanelEnabled,
        };
      });
    }
  };
});
