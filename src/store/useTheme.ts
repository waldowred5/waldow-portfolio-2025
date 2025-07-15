import { createWithEqualityFn } from 'zustand/traditional';

// @ts-expect-error Move this to a separate file later
export enum THEME {
  ELECTRIC_BLUE,
  FIRE,
  MONOCHROME,
  CUTE,
  GREEN,
}

export type ColorInput = [number, number, number];

export const THEME_COLORS = {
  [THEME.ELECTRIC_BLUE]: {
    primary: [0, 165/255, 184/255] as ColorInput,
    // primary: '#00a5b8',
    secondary: '#4b0085',
    tertiary: [3, 0.5, 0.1] as ColorInput,
  },
  [THEME.FIRE]: {
    primary: [1, 1, 0] as ColorInput,
    // primary: '#ff0',
    secondary: '#ff3300',
    tertiary: [0.2, 2, 0.2] as ColorInput,
  },
  [THEME.MONOCHROME]: {
    primary: [34/255, 34/255, 34/255] as ColorInput,
    // primary: '#222',
    secondary: '#888888',
    tertiary: [1, 1, 1] as ColorInput,
  },
  [THEME.CUTE]: {
    primary: [127/255, 59/255, 156/255] as ColorInput,
    // primary: '#7f3b9c',
    secondary: '#1CBDBD',
    tertiary: [3.2, 0, 3.2] as ColorInput,
  },
  [THEME.GREEN]: {
    primary: [3/255, 173/255, 6/255] as ColorInput,
    // primary: '#03ad06',
    secondary: '#fff700',
    tertiary: [0, 1.2, 1.2] as ColorInput,
  },
};

export interface ITheme {
  theme: THEME
  toggleTheme: () => void
}

export const useTheme = createWithEqualityFn<ITheme>((set) => {
  return {
    theme: THEME.ELECTRIC_BLUE,

    // Actions
    toggleTheme: () => {
      set((state) => {
        const theme = state.theme = state.theme < (Object.values(THEME).length / 2) - 1 ? (state.theme + 1) : THEME.ELECTRIC_BLUE;

        return {
          ...state,
          theme
        };
      });
    }
  };
});
