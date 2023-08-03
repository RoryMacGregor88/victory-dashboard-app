import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '~/test/test.utils';

import { Button } from './button.component';

describe('Button Component', () => {
  it('renders', () => {
    render(<Button onClick={vi.fn()}>Some Text</Button>);

    expect(
      screen.getByRole('button', { name: 'Some Text' }),
    ).toBeInTheDocument();
  });

  it('call click handler', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Some Text</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Some Text' }));
    expect(onClick).toHaveBeenCalled();
  });

  it('disables button if disabled prop present', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Some Text
      </Button>,
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
