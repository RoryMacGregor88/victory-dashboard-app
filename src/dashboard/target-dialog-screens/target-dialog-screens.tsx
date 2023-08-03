import { ReactNode, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Input, MenuItem, Select, makeStyles } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { Button, Grid } from '~/components';
import { targetDatasets } from '~/constants';
import { getPastYears } from '~/dashboard/utils/utils';
import { TargetCategory, Targets } from '~/types';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    minHeight: '20rem',
    minWidth: '40rem',
  },
  buttons: {
    marginTop: theme.spacing(5),
  },
  inputFields: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridGap: theme.spacing(2),
  },
  error: {
    marginBottom: theme.spacing(4),
    color: theme.palette.error.main,
    width: '100%',
    textAlign: 'center',
  },
}));

const DEFAULT_TEXT = 'Select Type of Target';

const Wrapper = ({ children }: { children: ReactNode }) => {
  const { wrapper } = useStyles();
  return (
    <Grid
      container
      alignItems="center"
      className={wrapper}
      direction="column"
      justifyContent="space-between"
    >
      {children}
    </Grid>
  );
};

interface SelectFormProps {
  onNextClick: (dataset: TargetCategory) => void;
}

const SelectForm = ({ onNextClick }: SelectFormProps) => {
  const { buttons } = useStyles();

  type DefaultState = TargetCategory | typeof DEFAULT_TEXT;

  const [selectedDataset, setSelectedDataset] =
    useState<DefaultState>(DEFAULT_TEXT);

  const isDisabled = selectedDataset === DEFAULT_TEXT;

  return (
    <Wrapper>
      <Grid
        container
        item
        component={Select}
        inputProps={{ 'aria-label': DEFAULT_TEXT }}
        value={selectedDataset}
        onChange={({ target: { value } }) =>
          setSelectedDataset(value as TargetCategory)
        }
      >
        <MenuItem disabled value={DEFAULT_TEXT}>
          {DEFAULT_TEXT}
        </MenuItem>
        {Object.entries(targetDatasets).map(([key, value]) => (
          <MenuItem key={key} value={key}>
            {value}
          </MenuItem>
        ))}
      </Grid>
      <Grid container item className={buttons} justifyContent="flex-end">
        <Button
          disabled={isDisabled}
          onClick={() => !isDisabled && onNextClick(selectedDataset)}
        >
          Next
        </Button>
      </Grid>
    </Wrapper>
  );
};

const formatYear = (year: number) => `${year}-${year + 1}`;

interface TargetFormProps {
  onAddTargetsClick: (targets: Targets) => void;
  selectedDataset: TargetCategory;
  targets?: Targets;
}

const TargetForm = ({
  onAddTargetsClick,
  selectedDataset,
  targets = {},
}: TargetFormProps) => {
  const { error, inputFields, buttons } = useStyles();

  const yearRange = selectedDataset === 'affordableHousingDelivery' ? 10 : 5,
    pastYears = getPastYears(yearRange);

  /** prevent unnecessary re-renders when interacting with form */
  const formSetup = useMemo(
    () =>
      pastYears.reduce(
        (acc, year) => ({
          validation: {
            ...acc.validation,
            [year]: Yup.number()
              .positive('Only positive numbers are permitted.')
              .typeError('Only number values permitted.')
              .nullable()
              .transform((curr, orig) => (orig === '' ? null : curr)),
          },
          defaultValues: {
            ...acc.defaultValues,
            [year]: targets[selectedDataset]?.[year] ?? '',
          },
          emptyFormValues: {
            ...acc.emptyFormValues,
            [year]: '',
          },
        }),
        { validation: {}, defaultValues: {}, emptyFormValues: {} },
      ),
    [pastYears, selectedDataset, targets],
  );

  const { validation, defaultValues, emptyFormValues } = formSetup;

  const targetFormSchema = Yup.object().shape(validation);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<Targets[TargetCategory]>({
    mode: 'all',
    resolver: yupResolver(targetFormSchema),
    defaultValues,
  });

  const onSubmit = (values: Targets[TargetCategory]) =>
    onAddTargetsClick({ [selectedDataset]: values });

  const hasErrors = !!Object.keys(errors).length,
    isDisabled = !isDirty || hasErrors;

  // TODO: validation is broken, does not allow empty strings
  // TODO: reset doesn't dirty form

  return (
    <Grid container item component="form" onSubmit={handleSubmit(onSubmit)}>
      {hasErrors ? (
        <Grid container item className={error} direction="column">
          {Object.entries(errors).map(([year, error]) => (
            <span>
              Error in {formatYear(Number(year))}: {error?.message}
            </span>
          ))}
        </Grid>
      ) : null}

      <Grid container item className={inputFields}>
        {pastYears.map((year) => {
          const stringYear = String(year) as TargetCategory;
          return (
            <Input
              key={stringYear}
              {...register(stringYear)}
              placeholder={formatYear(year)}
            />
          );
        })}
      </Grid>
      <Grid container item className={buttons} justifyContent="flex-end">
        <Button color="secondary" onClick={() => reset(emptyFormValues)}>
          Reset
        </Button>
        <Button disabled={isDisabled} type="submit">
          Add Target
        </Button>
      </Grid>
    </Grid>
  );
};

export { SelectForm, TargetForm };
