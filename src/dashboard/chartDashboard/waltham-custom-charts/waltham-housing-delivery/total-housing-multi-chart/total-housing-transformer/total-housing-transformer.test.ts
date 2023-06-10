import { it, expect, describe } from 'vitest';

import { totalHousingTransformer } from './total-housing-transformer';

const dataArray = [
  {
    title: 'transforms API and target data into correct data shape',
    data: [
      {
        startYear: 2015,
        'Total Gross': 123,
        'Total Net': 456,
      },
      {
        startYear: 2016,
        'Total Gross': 789,
        'Total Net': 101,
      },
    ],
    targets: {
      2015: 181,
      2016: 155,
    },
    filteredTimeline: [2015, 2016],
    expected: {
      transformedData: [
        [
          { x: '2015', y: 123 },
          { x: '2016', y: 789 },
        ],
        [
          { x: '2015', y: 456 },
          { x: '2016', y: 101 },
        ],
      ],
      transformedTargets: [
        { x: '2015', y: 181 },
        { x: '2016', y: 155 },
      ],
    },
  },
  {
    title: 'pads gap years with `null` value',
    data: [
      {
        startYear: 2015,
        'Total Gross': 123,
        'Total Net': 456,
      },
      {
        startYear: 2017,
        'Total Gross': 456,
        'Total Net': 789,
      },
    ],
    targets: {
      2015: 254,
      2016: 191,
      2017: 181,
    },
    filteredTimeline: [2015, 2016, 2017],
    expected: {
      transformedData: [
        [
          { x: '2015', y: 123 },
          { x: '2016', y: null },
          { x: '2017', y: 456 },
        ],
        [
          { x: '2015', y: 456 },
          { x: '2016', y: null },
          { x: '2017', y: 789 },
        ],
      ],
      transformedTargets: [
        { x: '2015', y: 254 },
        { x: '2016', y: 191 },
        { x: '2017', y: 181 },
      ],
    },
  },
  {
    title: 'returns data from lowest year to highest year of either dataset',
    data: [
      {
        startYear: 2016,
        'Total Gross': 123,
        'Total Net': 456,
      },
    ],
    targets: {
      2015: 191,
      2017: 254,
    },
    filteredTimeline: [2015, 2016, 2017],
    expected: {
      transformedData: [
        [
          { x: '2015', y: null },
          { x: '2016', y: 123 },
          { x: '2017', y: null },
        ],
        [
          { x: '2015', y: null },
          { x: '2016', y: 456 },
          { x: '2017', y: null },
        ],
      ],
      transformedTargets: [
        { x: '2015', y: 191 },
        { x: '2017', y: 254 },
      ],
    },
  },
  {
    title: 'works if target data is undefined',
    data: [
      {
        startYear: 2015,
        'Total Gross': 123,
        'Total Net': 456,
      },
      {
        startYear: 2016,
        'Total Gross': 789,
        'Total Net': 101,
      },
    ],
    targets: undefined,
    filteredTimeline: [2015, 2016],
    expected: {
      transformedData: [
        [
          { x: '2015', y: 123 },
          { x: '2016', y: 789 },
        ],
        [
          { x: '2015', y: 456 },
          { x: '2016', y: 101 },
        ],
      ],
      transformedTargets: null,
    },
  },
  {
    title: 'works if target data is empty object',
    data: [
      {
        startYear: 2015,
        'Total Gross': 123,
        'Total Net': 456,
      },
      {
        startYear: 2016,
        'Total Gross': 789,
        'Total Net': 101,
      },
    ],
    targets: {},
    filteredTimeline: [2015, 2016],
    expected: {
      transformedData: [
        [
          { x: '2015', y: 123 },
          { x: '2016', y: 789 },
        ],
        [
          { x: '2015', y: 456 },
          { x: '2016', y: 101 },
        ],
      ],
      transformedTargets: null,
    },
  },
  {
    title: 'returns undefined if data is not present',
    data: undefined,
    targets: undefined,
    filteredTimeline: [],
    expected: undefined,
  },
];

describe('totalHousingTransformer', () => {
  dataArray.forEach(({ title, data, targets, filteredTimeline, expected }) =>
    it(title, () => {
      const result = totalHousingTransformer(data, targets, filteredTimeline);
      expect(result).toEqual(expected);
    })
  );
});
