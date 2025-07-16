import { KeyboardControls } from '@react-three/drei';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const KeyboardInputManager = ({ children }: Props) => {
  // TODO: Fix bug where pressing 'Cmd + S' causes infinite downward movement
  // TODO: Fix bug where pressing 'Cmd + A' causes infinite leftward movement
  // TODO: Fix bug where pressing 'Cmd + A' highlights all ui text
  // TODO: Fix bug where pressing 'Cmd + D' causes infinite rightward movement
  // TODO: Fix bug where pressing 'Cmd + W' causes app shutdown

  return (
    <KeyboardControls
      map={[
        { name: 'upward', keys: ['ArrowUp', 'KeyW'] },
        { name: 'downward', keys: ['ArrowDown', 'KeyS'] },
        { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
        { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
        { name: 'escape', keys: ['Escape'] },
      ]}
    >
      { children }
    </KeyboardControls>
  );
};
