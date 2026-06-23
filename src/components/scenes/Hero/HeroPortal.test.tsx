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
  it('renders without crashing', () => {
    const { container } = render(<HeroPortal />);
    expect(container).toBeInTheDocument();
  });

  it('renders Background', () => {
    const { getByTestId } = render(<HeroPortal />);
    expect(getByTestId('background')).toBeInTheDocument();
  });

  it('renders Canvas', () => {
    const { getByTestId } = render(<HeroPortal />);
    expect(getByTestId('canvas')).toBeInTheDocument();
  });
});
