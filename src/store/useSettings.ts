import { createWithEqualityFn } from 'zustand/traditional';

export interface SettingsState {
  FXEnabled: boolean;
  statsDebugPanelEnabled: boolean;

  // Actions
  updateFXEnabled: (newFXEnabled: boolean) => void;
  updateStatsDebugPanelEnabled: (newStatsDebugPanelEnabled: boolean) => void;
}
export const useSettings = createWithEqualityFn<SettingsState>((set) => {
  return {
    FXEnabled: true,
    statsDebugPanelEnabled: false,

    // Actions
    updateFXEnabled: (newFXEnabled: boolean) => {
      set(() => {
        return {
          FXEnabled: newFXEnabled,
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
