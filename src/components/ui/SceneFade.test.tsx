import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useScene } from '@/store/useScene.ts';

import { SceneFade } from './SceneFade';

afterEach(() => {
  useScene.setState({ isFadedOut: false });
});

describe('SceneFade', () => {
  it('is transparent while no scene swap is in progress', () => {
    const { container } = render(<SceneFade />);
    expect(container.firstChild).toHaveClass('opacity-0');
  });

  it('becomes opaque while the scene is faded out', () => {
    const { container } = render(<SceneFade />);
    act(() => useScene.setState({ isFadedOut: true }));
    expect(container.firstChild).toHaveClass('opacity-100');
  });
});
