import { it, expect, describe, vi } from 'vitest';

import { tenureHousingTransformer } from './tenure-housing-transformer';

vi.mock('~/dashboard/chartDashboard/waltham.constants', () => ({
  housingTenureTypes: {
    market: 'Market',
    intermediate: 'Intermediate',
  },
}));

const dataArray = [
  {
    title: 'transforms API and target data into correct data shape',
    data: [
      {
        startYear: 2015,
        Market: 123,
        Intermediate: 456,
      },
      {
        startYear: 2016,
        Market: 789,
        Intermediate: 101,
      },
    ],
    targets: {
      2015: 181,
      2016: 155,
    },
    filteredTimeline: [2015, 2016],
    expected: {
      transformedData: [
        {
          startYear: '2015',
          Market: 123,
          Intermediate: 456,
        },
        {
          startYear: '2016',
          Market: 789,
          Intermediate: 101,
        },
      ],
      transformedTargets: [
        { x: '2015', y: 181 },
        { x: '2016', y: 155 },
      ],
    },
  },
  {
    title: 'pads null values if there are missing years',
    data: [
      {
        startYear: 2015,
        Market: 123,
        Intermediate: 456,
      },
      {
        startYear: 2016,
        Market: 789,
        Intermediate: 101,
      },
    ],
    targets: {
      2014: 181,
      2015: 155,
    },
    filteredTimeline: [2014, 2015, 2016],
    expected: {
      transformedData: [
        { startYear: '2014', Market: null, Intermediate: null },
        {
          startYear: '2015',
          Market: 123,
          Intermediate: 456,
        },
        {
          startYear: '2016',
          Market: 789,
          Intermediate: 101,
        },
      ],
      transformedTargets: [
        { x: '2014', y: 181 },
        { x: '2015', y: 155 },
      ],
    },
  },
  {
    title: 'returns lowest-to-highest year from both datasets',
    data: [
      {
        startYear: 2015,
        Market: 123,
        Intermediate: 456,
      },
    ],
    targets: {
      2015: 181,
      2016: 155,
    },
    filteredTimeline: [2015, 2016],
    expected: {
      transformedData: [
        {
          startYear: '2015',
          Market: 123,
          Intermediate: 456,
        },
        {
          startYear: '2016',
          Market: null,
          Intermediate: null,
        },
      ],
      transformedTargets: [
        { x: '2015', y: 181 },
        { x: '2016', y: 155 },
      ],
    },
  },
  {
    title: 'returns null targets if no targets present',
    data: [
      {
        startYear: 2015,
        Market: 123,
        Intermediate: 456,
      },
    ],
    targets: undefined,
    filteredTimeline: [2015],
    expected: {
      transformedData: [
        {
          startYear: '2015',
          Market: 123,
          Intermediate: 456,
        },
      ],
      transformedTargets: null,
    },
  },
  {
    title: 'returns undefined if no data present',
    data: undefined,
    targets: undefined,
    expected: undefined,
  },
];

describe('tenureHousingTransformer', () => {
  dataArray.forEach(({ title, data, targets, filteredTimeline, expected }) =>
    it(title, () => {
      const result = tenureHousingTransformer(data, targets, filteredTimeline);
      expect(result).toEqual(expected);
    })
  );
});
