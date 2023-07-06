import { it, expect, describe, vi } from 'vitest';

import { render, userEvent, screen } from '../../../test/test.utils';

import { WalthamHousingDelivery } from './waltham-housing-delivery.component';

import tenureData from '../../../mocks/fixtures/tenure_type_housing_delivery';
import totalData from '../../../mocks/fixtures/total_housing_delivery';

const defaultData = {
  tenureHousingDeliveryChartData: tenureData,
  totalHousingDeliveryChartData: totalData,
  targets: {},
  settings: {},
};

let setDashboardSettings = null;

describe('WalthamHousingDelivery', () => {
  beforeEach(() => {
    setDashboardSettings = vi.fn();
  });

  it.only('sets default values if no saved settings', () => {
    render(
      <WalthamHousingDelivery
        {...defaultData}
        setDashboardSettings={setDashboardSettings}
      />
    );

    expect(setDashboardSettings).toHaveBeenCalledTimes(1);

    expect(
      screen.getByRole('button', { name: '2015-2016 - 2019-2020' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'All Tenure Types' })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Gross' })).toBeInTheDocument();
  });

  it('defaults to user`s saved settings if present', () => {
    const settings = {
      tenureYear: 2018,
      tenureType: 'sociallyRented',
      tenureDateType: 'Net',
    };

    render(
      <WalthamHousingDelivery
        {...defaultData}
        settings={settings}
        setDashboardSettings={setDashboardSettings}
      />
    );

    expect(setDashboardSettings).not.toHaveBeenCalled();

    expect(
      screen.getByRole('button', { name: '2014-2015 - 2018-2019' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Social Rent' })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Net' })).toBeInTheDocument();
  });

  it('resets to highest available year if year is invalid after switching tenure type', async () => {
    const targets = {
        marketHousing: { 2020: 123 },
      },
      settings = {
        tenureYear: 2020,
        tenureType: 'marketHousing',
      };

    render(
      <WalthamHousingDelivery
        {...defaultData}
        targets={targets}
        settings={settings}
        setDashboardSettings={setDashboardSettings}
      />
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Market for sale' })
    );
    await userEvent.click(screen.getByRole('option', { name: 'Social Rent' }));

    /** will update once as usual, then again to correct itself if invalid. */
    expect(setDashboardSettings).toHaveBeenCalledTimes(2);
    expect(screen.getByText('2015-2016 - 2019-2020')).toBeInTheDocument();
  });

  it('calls setDashboardSettings function when filters are changed', async () => {
    render(
      <WalthamHousingDelivery
        {...defaultData}
        settings={{ tenureYear: 2019 }}
        setDashboardSettings={setDashboardSettings}
      />
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'All Tenure Types' })
    );
    await userEvent.click(
      screen.getByRole('option', { name: 'Market for sale' })
    );

    expect(setDashboardSettings).toHaveBeenCalledTimes(1);
  });
});
