import { it, expect, describe, vi } from 'vitest';

import mockData from '../../../mocks/fixtures/affordable_housing_delivery';
import { render, screen } from '../../../test/test.utils';

import {
  AffordableHousingDelivery,
  getPairedValues,
} from './affordable-housing-delivery.component';

const targets = {
  2018: 100,
  2019: 70,
  2020: 80,
  2021: 120,
  2022: 90,
};

let setDashboardSettings = vi.fn();

describe('<AfforableHousingDelivery />', () => {
  beforeEach(() => {
    setDashboardSettings = vi.fn();
  });

  describe('Affordable Housing Delivery chart', () => {
    it('shows the right title in the wrapper', () => {
      render(
        <AffordableHousingDelivery
          data={mockData}
          targets={targets}
          setDashboardSettings={setDashboardSettings}
        />
      );

      expect(
        screen.getByRole('heading', {
          name: `Affordable Housing Delivery (%)`,
        })
      ).toBeInTheDocument();
    });

    it('shows the right axis labels', () => {
      render(
        <AffordableHousingDelivery
          data={mockData}
          targets={targets}
          setDashboardSettings={setDashboardSettings}
        />
      );
      expect(
        screen.getByText('Affordable Housing Delivery (%)')
      ).toBeInTheDocument();
      expect(screen.getByText('Financial Year')).toBeInTheDocument();
    });
  });

  describe('getPairedValues', () => {
    it('filters out all non-paired elements from data and targets', () => {
      const data = [
          { startYear: 2011, 'Affordable Housing': 123 },
          { startYear: 2012, 'Affordable Housing': 456 },
          { startYear: 2013, 'Affordable Housing': null },
        ],
        targets = {
          2011: 123,
          2013: 456,
        },
        expected = {
          pairedData: [{ startYear: 2011, 'Affordable Housing': 123 }],
          pairedTargets: { 2011: 123 },
        };

      const result = getPairedValues(data, targets);
      expect(result).toEqual(expected);
    });

    it('returns undefined if no data', () => {
      const result = getPairedValues(undefined, { 2010: 123 });
      expect(result).toBeUndefined();
    });
    it('returns undefined if no targets', () => {
      const result = getPairedValues(
        [{ startYear: 2010, 'Affordable Housing': 123 }],
        undefined
      );
      expect(result).toBeUndefined();
    });
  });
});
