/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [glsl(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
        'src/main.tsx',
        'src/App.tsx',
        'src/routes.tsx',
        // WebGL-coupled — needs dedicated R3F test harness
        'src/components/FiberCanvas.tsx',
        'src/components/scenes/**',
        'src/components/models/**',
        'src/components/helpers/LevaPanel.tsx',
        // DOM render components — need @testing-library/react render tests (separate ticket)
        'src/components/ui/acerternity/**',
        'src/components/ui/ActionBar.tsx',
        'src/components/ui/Background.tsx',
        'src/components/ui/Hero2DFallback.tsx',
        'src/components/ui/HeroText.tsx',
        'src/components/ui/Icon.tsx',
        'src/components/ui/RoundedFrame.tsx',
        'src/components/ui/Section.tsx',
        // rAF/event-loop — jsdom branches not deterministically exercisable
        'src/store/useMousePosition.ts',
        'src/store/useScroll.ts',
        'src/store/useToggleFullscreen.ts',
        'src/store/useWindowSize.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80,
      },
    },
  },
});
