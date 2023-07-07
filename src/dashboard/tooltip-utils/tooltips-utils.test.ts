import { it, expect, describe } from 'vitest';

import {
  labelsForArrayOfObjects,
  labelsForArrayOfObjectsInclusive,
  getStackDatumTotal,
} from './tooltips-utils';

const MOCK_DATA = [
  { Year: '2012-2013', foo: 120, bar: 100, baz: 212 },
  { Year: '2012-2013', foo: 220, bar: 90, baz: 219 },
  { Year: '2012-2013', foo: 150, bar: 120, baz: 211 },
  { Year: '2012-2013', foo: 120, bar: 190, baz: 200 },
  { Year: '2012-2013', foo: 100, bar: 220, baz: 190 },
];

describe('Tooltip Utilities', () => {
  describe('labelsForArrayOfObjects', () => {
    it('adds all properties except the specified one', () => {
      const result = labelsForArrayOfObjects(MOCK_DATA, 'Year');
      expect(result).toEqual([432, 529, 481, 510, 510]);
    });
    it('allows custom formatting', () => {
      const result = labelsForArrayOfObjects(
        MOCK_DATA,
        'Year',
        (item) => `x${item}`
      );
      expect(result).toEqual(['x432', 'x529', 'x481', 'x510', 'x510']);
    });
    it('returns empty array if no data passed', () => {
      const result = labelsForArrayOfObjects(undefined, 'Year');
      expect(result).toEqual([]);
    });
  });

  describe('labelsForArrayOfObjectsInclusive', () => {
    it('adds all properties except the specified one', () => {
      const result = labelsForArrayOfObjectsInclusive(MOCK_DATA, [
        'foo',
        'bar',
      ]);
      expect(result).toEqual([220, 310, 270, 310, 320]);
    });
    it('allows custom formatting', () => {
      const result = labelsForArrayOfObjectsInclusive(
        MOCK_DATA,
        ['foo', 'bar'],
        (item) => `x${item}`
      );
      expect(result).toEqual(['x220', 'x310', 'x270', 'x310', 'x320']);
    });
    it('returns empty array if no data passed', () => {
      const result = labelsForArrayOfObjectsInclusive(undefined, ['Year']);
      expect(result).toEqual([]);
    });
  });

  describe('getStackDatumTotal', () => {
    const testData = {
      key1: 100,
      key2: 200,
      key3: 'Non-related value',
    };
    it('totals data values', () => {
      const ranges = ['key1', 'key2'];
      const result = getStackDatumTotal(testData, ranges);
      expect(result).toEqual('Total: 300');
    });

    it('shows no `Total: ` message when only one range present', () => {
      const ranges = ['key2'];
      const result = getStackDatumTotal(testData, ranges);
      expect(result).toEqual('200');
    });

    it('returns undefined if no data present', () => {
      const result = getStackDatumTotal(undefined, []);
      expect(result).toBeUndefined();
    });
  });
});
