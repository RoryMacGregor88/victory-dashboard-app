export type ExportData = {
  title: string;
  data: {
    'Data type': 'Gross' | 'Net';
    'x value': string;
    'y value': number;
    'Data source': string;
    Tenure: string;
    'Completion date': string;
    UPRN: null;
    Address: string;
    'Application ID': string;
    Status: string;
    'Development type': string;
    'Graph Title': string;
  }[];
}[];

/** mock data for export */
export default new Array(3).fill(undefined).map((_, i) => ({
  title: `Mock Export Data ${i + 1}`,
  data: new Array(10).fill({
    'Data type': 'Gross',
    'x value': '2014-2015',
    'y value': 740,
    'Data source': 'PLD',
    Tenure: 'Market for sale',
    'Completion date': '2014-04-02T00:00:00.000Z',
    UPRN: null,
    Address: '123, Fake Street, EH13 9FD',
    'Application ID': '2014/1234/CLE',
    Status: 'Completed',
    'Development type': 'Conversion',
    'Graph Title': 'Total Housing Delivery',
  }),
}));
