import { it, expect, describe } from 'vitest';

import {
  lineDataTransformer,
  userTargetTransformer,
  filterEmptyStrings,
  getTargetTotals,
  getPastYears,
  getUser5YearTotals,
  getDataTimeline,
  getFilteredTimeline,
  computePercentages,
} from './utils';

describe('Waltham Forest Data Transformers', () => {
  describe('lineDataTransformer', () => {
    it('gives all entries uniform keys, and sets missing data to null', () => {
      const data = [
          { 'test-key-1': 123 },
          { 'test-key-1': 456, 'test-key-2': 789 },
        ],
        expected = [
          { 'test-key-1': 123, 'test-key-2': null },
          { 'test-key-1': 456, 'test-key-2': 789 },
        ];

      const result = lineDataTransformer(data);
      expect(result).toEqual(expected);
    });

    it('returns original data if no non-shared keys', () => {
      const data = [
        { 'test-key-1': 123, 'test-key-2': 456 },
        { 'test-key-1': 789, 'test-key-2': 101 },
      ];

      const result = lineDataTransformer(data);
      expect(result).toEqual(data);
    });

    it('only affects undefined keys', () => {
      const data = [
        { 'test-key-1': '', 'test-key-2': 0 },
        { 'test-key-1': false, 'test-key-2': null },
      ];

      const result = lineDataTransformer(data);
      expect(result).toEqual(data);
    });
  });

  describe('filterEmptyStrings', () => {
    it('filters out empty string values from object', () => {
      const data = {
          'key-1': '123',
          'key-2': '',
          'key-3': '456',
        },
        expected = {
          'key-1': 123,
          'key-3': 456,
        };

      const result = filterEmptyStrings(data);
      expect(result).toEqual(expected);
    });

    it('does not filter 0 values', () => {
      const data = {
          'key-1': '123',
          'key-2': '0',
          'key-3': '456',
        },
        expected = {
          'key-1': 123,
          'key-2': 0,
          'key-3': 456,
        };

      const result = filterEmptyStrings(data);
      expect(result).toEqual(expected);
    });

    it('returns undefined if data is not present', () => {
      const result = filterEmptyStrings(undefined);
      expect(result).toBeUndefined();
    });
  });

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

    it('returns undefined if no timeline or selected year', () => {
      const result = getFilteredTimeline(undefined, undefined);

      expect(result).toBeUndefined();
    });
  });

  describe('compute percentages', () => {
    it('computePercentages works', () => {
      const timeline = [2017, 2018, 2019, 2020, 2021, 2022],
        key = 'Affordable Housing',
        data = [
          {
            startYear: 2017,
            'Affordable Housing': 62,
          },
          {
            startYear: 2018,
            'Affordable Housing': 69,
          },
          {
            startYear: 2019,
            'Affordable Housing': 54,
          },
          {
            startYear: 2020,
            'Affordable Housing': 53,
          },
          {
            startYear: 2021,
            'Affordable Housing': 0,
          },
          {
            startYear: 2022,
            'Affordable Housing': 33,
          },
        ],
        targets = {
          2018: 100,
          2019: 100,
          2020: 100,
          2021: 200,
          2022: 200,
        };
      const result = computePercentages(
        timeline,
        data,
        targets,
        'Affordable Housing'
      );
      expect(result[0][key]).toBeNull(); // not matching data
      expect(result[1][key]).toBe(69);
      expect(result[2][key]).toBe(54);
      expect(result[3][key]).toBe(53);
      expect(result[4][key]).toBeNull();
      expect(result[5][key]).toBe(17); // 33/200
    });
  });
});
