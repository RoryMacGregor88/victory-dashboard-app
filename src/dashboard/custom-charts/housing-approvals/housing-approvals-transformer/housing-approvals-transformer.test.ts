import { describe, expect, it } from 'vitest';

import { housingApprovalsTransformer } from './housing-approvals-transformer';

describe('housingApprovalsTransformer', () => {
  it('gives all entries uniform keys, and sets missing data to null', () => {
    const data = [
        { 'test-key-1': 123 },
        { 'test-key-1': 456, 'test-key-2': 789 },
      ],
      expected = [
        { 'test-key-1': 123, 'test-key-2': null },
        { 'test-key-1': 456, 'test-key-2': 789 },
      ];

    const result = housingApprovalsTransformer(data);
    expect(result).toEqual(expected);
  });

  it('returns original data if no non-shared keys', () => {
    const data = [
      { 'test-key-1': 123, 'test-key-2': 456 },
      { 'test-key-1': 789, 'test-key-2': 101 },
    ];

    const result = housingApprovalsTransformer(data);
    expect(result).toEqual(data);
  });

  it('only affects undefined keys', () => {
    const data = [
      { 'test-key-1': '', 'test-key-2': 0 },
      { 'test-key-1': false, 'test-key-2': null },
    ];

    const result = housingApprovalsTransformer(data);
    expect(result).toEqual(data);
  });
});
