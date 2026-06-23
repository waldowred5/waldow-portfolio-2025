import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Icon } from './Icon';

describe('Icon', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Icon>
        <span>{'icon'}</span>
      </Icon>,
    );
    expect(getByText('icon')).toBeInTheDocument();
  });

  it('wraps with anchor tag when href provided', () => {
    const { container } = render(
      <Icon href={'https://example.com'}>{'x'}</Icon>,
    );
    const anchor = container.querySelector('a');
    expect(anchor).toHaveAttribute('href', 'https://example.com');
    expect(anchor).toHaveAttribute('target', '_blank');
  });

  it('renders without anchor when no href', () => {
    const { container } = render(<Icon>{'x'}</Icon>);
    expect(container.querySelector('a')).toBeNull();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    const { container } = render(<Icon onClick={onClick}>{'x'}</Icon>);
    container.querySelector('div')!.click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders without onClick without throwing', () => {
    const { container } = render(<Icon>{'x'}</Icon>);
    expect(() => container.querySelector('div')!.click()).not.toThrow();
  });
});
