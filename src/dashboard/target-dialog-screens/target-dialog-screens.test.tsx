import { it, expect, describe, vi } from 'vitest';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { inputErrorMessage } from '../waltham.constants';
import { SelectScreen, TargetScreen } from './target-dialog-screens';

describe('Target Dialog Screens', () => {
  describe('SelectScreen', () => {
    const defaultValue = 'Select Type of Target';
    const datasetName =
      'Total housing test target for each of the last 5 financial years';

    it('renders', () => {
      const { getByRole } = render(<SelectScreen />);
      expect(getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('disables `Next` button until changes have been made', async () => {
      const { getByRole, getByText } = render(<SelectScreen />);

      expect(getByRole('button', { name: 'Next' })).toBeDisabled();

      await userEvent.click(getByText(defaultValue));

      expect(getByText(datasetName)).toBeInTheDocument();
      await userEvent.click(getByText(datasetName));

      expect(getByRole('button', { name: 'Next' })).toBeEnabled();
    });

    it('fires callback when changes have been made and `Next` button is clicked', async () => {
      const onNextClick = vi.fn(),
        expected = 'totalHousing';

      const { getByText, getByRole } = render(
        <SelectScreen onNextClick={onNextClick} />
      );

      await userEvent.click(getByText(defaultValue));
      await userEvent.click(getByText(datasetName));
      await userEvent.click(getByRole('button', { name: 'Next' }));
      expect(onNextClick).toHaveBeenCalledWith(expected);
    });
  });

  describe('TargetScreen', () => {
    it('renders', () => {
      const { getByRole } = render(<TargetScreen />);
      expect(getByRole('button', { name: 'Add Target' })).toBeInTheDocument();
    });

    it('disables `Add Target` button until changes have been made', async () => {
      const { getByRole, getByPlaceholderText } = render(<TargetScreen />);

      expect(getByRole('button', { name: 'Add Target' })).toBeDisabled();
      await userEvent.type(getByPlaceholderText('2020-2021'), '123');
      expect(getByRole('button', { name: 'Add Target' })).toBeEnabled();
    });

    it('allows cleared targets to be saved', async () => {
      const targets = {
        '2020-2021': '123',
      };

      const { getByRole } = render(<TargetScreen targets={targets} />);

      expect(getByRole('button', { name: 'Add Target' })).toBeDisabled();
      await userEvent.click(getByRole('button', { name: 'Reset' }));
      expect(getByRole('button', { name: 'Add Target' })).toBeEnabled();
    });

    it('fires callback when changes have been made and `Add Target` button is clicked', async () => {
      const onAddTargetsClick = vi.fn(),
        expected = {
          'test-dataset': {
            2020: 123,
            2021: 456,
          },
        };

      const { getByRole, getByPlaceholderText } = render(
        <TargetScreen
          onAddTargetsClick={onAddTargetsClick}
          selectedDataset='test-dataset'
        />
      );

      await userEvent.type(getByPlaceholderText('2020-2021'), '123');
      await userEvent.type(getByPlaceholderText('2021-2022'), '456');

      await userEvent.click(getByRole('button', { name: 'Add Target' }));
      expect(onAddTargetsClick).toHaveBeenCalledWith(expected);
    });

    it('clears all values when `Reset` button is clicked', async () => {
      const { getByRole, getByPlaceholderText } = render(<TargetScreen />);

      const input1 = getByPlaceholderText('2021-2022');
      const input2 = getByPlaceholderText('2022-2023');

      await userEvent.type(input1, '123');
      await userEvent.type(input2, '456');

      await userEvent.click(getByRole('button', { name: 'Reset' }));

      expect(input1).toHaveValue('');
      expect(input2).toHaveValue('');
    });
  });

  describe('validation', () => {
    it('allows numbers', async () => {
      const { queryByText, getByPlaceholderText } = render(<TargetScreen />);

      await userEvent.type(getByPlaceholderText('2021-2022'), '123');

      expect(queryByText(inputErrorMessage)).not.toBeInTheDocument();
    });

    it('allows decimals', async () => {
      const { queryByText, getByPlaceholderText } = render(<TargetScreen />);

      await userEvent.type(getByPlaceholderText('2021-2022'), '123.456');
      expect(queryByText(inputErrorMessage)).not.toBeInTheDocument();
    });

    it('does not allow letters', async () => {
      const { getByText, getByPlaceholderText } = render(<TargetScreen />);

      await userEvent.type(getByPlaceholderText('2021-2022'), 'abc');
      expect(getByText(inputErrorMessage)).toBeInTheDocument();
    });

    it('does not allow special characters', async () => {
      const { getByText, getByPlaceholderText } = render(<TargetScreen />);

      await userEvent.type(getByPlaceholderText('2021-2022'), ';,%');
      expect(getByText(inputErrorMessage)).toBeInTheDocument();
    });

    it('removes error message when restricted characters removed', async () => {
      const { getByText, queryByText, getByPlaceholderText } = render(
        <TargetScreen />
      );

      const input = getByPlaceholderText('2021-2022');

      await userEvent.type(input, ';,%');
      expect(getByText(inputErrorMessage)).toBeInTheDocument();

      await userEvent.clear(input);
      expect(queryByText(inputErrorMessage)).not.toBeInTheDocument();
    });

    it('disables `Add Targets` button if a single field fails validation', async () => {
      const { getByText, getByRole, getByPlaceholderText } = render(
        <TargetScreen />
      );

      const input1 = getByPlaceholderText('2021-2022');
      const input2 = getByPlaceholderText('2022-2023');

      await userEvent.type(input1, '123');
      await userEvent.type(input2, 'abc');
      await userEvent.clear(input1);

      expect(getByText(inputErrorMessage)).toBeInTheDocument();
      expect(getByRole('button', { name: 'Add Target' })).toBeDisabled();
    });
  });
});
