import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { KeyboardInputManager } from './KeyboardInputManager';

describe('KeyboardInputManager', () => {
  it('renders children', () => {
    const { getByText } = render(
      <KeyboardInputManager>
        <span>{'child content'}</span>
      </KeyboardInputManager>,
    );
    expect(getByText('child content')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    const { getByText } = render(
      <KeyboardInputManager>
        <span>{'first'}</span>
        <span>{'second'}</span>
      </KeyboardInputManager>,
    );
    expect(getByText('first')).toBeInTheDocument();
    expect(getByText('second')).toBeInTheDocument();
  });
});
