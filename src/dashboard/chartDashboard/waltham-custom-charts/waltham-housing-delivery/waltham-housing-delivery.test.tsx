import { it, expect, describe, vi } from 'vitest';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { WalthamHousingDelivery } from './waltham-housing-delivery.component';

const tenures = {
    'Affordable Rent': 303,
    Intermediate: 130,
    'Market for sale': 124,
    'Social Rent': 127,
    'Private Rented Sector': 198,
  },
  data = [
    {
      startYear: 2014,
      ...tenures,
    },
    {
      startYear: 2015,
      ...tenures,
    },
    {
      startYear: 2016,
      ...tenures,
    },
    {
      startYear: 2017,
      ...tenures,
    },
    {
      startYear: 2018,
      ...tenures,
    },
    {
      startYear: 2019,
      ...tenures,
    },
  ],
  defaultData = {
    tenureHousingDeliveryChartData: data,
    targets: {},
    settings: {},
    setDashboardSettings: vi.fn(),
  };

describe('WalthamHousingDelivery', () => {
  describe('filters', () => {
    it('sets default values if no saved settings', () => {
      const { getByRole } = render(<WalthamHousingDelivery {...defaultData} />);

      expect(defaultData.setDashboardSettings).toHaveBeenCalledTimes(1);
      expect(
        getByRole('button', { name: '2015-2016 - 2019-2020' })
      ).toBeInTheDocument();

      expect(
        getByRole('button', { name: 'All Tenure Types' })
      ).toBeInTheDocument();

      // expect(getByRole('button', { name: 'Gross' })).toBeInTheDocument();
    });

    it('defaults to user`s saved settings if present', () => {
      const settings = {
        tenureYear: 2018,
        tenureType: 'sociallyRented',
        tenureDateType: 'Net',
      };

      const { getByRole } = render(
        <WalthamHousingDelivery {...defaultData} settings={settings} />
      );

      expect(defaultData.setDashboardSettings).not.toHaveBeenCalled();

      expect(
        getByRole('button', { name: '2014-2015 - 2018-2019' })
      ).toBeInTheDocument();
      expect(getByRole('button', { name: 'Social Rent' })).toBeInTheDocument();
      // expect(getByRole('button', { name: 'Net' })).toBeInTheDocument();
    });

    it('resets to highest available year if year is invalid after switching tenure type', () => {
      const targets = {
          marketHousing: { 2020: 123 },
        },
        settings = {
          tenureYear: 2020,
          tenureType: 'marketHousing',
        };

      const { getByText, getByRole } = render(
        <WalthamHousingDelivery
          {...defaultData}
          targets={targets}
          settings={settings}
        />
      );

      userEvent.click(getByRole('button', { name: 'Market for sale' }));
      userEvent.click(getByRole('option', { name: 'Social Rent' }));

      // will update once as usual, then again to correct itself if invalid.
      expect(defaultData.setDashboardSettings).toHaveBeenCalledTimes(2);
      expect(getByText('2015-2016 - 2019-2020')).toBeInTheDocument();
    });

    it('calls setDashboardSettings function when filters are changed', () => {
      const { getByRole } = render(
        <WalthamHousingDelivery
          {...defaultData}
          settings={{ tenureYear: 2019 }}
        />
      );

      userEvent.click(getByRole('button', { name: 'All Tenure Types' }));
      userEvent.click(getByRole('option', { name: 'Market for sale' }));

      expect(defaultData.setDashboardSettings).toHaveBeenCalledTimes(1);
    });
  });
});
