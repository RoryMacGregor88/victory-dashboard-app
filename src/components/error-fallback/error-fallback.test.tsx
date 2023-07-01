// @ts-nocheck
import React from 'react';

import { ErrorFallback } from 'components';
import { render, screen } from 'test/test-utils';

describe('<ErrorFallback />', () => {
  it('Shows the error stack if present', () => {
    const stack = 'This is the stack';
    render(<ErrorFallback error={{ stack }} />);
    expect(screen.getByRole('alert')).toHaveTextContent(stack);
  });

  it("Shows the error message if there's no stack", () => {
    const message = 'This is the error message';
    render(<ErrorFallback error={{ message }} />);
    expect(screen.getByRole('alert')).toHaveTextContent(message);
  });

  it('Shows the error message if there is a stack but messageOnly is true', () => {
    const message = 'This is the error message';
    const stack = 'This is the stack';
    render(<ErrorFallback error={{ message, stack }} messageOnly />);
    expect(screen.getByRole('alert')).toHaveTextContent(message);
  });
});
