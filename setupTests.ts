import '@testing-library/jest-dom';

import { vi } from 'vitest';

const { ResizeObserver } = window;

/**
 * This is here because the package 'visx' tries
 * to use it and it breaks in tests
 */
beforeAll(() => {
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

afterAll(() => {
  window.ResizeObserver = ResizeObserver;
  vi.restoreAllMocks();
});

// TODO: keep this?
// beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// afterAll(() => server.close());
// afterEach(() => server.resetHandlers());
