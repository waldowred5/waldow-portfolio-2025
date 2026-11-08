import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid={'canvas'}>{children}</div>
  ),
}));

vi.mock('@/components/scenes/Hero/Hero.tsx', () => ({
  Hero: () => <div data-testid={'hero'} />,
}));

vi.mock('@/components/ui/Background.tsx', () => ({
  Background: () => <div data-testid={'background'} />,
}));

const { HeroPortal } = await import('./HeroPortal');

describe('HeroPortal', () => {
  it('renders Background', () => {
    const { getByTestId } = render(<HeroPortal />);
    expect(getByTestId('background')).toBeInTheDocument();
  });

  it('renders Canvas', () => {
    const { getByTestId } = render(<HeroPortal />);
    expect(getByTestId('canvas')).toBeInTheDocument();
  });

  it('renders Hero inside Canvas', () => {
    const { getByTestId } = render(<HeroPortal />);
    const canvas = getByTestId('canvas');
    const hero = getByTestId('hero');
    expect(canvas).toContainElement(hero);
  });

  it('replays a forwarded pointer offset as a mousemove from its centre', () => {
    render(<HeroPortal />);
    const onMove = vi.fn();
    window.addEventListener('mousemove', onMove);
    fireEvent(
      window,
      new MessageEvent('message', {
        data: { type: 'POINTER_OFFSET', x: 100, y: -50 },
      }),
    );
    window.removeEventListener('mousemove', onMove);

    const [event] = onMove.mock.calls[0] as [MouseEvent];
    expect(event.clientX).toBe(window.innerWidth / 2 + 100);
    expect(event.clientY).toBe(window.innerHeight / 2 - 50);
  });

  it('applies a forwarded cartoon toggle', async () => {
    const { useToonMode } = await import('@/store/useToonMode.ts');
    render(<HeroPortal />);
    fireEvent(
      window,
      new MessageEvent('message', {
        data: { type: 'TOON_CHANGE', isToon: true },
      }),
    );
    expect(useToonMode.getState().isToon).toBe(true);
    useToonMode.setState({ isToon: false });
  });
});
