import {
  AffordableHousingData,
  HousingApprovalsData,
  ProgressionOfUnitsData,
  TenureTypeHousingData,
  TotalHousingDeliveryData,
} from '../../mocks/fixtures';

export type HousingApprovalsObjectArray = HousingApprovalsData[number]['data'];

export type TransformedTargets = { x: string; y: number }[];

/** data is possible filtered beore passed to timeline fuction */
export type TimelineData =
  | Partial<TotalHousingDeliveryData>
  | Partial<TenureTypeHousingData>
  | Partial<ProgressionOfUnitsData>
  | Partial<AffordableHousingData>;
