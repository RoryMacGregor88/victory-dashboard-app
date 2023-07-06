import { it, expect, describe, vi } from 'vitest';

import { render, userEvent, screen, waitFor } from '../../test/test.utils';

import { inputErrorMessage } from '../../constants';
import { SelectScreen, TargetScreen } from './target-dialog-screens';

describe('Target Dialog Screens', () => {
  describe('SelectScreen', () => {
    const defaultValue = 'Select Type of Target';
    const datasetName =
      'Total housing target for each of the last 5 financial years';

    it('renders', () => {
      render(<SelectScreen />);
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('disables `Next` button until changes have been made', async () => {
      render(<SelectScreen />);

      const nextButton = screen.getByRole('button', { name: 'Next' });
      expect(nextButton).toBeDisabled();

      await userEvent.click(screen.getByRole('button', { name: defaultValue }));

      const option = screen.getByRole('option', { name: datasetName });
      expect(option).toBeInTheDocument();
      await userEvent.click(option);

      expect(nextButton).toBeEnabled();
    });

    it('fires callback when changes have been made and `Next` button is clicked', async () => {
      const onNextClick = vi.fn(),
        expected = 'totalHousing';

      render(<SelectScreen onNextClick={onNextClick} />);

      await userEvent.click(screen.getByRole('button', { name: defaultValue }));
      await userEvent.click(screen.getByRole('option', { name: datasetName }));
      await userEvent.click(screen.getByRole('button', { name: 'Next' }));

      expect(onNextClick).toHaveBeenCalledWith(expected);
    });
  });

  describe('Target Screen', () => {
    it('renders', () => {
      render(<TargetScreen />);
      expect(
        screen.getByRole('button', { name: 'Add Target' })
      ).toBeInTheDocument();
    });

    it('disables `Add Target` button until changes have been made', async () => {
      render(<TargetScreen />);

      expect(screen.getByRole('button', { name: 'Add Target' })).toBeDisabled();
      await userEvent.type(screen.getByPlaceholderText('2020-2021'), '123');
      expect(screen.getByRole('button', { name: 'Add Target' })).toBeEnabled();
    });

    it('allows cleared targets to be saved', async () => {
      const targets = {
        '2020-2021': '123',
      };

      render(<TargetScreen targets={targets} />);

      expect(screen.getByRole('button', { name: 'Add Target' })).toBeDisabled();
      await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
      expect(screen.getByRole('button', { name: 'Add Target' })).toBeEnabled();
    });

    it('fires callback when changes have been made and `Add Target` button is clicked', async () => {
      const onAddTargetsClick = vi.fn(),
        expected = {
          'test-dataset': {
            2020: 123,
            2021: 456,
          },
        };

      render(
        <TargetScreen
          onAddTargetsClick={onAddTargetsClick}
          selectedDataset='test-dataset'
        />
      );

      await userEvent.type(screen.getByPlaceholderText('2020-2021'), '123');
      await userEvent.type(screen.getByPlaceholderText('2021-2022'), '456');

      const submitButton = screen.getByRole('button', { name: 'Add Target' });

      expect(submitButton).toBeEnabled();
      await userEvent.click(submitButton);

      expect(onAddTargetsClick).toHaveBeenCalledWith(expected);
    });

    it('clears all values when `Reset` button is clicked', async () => {
      render(<TargetScreen />);

      const input1 = screen.getByPlaceholderText('2021-2022');
      const input2 = screen.getByPlaceholderText('2022-2023');

      await userEvent.type(input1, '123');
      await userEvent.type(input2, '456');

      await userEvent.click(screen.getByRole('button', { name: 'Reset' }));

      expect(input1).toHaveValue('');
      expect(input2).toHaveValue('');
    });
  });

  describe('validation', () => {
    it('allows numbers', async () => {
      render(<TargetScreen />);

      await userEvent.type(screen.getByPlaceholderText('2021-2022'), '123');
      expect(screen.queryByText(inputErrorMessage)).not.toBeInTheDocument();
    });

    it('allows decimals', async () => {
      render(<TargetScreen />);

      await userEvent.type(screen.getByPlaceholderText('2021-2022'), '123.456');
      expect(screen.queryByText(inputErrorMessage)).not.toBeInTheDocument();
    });

    it('does not allow letters', async () => {
      render(<TargetScreen />);

      await userEvent.type(screen.getByPlaceholderText('2021-2022'), 'abc');
      expect(screen.getByText(inputErrorMessage)).toBeInTheDocument();
    });

    it('does not allow special characters', async () => {
      render(<TargetScreen />);

      await userEvent.type(screen.getByPlaceholderText('2021-2022'), ';,%');
      expect(screen.getByText(inputErrorMessage)).toBeInTheDocument();
    });

    it('removes error message when restricted characters removed', async () => {
      render(<TargetScreen />);

      const input = screen.getByPlaceholderText('2021-2022');

      await userEvent.type(input, ';,%');
      expect(screen.getByText(inputErrorMessage)).toBeInTheDocument();

      await userEvent.clear(input);
      expect(screen.queryByText(inputErrorMessage)).not.toBeInTheDocument();
    });

    it('disables `Add Targets` button if a single field fails validation', async () => {
      render(<TargetScreen />);

      const input1 = screen.getByPlaceholderText('2021-2022');
      const input2 = screen.getByPlaceholderText('2022-2023');

      await userEvent.type(input1, '123');
      await userEvent.type(input2, 'abc');
      await userEvent.clear(input1);

      expect(screen.getByText(inputErrorMessage)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add Target' })).toBeDisabled();
    });
  });
});
