import { render } from '@testing-library/react';
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
});
