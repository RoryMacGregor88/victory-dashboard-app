import { describe, expect, it } from 'vitest';

import data from '~/mocks/fixtures/deliverable_supply_summary';

import { labelsForArrayOfObjects } from './utils/utils';

describe('labelsForArrayOfObjects', () => {
  it('adds all properties except the specified one', () => {
    const result = labelsForArrayOfObjects(data),
      expected = [432, 529, 481, 510, 510];

    expect(result).toEqual(expected);
  });
});
