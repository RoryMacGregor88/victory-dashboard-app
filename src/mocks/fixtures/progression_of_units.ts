export type ProgressionOfUnitsData = {
  startYear: number;
  'Ahead of Schedule': number;
  'Behind Schedule': number;
  'On Track': number;
}[];

const data: ProgressionOfUnitsData = [
  {
    startYear: 2018,
    'Ahead of Schedule': 270,
    'Behind Schedule': 493,
    'On Track': 31,
  },
  {
    startYear: 2019,
    'Ahead of Schedule': 367,
    'Behind Schedule': 269,
    'On Track': 22,
  },
  {
    startYear: 2020,
    'Ahead of Schedule': 46,
    'Behind Schedule': 62,
    'On Track': 22,
  },
  {
    startYear: 2021,
    'Ahead of Schedule': 84,
    'Behind Schedule': 63,
    'On Track': 16,
  },
  {
    startYear: 2022,
    'Ahead of Schedule': 23,
    'Behind Schedule': 29,
    'On Track': 10,
  },
];

export default data;
