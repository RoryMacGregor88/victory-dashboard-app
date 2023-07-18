import { describe, it, expect } from 'vitest';

import { AffordableHousingTransformer } from './affordable-housing-transformer';

// TODO: must combine this into one test suite, was originally getPairedValues and computePercentages

describe('AffordableHousingTransformer', () => {
  it('filters out all non-paired elements from data and targets', () => {
    const data = [
        { startYear: 2011, 'Affordable Housing': 123 },
        { startYear: 2012, 'Affordable Housing': 456 },
        { startYear: 2013, 'Affordable Housing': null },
      ],
      targets = {
        2011: 123,
        2013: 456,
      },
      expected = {
        pairedData: [{ startYear: 2011, 'Affordable Housing': 123 }],
        pairedTargets: { 2011: 123 },
      };

    const result = AffordableHousingTransformer(data, targets);
    expect(result).toEqual(expected);
  });

  it('returns undefined if no data', () => {
    const result = AffordableHousingTransformer(undefined, { 2010: 123 });
    expect(result).toBeUndefined();
  });

  it('returns undefined if no targets', () => {
    const result = AffordableHousingTransformer(
      [{ startYear: 2010, 'Affordable Housing': 123 }],
      undefined
    );
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
