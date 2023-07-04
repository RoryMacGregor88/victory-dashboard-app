export type TotalHousingDeliveryData = {
  name: string;
  label: string;
  description: string;
  units: string;
  data: {
    Year: string;
    'Total Gross': number;
    'Total Net': number;
  }[];
}[];

const data: TotalHousingDeliveryData = [
  {
    name: 'Housing Delivery in Units',
    label: 'Housing Delivery in Units',
    description:
      ' Gross/Net housing delivery in units per monitoring year. Gross values for 2018-2019 and earlier are based purely on data from the Planning London Datahub. All net values are using mock data. For 2019-2020, mock data values have been added to the data from PLD to complete that financial year. Mock data is provided from March 2020 to May 2022 for illustrative purposes.',
    units: 'Units',
    data: [
      {
        Year: '2013-2014',
        'Total Gross': 705,
        'Total Net': 677,
      },
      {
        Year: '2014-2015',
        'Total Gross': 864,
        'Total Net': 689,
      },
      {
        Year: '2015-2016',
        'Total Gross': 807,
        'Total Net': 714,
      },
      {
        Year: '2016-2017',
        'Total Gross': 718,
        'Total Net': 581,
      },
      {
        Year: '2017-2018',
        'Total Gross': 1673,
        'Total Net': 1103,
      },
      {
        Year: '2018-2019',
        'Total Gross': 523,
        'Total Net': 342,
      },
      {
        Year: '2019-2020',
        'Total Gross': 572,
        'Total Net': 239,
      },
      {
        Year: '2020-2021',
        'Total Gross': 349,
        'Total Net': 195,
      },
      {
        Year: '2021-2022',
        'Total Gross': 749,
        'Total Net': 483,
      },
      {
        Year: '2022-2023',
        'Total Gross': 136,
        'Total Net': 83,
      },
    ],
  },
];

export default data;
