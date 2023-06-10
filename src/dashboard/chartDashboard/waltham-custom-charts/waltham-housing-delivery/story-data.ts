import { groupedDataTransformer } from '~/dashboard/chartDashboard/utils';

export const groupedApiData = groupedDataTransformer([
  {
    Year: '2014-2015',
    'Total Gross': 743,
    'Total Net': 677,
  },
  {
    Year: '2015-2016',
    'Total Gross': 1089,
    'Total Net': 901,
  },
  {
    Year: '2016-2017',
    'Total Gross': 1114,
    'Total Net': 997,
  },
  {
    Year: '2017-2018',
    'Total Gross': 1331,
    'Total Net': 1103,
  },
  {
    Year: '2018-2019',
    'Total Gross': 1349,
    'Total Net': 1211,
  },
  {
    Year: '2019-2020',
    'Total Gross': 1468,
    'Total Net': 1032,
  },
  {
    Year: '2020-2021',
    'Total Gross': 907,
    'Total Net': 899,
  },
]);

export const stackedApiData = [
  {
    name: 'Gross',
    label: 'Housing Delivery in Units',
    description: ' Gross housing delivery in units per monitoring year',
    units: 'Units',
    data: [
      {
        Year: '2014-2015',
        'Affordable Rent': 143,
        Intermediate: 97,
        Market: 124,
        'Social Rented': 178,
        'Private Rented Sector': 201,
      },
      {
        Year: '2015-2016',
        'Affordable Rent': 321,
        Intermediate: 158,
        Market: 133,
        'Social Rented': 170,
        'Private Rented Sector': 297,
      },
      {
        Year: '2016-2017',
        'Affordable Rent': 326,
        Intermediate: 90,
        Market: 149,
        'Social Rented': 174,
        'Private Rented Sector': 371,
      },
      {
        Year: '2017-2018',
        'Affordable Rent': 295,
        Intermediate: 197,
        Market: 179,
        'Social Rented': 218,
        'Private Rented Sector': 442,
      },
      {
        Year: '2018-2019',
        'Affordable Rent': 304,
        Intermediate: 183,
        Market: 199,
        'Social Rented': 230,
        'Private Rented Sector': 433,
      },
      {
        Year: '2019-2020',
        'Affordable Rent': 416,
        Intermediate: 85,
        Market: 203,
        'Social Rented': 251,
        'Private Rented Sector': 517,
      },
      {
        Year: '2020-2021',
        'Affordable Rent': 277,
        Intermediate: 105,
        Market: 90,
        'Social Rented': 143,
        'Private Rented Sector': 292,
      },
    ],
  },
  {
    name: 'Net',
    label: 'Housing Delivery in Units',
    description: ' Net housing delivery in units per monitoring year',
    units: 'Units',
    data: [
      {
        Year: '2014-2015',
        'Affordable Rent': 100,
        Intermediate: 84,
        Market: 122,
        'Social Rented': 173,
        'Private Rented Sector': 198,
      },
      {
        Year: '2015-2016',
        'Affordable Rent': 303,
        Intermediate: 130,
        Market: 124,
        'Social Rented': 127,
        'Private Rented Sector': 217,
      },
      {
        Year: '2016-2017',
        'Affordable Rent': 322,
        Intermediate: 88,
        Market: 120,
        'Social Rented': 156,
        'Private Rented Sector': 311,
      },
      {
        Year: '2017-2018',
        'Affordable Rent': 218,
        Intermediate: 190,
        Market: 179,
        'Social Rented': 216,
        'Private Rented Sector': 300,
      },
      {
        Year: '2018-2019',
        'Affordable Rent': 246,
        Intermediate: 159,
        Market: 177,
        'Social Rented': 215,
        'Private Rented Sector': 414,
      },
      {
        Year: '2019-2020',
        'Affordable Rent': 245,
        Intermediate: 76,
        Market: 191,
        'Social Rented': 178,
        'Private Rented Sector': 342,
      },
      {
        Year: '2020-2021',
        'Affordable Rent': 276,
        Intermediate: 105,
        Market: 90,
        'Social Rented': 143,
        'Private Rented Sector': 285,
      },
    ],
  },
];
