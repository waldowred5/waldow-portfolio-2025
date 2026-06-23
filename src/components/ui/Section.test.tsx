import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Section } from './Section';

describe('Section', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Section>
        <span>{'content'}</span>
      </Section>,
    );
    expect(getByText('content')).toBeInTheDocument();
  });

  it('renders without children', () => {
    const { container } = render(<Section />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
