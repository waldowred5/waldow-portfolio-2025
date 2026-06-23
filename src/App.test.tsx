import { render } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { useCanvasLoaded } from '@/store/useCanvasLoaded.ts';

beforeAll(() => {
  Object.defineProperty(document, 'fonts', {
    value: { ready: Promise.resolve() },
    configurable: true,
  });
});

vi.mock('@/components/FiberCanvas.tsx', () => ({
  FiberCanvas: () => <div data-testid={'fiber-canvas'} />,
}));

vi.mock('@/components/helpers/LevaPanel.tsx', () => ({
  LevaPanel: () => null,
}));

vi.mock('@/components/helpers/EventManager.tsx', () => ({
  EventManager: () => null,
}));

vi.mock('@/components/ui/Background.tsx', () => ({
  Background: () => <div data-testid={'background'} />,
}));

vi.mock('@/components/ui/Hero2DFallback.tsx', () => ({
  Hero2DFallback: () => <div data-testid={'fallback'} />,
}));

vi.mock('@/components/ui/ActionBar.tsx', () => ({
  ActionBar: () => <div data-testid={'action-bar'} />,
}));

const { App } = await import('./App');

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('renders FiberCanvas', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('fiber-canvas')).toBeInTheDocument();
  });

  it('renders ActionBar', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('action-bar')).toBeInTheDocument();
  });

  it('calls setFontsReady when document.fonts resolves', async () => {
    const setFontsReady = vi.fn();
    useCanvasLoaded.setState({ setFontsReady } as never);

    // document.fonts.ready is a Promise — resolve it
    Object.defineProperty(document, 'fonts', {
      value: { ready: Promise.resolve() },
      configurable: true,
    });

    render(<App />);
    await vi.waitFor(() => {
      expect(setFontsReady).toHaveBeenCalled();
    });
  });
});
