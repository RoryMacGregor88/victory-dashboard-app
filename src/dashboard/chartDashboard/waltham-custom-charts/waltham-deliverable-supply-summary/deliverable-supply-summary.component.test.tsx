import React from 'react';

import { it, expect, describe, vi } from 'vitest';

import { render, screen } from 'test/test-utils';

import { deliverableSupplySummaryTypes } from '../../waltham.constants';
import DeliverableSupplySummary from './deliverable-supply-summary.component';
import * as MOCK_DATA from './mock-data';

// These tests are skipped deliberately as the component has been retired

describe('Deliverable Supply Summary', () => {
  it('should display chart on screen', () => {
    render(<DeliverableSupplySummary data={MOCK_DATA} />);
    expect(
      screen.getByRole('heading', {
        name: 'Deliverable Supply Summary',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Info',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: 'Info',
      })
    ).toBeInTheDocument();
  });

  it('should display correct xlabel, ylabel and legend titles', () => {
    render(<DeliverableSupplySummary data={MOCK_DATA} />);
    deliverableSupplySummaryTypes.forEach((legendLabel) => {
      expect(screen.getByText(legendLabel)).toBeInTheDocument();
    });

    expect(screen.getByText('Financial Year')).toBeInTheDocument();
    expect(screen.getByText('Number Of Units')).toBeInTheDocument();
  });
});
