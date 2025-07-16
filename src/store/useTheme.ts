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
    tertiary: [10.8, 0.5, 0.1] as ColorInput,
  },
  [THEME.FIRE]: {
    primary: [1, 1, 0] as ColorInput,
    // primary: '#ff0',
    secondary: '#ff3300',
    tertiary: [0.2, 2, 0.2] as ColorInput,
  },
  [THEME.MONOCHROME]: {
    primary: [0/255, 0/255, 0/255] as ColorInput,
    // primary: '#222',
    secondary: '#888888',
    tertiary: [1, 1, 1] as ColorInput,
  },
  [THEME.CUTE]: {
    primary: [117/255, 49/255, 146/255] as ColorInput,
    // primary: '#7f3b9c',
    secondary: '#1CBDBD',
    tertiary: [2.2, 0, 2.2] as ColorInput,
  },
  [THEME.GREEN]: {
    primary: [0/255, 300/255, 0/255] as ColorInput,
    // primary: '#03ad06',
    secondary: '#baa200',
    tertiary: [0, 1.8, 1.8] as ColorInput,
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
