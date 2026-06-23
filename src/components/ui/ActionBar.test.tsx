import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useCanvasLoaded } from '@/store/useCanvasLoaded.ts';
import { THEME, useTheme } from '@/store/useTheme.ts';
import { useViewMode, VIEW_MODE } from '@/store/useViewMode.ts';

import { ActionBar } from './ActionBar';

afterEach(() => {
  useCanvasLoaded.setState({
    isLoaded: false,
    isCanvasReady: false,
    isFontsReady: false,
    isGlowFading: false,
  });
  useTheme.setState({ theme: THEME.ELECTRIC_BLUE });
  useViewMode.setState({ viewMode: VIEW_MODE.FULL });
});

describe('ActionBar', () => {
  it('renders without crashing', () => {
    const { container } = render(<ActionBar />);
    expect(container).toBeInTheDocument();
  });

  it('renders linkedin and github links', () => {
    const { container } = render(<ActionBar />);
    const links = container.querySelectorAll('a');
    const hrefs = Array.from(links).map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('https://www.linkedin.com/in/daniel-waldow/');
    expect(hrefs).toContain(
      'https://github.com/waldowred5/waldow-portfolio-2025',
    );
  });

  it('shows hover label on wireframe icon mouseenter when loaded', () => {
    useCanvasLoaded.setState({
      isLoaded: true,
      isCanvasReady: true,
      isFontsReady: true,
      isGlowFading: false,
    });
    const { container, getByText } = render(<ActionBar />);
    const wireframeDiv = container.querySelectorAll('.cursor-pointer')[1];
    fireEvent.mouseEnter(wireframeDiv);
    expect(getByText('ENTER WIREFRAME')).toBeInTheDocument();
  });

  it('wireframe icon is disabled (cursor-not-allowed) when canvas not loaded', () => {
    const { container } = render(<ActionBar />);
    const wireframeDiv = container.querySelector('.cursor-not-allowed');
    expect(wireframeDiv).toBeInTheDocument();
  });

  it('clicking wireframe icon when loaded toggles viewMode', () => {
    useCanvasLoaded.setState({
      isLoaded: true,
      isCanvasReady: true,
      isFontsReady: true,
      isGlowFading: false,
    });
    const { container } = render(<ActionBar />);
    const wireframeIcon = container
      .querySelectorAll('.cursor-pointer')[1]
      .querySelector('div');
    fireEvent.click(wireframeIcon!);
    expect(useViewMode.getState().viewMode).toBe(VIEW_MODE.WIREFRAME);
  });

  it('clicking theme icon when loaded cycles theme', () => {
    useCanvasLoaded.setState({
      isLoaded: true,
      isCanvasReady: true,
      isFontsReady: true,
      isGlowFading: false,
    });
    const { container } = render(<ActionBar />);
    const themeIcon = container
      .querySelectorAll('.cursor-pointer')[2]
      .querySelector('div');
    fireEvent.click(themeIcon!);
    expect(useTheme.getState().theme).toBe(THEME.FIRE);
  });

  it('shows fullscreen hover label', () => {
    const { container, getByText } = render(<ActionBar />);
    const fullscreenDiv = container.querySelectorAll('.cursor-pointer')[0];
    fireEvent.mouseEnter(fullscreenDiv);
    expect(getByText('ENTER FULL SCREEN')).toBeInTheDocument();
  });
});
