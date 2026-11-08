import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useCodingSceneReady } from '@/store/useCodingSceneReady.ts';
import { SCENE, useScene } from '@/store/useScene.ts';

import { MeetTheDevButton } from './MeetTheDevButton';

afterEach(() => {
  useCodingSceneReady.setState({ isReady: false });
  useScene.setState({
    currentScene: SCENE.HERO,
    pendingScene: null,
    isFadedOut: false,
  });
});

describe('MeetTheDevButton', () => {
  it('is disabled and transparent with a spinner while loading', () => {
    render(<MeetTheDevButton />);
    const button = screen.getByRole('button', {
      name: 'Loading Meet the Dev scene',
    });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('bg-transparent');
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.queryByText('Meet the Dev')).not.toBeInTheDocument();
  });

  it('reveals the label on the ActionBar surface once the scene is ready', () => {
    render(<MeetTheDevButton />);
    act(() => useCodingSceneReady.setState({ isReady: true }));
    const button = screen.getByRole('button', { name: 'Meet the Dev' });
    expect(button).toBeEnabled();
    expect(button).toHaveClass('bg-black/50');
    expect(screen.getByText('Meet the Dev')).toBeInTheDocument();
  });

  it('switches to the coding scene on click', () => {
    useCodingSceneReady.setState({ isReady: true });
    render(<MeetTheDevButton />);
    fireEvent.click(screen.getByRole('button', { name: 'Meet the Dev' }));
    expect(useScene.getState().currentScene).toBe(SCENE.CODING);
  });

  it('holds the label back until the button is visible', () => {
    useCodingSceneReady.setState({ isReady: true });
    const { rerender } = render(<MeetTheDevButton isVisible={false} />);
    expect(screen.queryByText('Meet the Dev')).not.toBeInTheDocument();

    rerender(<MeetTheDevButton isVisible />);
    expect(screen.getByText('Meet the Dev')).toBeInTheDocument();
  });
});
