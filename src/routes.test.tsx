import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/App.tsx', () => ({ App: () => <div data-testid={'app'} /> }));
vi.mock('@/components/scenes/Hero/HeroPortal.tsx', () => ({
  HeroPortal: () => <div data-testid={'portal'} />,
}));

const { BrowserRoutes } = await import('./routes');

describe('BrowserRoutes', () => {
  it('renders App on root path', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <BrowserRoutes />
      </MemoryRouter>,
    );
    expect(getByTestId('app')).toBeInTheDocument();
  });

  it('renders HeroPortal on /portal path', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/portal']}>
        <BrowserRoutes />
      </MemoryRouter>,
    );
    expect(getByTestId('portal')).toBeInTheDocument();
  });
});
