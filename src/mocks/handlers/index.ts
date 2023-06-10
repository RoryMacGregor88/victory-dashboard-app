import { getTenureTypeHousingDeliveryData } from './tenure-type-housing-delivery-handler';
import { getAffordableHousingDeliveryData } from './affordable-housing-handler';
import { getHousingApprovalsData } from './housing-approvals-handler';
import { getProgressionOfUnitsData } from './progression-of-units-handler';
import { getTotalHousingDeliveryData } from './total-housing-delivery-handler';

const handlers = [
  getTenureTypeHousingDeliveryData,
  getAffordableHousingDeliveryData,
  getHousingApprovalsData,
  getProgressionOfUnitsData,
  getTotalHousingDeliveryData,
];

export default handlers;
