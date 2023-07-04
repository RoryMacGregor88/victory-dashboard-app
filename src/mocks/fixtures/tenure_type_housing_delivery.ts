export type TenureTypeHousingData = {
  'Affordable Rent (not at LAR benchmark rents)': number | null;
  'London Affordable Rent': number | null;
  Intermediate: number | null;
  'Intermediate Other': number | null;
  'Market for sale': number | null;
  'Social Rent': number | null;
  startYear: number | null;
}[];

const data: TenureTypeHousingData = [
  {
    'Affordable Rent (not at LAR benchmark rents)': 75,
    'London Affordable Rent': null,
    Intermediate: 151,
    'Intermediate Other': null,
    'Market for sale': 222,
    'Social Rent': 268,
    startYear: 2013,
  },
  {
    'Affordable Rent (not at LAR benchmark rents)': 149,
    'London Affordable Rent': null,
    Intermediate: 119,
    'Intermediate Other': null,
    'Market for sale': 542,
    'Social Rent': 52,
    startYear: 2014,
  },
  {
    'Affordable Rent (not at LAR benchmark rents)': 277,
    'London Affordable Rent': null,
    Intermediate: 136,
    'Intermediate Other': null,
    'Market for sale': 395,
    'Social Rent': null,
    startYear: 2015,
  },
  {
    'Affordable Rent (not at LAR benchmark rents)': 69,
    'London Affordable Rent': null,
    Intermediate: 66,
    'Intermediate Other': null,
    'Market for sale': 574,
    'Social Rent': null,
    startYear: 2016,
  },
  {
    'Affordable Rent (not at LAR benchmark rents)': 319,
    'London Affordable Rent': null,
    Intermediate: 290,
    'Intermediate Other': null,
    'Market for sale': 1027,
    'Social Rent': 36,
    startYear: 2017,
  },
  {
    'Affordable Rent (not at LAR benchmark rents)': 27,
    'London Affordable Rent': null,
    Intermediate: 62,
    'Intermediate Other': null,
    'Market for sale': 396,
    'Social Rent': 43,
    startYear: 2018,
  },
  {
    'Affordable Rent (not at LAR benchmark rents)': 8,
    'London Affordable Rent': 11,
    Intermediate: null,
    'Intermediate Other': 36,
    'Market for sale': 432,
    'Social Rent': 71,
    startYear: 2019,
  },
  {
    'Affordable Rent (not at LAR benchmark rents)': 56,
    Intermediate: 59,
    'Intermediate Other': 1,
    'Market for sale': 202,
    'Social Rent': 31,
    'London Affordable Rent': null,
    startYear: 2020,
  },
  {
    'Affordable Rent (not at LAR benchmark rents)': 108,
    Intermediate: 116,
    'Intermediate Other': 5,
    'London Affordable Rent': 2,
    'Market for sale': 462,
    'Social Rent': 56,
    startYear: 2021,
  },
  {
    'Affordable Rent (not at LAR benchmark rents)': 17,
    Intermediate: 19,
    'Market for sale': 92,
    'Social Rent': 8,
    'Intermediate Other': null,
    'London Affordable Rent': null,
    startYear: 2022,
  },
];

export default data;
