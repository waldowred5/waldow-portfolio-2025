import { fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

interface KeyMap {
  name: string;
  keys: string[];
}

const capturedProps: { map: KeyMap[] } = { map: [] };

vi.mock('@react-three/drei', () => ({
  KeyboardControls: ({
    children,
    map,
  }: {
    children: React.ReactNode;
    map: KeyMap[];
  }) => {
    capturedProps.map = map;

    return <>{children}</>;
  },
}));

const { KeyboardInputManager } = await import('./KeyboardInputManager');

describe('KeyboardInputManager', () => {
  beforeEach(() => {
    capturedProps.map = [];
  });

  it('renders children', () => {
    const { getByText } = render(
      <KeyboardInputManager>
        <span>{'child content'}</span>
      </KeyboardInputManager>,
    );
    expect(getByText('child content')).toBeInTheDocument();
  });

  it('configures directional and escape key mappings', () => {
    render(
      <KeyboardInputManager>
        <span>{'content'}</span>
      </KeyboardInputManager>,
    );
    const names = capturedProps.map.map(({ name }) => name);
    expect(names).toContain('upward');
    expect(names).toContain('downward');
    expect(names).toContain('leftward');
    expect(names).toContain('rightward');
    expect(names).toContain('escape');
  });

  it('maps arrow and WASD keys to movement controls', () => {
    render(
      <KeyboardInputManager>
        <span>{'content'}</span>
      </KeyboardInputManager>,
    );
    const { map } = capturedProps;

    const upward = map.find(({ name }) => name === 'upward');
    expect(upward?.keys).toContain('ArrowUp');
    expect(upward?.keys).toContain('KeyW');

    const downward = map.find(({ name }) => name === 'downward');
    expect(downward?.keys).toContain('ArrowDown');
    expect(downward?.keys).toContain('KeyS');

    const leftward = map.find(({ name }) => name === 'leftward');
    expect(leftward?.keys).toContain('ArrowLeft');
    expect(leftward?.keys).toContain('KeyA');

    const rightward = map.find(({ name }) => name === 'rightward');
    expect(rightward?.keys).toContain('ArrowRight');
    expect(rightward?.keys).toContain('KeyD');

    const escape = map.find(({ name }) => name === 'escape');
    expect(escape?.keys).toContain('Escape');
  });

  it('passes keyboard events through to children', () => {
    const handler = vi.fn();
    const { getByText } = render(
      <KeyboardInputManager>
        <span onKeyDown={handler}>{'content'}</span>
      </KeyboardInputManager>,
    );
    fireEvent.keyDown(getByText('content'), {
      code: 'ArrowUp',
      key: 'ArrowUp',
    });
    expect(handler).toHaveBeenCalled();
  });
});
