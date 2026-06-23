import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({
    children,
    onCreated,
  }: {
    children: React.ReactNode;
    onCreated?: () => void;
  }) => {
    onCreated?.();

    return <div data-testid={'canvas'}>{children}</div>;
  },
}));

vi.mock('leva', () => ({
  button: vi.fn(),
  folder: vi.fn((_: unknown, content: unknown) => content),
  useControls: vi.fn(() => [
    { fov: 75, statsDebugPanelEnabled: false },
    vi.fn(),
  ]),
}));

vi.mock('r3f-perf', () => ({ Perf: () => <div data-testid={'perf'} /> }));

vi.mock('@/components/SceneManager.tsx', () => ({
  SceneManager: () => <div data-testid={'scene-manager'} />,
}));

vi.mock('@/components/helpers/KeyboardInputManager.tsx', () => ({
  KeyboardInputManager: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const { FiberCanvas } = await import('./FiberCanvas');

describe('FiberCanvas', () => {
  it('renders without crashing', () => {
    const { container } = render(<FiberCanvas />);
    expect(container).toBeInTheDocument();
  });

  it('renders the Canvas element', () => {
    const { getByTestId } = render(<FiberCanvas />);
    expect(getByTestId('canvas')).toBeInTheDocument();
  });

  it('renders SceneManager inside Canvas', () => {
    const { getByTestId } = render(<FiberCanvas />);
    expect(getByTestId('scene-manager')).toBeInTheDocument();
  });

  it('does not render Perf by default', () => {
    const { queryByTestId } = render(<FiberCanvas />);
    expect(queryByTestId('perf')).toBeNull();
  });
});
