import { it, expect, describe } from 'vitest';

import {
  userTargetTransformer,
  getTargetTotals,
  getPastYears,
  getUser5YearTotals,
  getDataTimeline,
  getFilteredTimeline,
  labelsForArrayOfObjectsInclusive,
  getStackDatumTotal,
} from './utils';

describe('Utility Functions', () => {
  describe('getTargetTotals', () => {
    it('totals up all of the values by year', () => {
      const data = {
          tenureType1: {
            '2015-2016': '100',
            '2016-2017': '200',
            '2018-2019': '300',
          },
          tenureType2: {
            '2015-2016': '400',
            '2016-2017': '500',
            '2018-2019': '600',
          },
          tenureType3: {
            '2015-2016': '700',
            '2016-2017': '800',
            '2018-2019': '900',
          },
        },
        expected = {
          '2015-2016': 1200,
          '2016-2017': 1500,
          '2018-2019': 1800,
        };

      const result = getTargetTotals(data);
      expect(result).toEqual(expected);
    });

    it('works with uneven data', () => {
      const data = {
          tenureType1: {
            '2015-2016': '100',
            '2016-2017': '50',
          },
          tenureType2: {
            '2015-2016': '400',
            '2016-2017': '0',
            '2017-2018': '600',
            '2018-2019': '200',
          },
          tenureType3: {
            '2014-2015': '200',
            '2016-2017': '800',
            '2018-2019': '900',
            '2019-2020': '700',
          },
          tenureType4: {},
        },
        expected = {
          '2014-2015': 200,
          '2015-2016': 500,
          '2016-2017': 850,
          '2017-2018': 600,
          '2018-2019': 1100,
          '2019-2020': 700,
        };

      const result = getTargetTotals(data);
      expect(result).toEqual(expected);
    });

    it('excludes totalHousing values', () => {
      const data = {
          tenureType1: {
            '2015-2016': '100',
            '2016-2017': '200',
          },
          tenureType2: {
            '2015-2016': '400',
            '2016-2017': '200',
          },
          totalHousing: {
            '2015-2016': '2000',
            '2016-2017': '3000',
          },
        },
        expected = {
          '2015-2016': 500,
          '2016-2017': 400,
        };

      const result = getTargetTotals(data);
      expect(result).toEqual(expected);
    });

    it('returns undefined if data is not present', () => {
      const result = getTargetTotals(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('userTargetTransformer', () => {
    it('transforms data', () => {
      const input = {
          2010: 123,
          2012: 456,
        },
        expected = [
          {
            x: '2010',
            y: 123,
          },
          {
            x: '2012',
            y: 456,
          },
        ];

      const result = userTargetTransformer(input, [2010, 2012]);
      expect(result).toEqual(expected);
    });

    it('excludes values not present in timeline', () => {
      const input = {
          2010: 123,
          2011: 456,
        },
        expected = [
          {
            x: '2010',
            y: 123,
          },
        ];

      const result = userTargetTransformer(input, [2010]);
      expect(result).toEqual(expected);
    });

    it('returns all data if no timeline is provided', () => {
      const input = {
          2010: 123,
          2011: 456,
        },
        expected = [
          {
            x: '2010',
            y: 123,
          },
          {
            x: '2011',
            y: 456,
          },
        ];

      const result = userTargetTransformer(input, undefined);
      expect(result).toEqual(expected);
    });

    it('returns null if all targets fall outwith timeline', () => {
      const input = {
        2012: 123,
        2013: 456,
      };

      const result = userTargetTransformer(input, [2010, 2011]);
      expect(result).toBeNull();
    });

    it('returns undefined if data is not present', () => {
      const result = userTargetTransformer(undefined, []);
      expect(result).toBeUndefined();
    });
  });

  describe('getPastYears', () => {
    it('returns specified no. of previous years, formatted correctly', () => {
      const expected = [2021, 2022, 2023];

      const result = getPastYears(3);
      expect(result).toEqual(expected);
    });

    it('defaults to 5 years if no args passed', () => {
      const expected = [2019, 2020, 2021, 2022, 2023];

      const result = getPastYears();
      expect(result).toEqual(expected);
    });
  });

  describe('getUser5YearTotals', () => {
    it('totals up data for last 5 years', () => {
      const data = {
          2019: '10',
          2020: '20',
          2021: '30',
          2022: '40',
          2023: '50',
        },
        expected = 150;

      const result = getUser5YearTotals(data);
      expect(result).toEqual(expected);
    });

    it('filters values outside of last 5 years', () => {
      const data = {
          2017: '1000',
          2018: '2000',
          2019: '10',
          2020: '20',
          2021: '30',
          2022: '40',
          2023: '50',
        },
        expected = 150;

      const result = getUser5YearTotals(data);
      expect(result).toEqual(expected);
    });

    it('works if not all 5 years have values', () => {
      const data = {
          2019: '10',
          2020: '20',
          2021: '30',
        },
        expected = 60;

      const result = getUser5YearTotals(data);
      expect(result).toEqual(expected);
    });

    it('returns undefined if data is empty object', () => {
      const result = getUser5YearTotals({});
      expect(result).toBeUndefined();
    });

    it('returns undefined if data is not present', () => {
      const result = getUser5YearTotals(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('getDataTimeline', () => {
    it('returns a timeline built from data years', () => {
      const data = [{ startYear: 2010 }, { startYear: 2014 }],
        expected = [2010, 2011, 2012, 2013, 2014];

      const result = getDataTimeline(data, undefined);
      expect(result).toEqual(expected);
    });

    it('combines both datasets', () => {
      const data = [{ startYear: 2010 }, { startYear: 2011 }],
        targets = {
          2008: '123',
          2012: '123',
        },
        expected = [2008, 2009, 2010, 2011, 2012];

      const result = getDataTimeline(data, targets);
      expect(result).toEqual(expected);
    });

    it('pads timeline when no. of years less than constant', () => {
      const data = [{ startYear: 2010 }],
        targets = {
          2008: '123',
          2009: '123',
        },
        expected = [2006, 2007, 2008, 2009, 2010];

      const result = getDataTimeline(data, targets);
      expect(result).toEqual(expected);
    });

    it('returns undefined if data is not present', () => {
      const result = getDataTimeline(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('getFilteredTimeline', () => {
    it('filters the timeline to 5 year slice by default', () => {
      const timeline = ['1', '2', '3', '4', '5', '6', '7'],
        selectedYear = '7',
        expected = ['3', '4', '5', '6', '7'];

      const result = getFilteredTimeline(timeline, selectedYear);

      expect(result).toEqual(expected);
    });

    it('filters timeline by specific range if arg passed', () => {
      const timeline = ['1', '2', '3', '4', '5', '6', '7'],
        selectedYear = '7',
        expected = ['5', '6', '7'];

      const result = getFilteredTimeline(timeline, selectedYear, 2);

      expect(result).toEqual(expected);
    });

    it('returns undefined if timeline is undefines', () => {
      const result = getFilteredTimeline(undefined, '7');

      expect(result).toBeUndefined();
    });

    it('returns undefined if selected year is undefined', () => {
      const timeline = ['1', '2', '3', '4', '5', '6', '7'];

      const result = getFilteredTimeline(timeline, undefined);

      expect(result).toBeUndefined();
    });
  });

  describe('Tooltip Utilities', () => {
    const MOCK_DATA = [
      { Year: '2012-2013', foo: 120, bar: 100, baz: 212 },
      { Year: '2012-2013', foo: 220, bar: 90, baz: 219 },
      { Year: '2012-2013', foo: 150, bar: 120, baz: 211 },
      { Year: '2012-2013', foo: 120, bar: 190, baz: 200 },
      { Year: '2012-2013', foo: 100, bar: 220, baz: 190 },
    ];

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
});
