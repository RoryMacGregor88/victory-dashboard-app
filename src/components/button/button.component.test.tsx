import { vi, it, expect, describe } from 'vitest';

import { render, fireEvent } from '@testing-library/react';

import { Button } from './button.component';

describe.only('Button Component', () => {
  it('should render a button tag with text under normal circumstances', () => {
    const { container, getByText } = render(<Button>Some Text</Button>);

    expect(container.querySelector('button')).toBeInTheDocument();
    expect(getByText('Some Text')).toBeInTheDocument();
  });

  it('should render an `a` tag if passed a `href` attribute', () => {
    const { container, getByText } = render(
      <Button href='foo'>Some Text</Button>
    );

    expect(container.querySelector('a')).toBeInTheDocument();
    expect(getByText('Some Text')).toBeInTheDocument();
  });

  it('should propagates the click event properly', () => {
    const handler = vi.fn();
    const { getByText } = render(<Button onClick={handler}>Some Text</Button>);

    fireEvent.click(getByText('Some Text'));
    expect(handler).toHaveBeenCalled();
  });

  describe('disabled', () => {
    it('should not propagate the click event', () => {
      const handler = vi.fn();
      const { getByText } = render(
        <Button onClick={handler} disabled={true}>
          Some Text
        </Button>
      );

      fireEvent.click(getByText('Some Text'));
      expect(handler).not.toHaveBeenCalled();
    });
  });
});
