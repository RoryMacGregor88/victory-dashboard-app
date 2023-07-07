/** Re-usable type declarations */

export type Targets = {
  [datasetName: string]: {
    [year: string]: number;
  };
};

export type Settings = {
  tenureType?: string;
  tenureDataType?: 'Gross' | 'Net';
  tenureYear?: number;
  totalYear?: number;
  approvalsGrantedDataType?: 'Monthly' | 'Cumulative';
};

export type UserOrbState = {
  targets: Targets;
  settings: Settings;
};

export type ChartData =
  | AffordableHousingData
  | HousingApprovalsData
  | ProgressionOfUnitsData
  | TenureTypeHousingData
  | TotalHousingDeliveryData;

export type ChartMetadata = {
  sourceId: string;
  datasetName: string;
  url: string;
};

export type LegendData = {
  name: string;
  color: string;
};
