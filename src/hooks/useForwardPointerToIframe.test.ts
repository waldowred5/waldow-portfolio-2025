import { fireEvent, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  POINTER_OFFSET_MESSAGE,
  useForwardPointerToIframe,
} from './useForwardPointerToIframe';

const setup = () => {
  const postMessage = vi.fn();
  const iframe = {
    contentWindow: { postMessage },
  } as unknown as HTMLIFrameElement;
  const hook = renderHook(() => useForwardPointerToIframe({ current: iframe }));

  return { postMessage, ...hook };
};

describe('useForwardPointerToIframe', () => {
  it('forwards the mouse offset from the window centre', () => {
    const { postMessage } = setup();
    fireEvent.mouseMove(window, {
      clientX: window.innerWidth / 2 + 40,
      clientY: window.innerHeight / 2 - 20,
    });
    expect(postMessage).toHaveBeenCalledWith(
      { type: POINTER_OFFSET_MESSAGE, x: 40, y: -20 },
      '*',
    );
  });

  it('doubles touch offsets to match the hero parallax', () => {
    const { postMessage } = setup();
    fireEvent.touchMove(window, {
      touches: [
        {
          clientX: window.innerWidth / 2 + 10,
          clientY: window.innerHeight / 2,
        },
      ],
    });
    expect(postMessage).toHaveBeenCalledWith(
      { type: POINTER_OFFSET_MESSAGE, x: 20, y: 0 },
      '*',
    );
  });

  it('stops forwarding once unmounted', () => {
    const { postMessage, unmount } = setup();
    unmount();
    fireEvent.mouseMove(window, { clientX: 0, clientY: 0 });
    expect(postMessage).not.toHaveBeenCalled();
  });
});
