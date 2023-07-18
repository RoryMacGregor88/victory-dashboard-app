import { useState, ReactNode, useMemo } from 'react';

import { useForm } from 'react-hook-form';

import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';

import { Grid, makeStyles, Select, MenuItem, Input } from '@material-ui/core';

import { getPastYears } from '../utils/utils';
import { targetDatasets } from '../../constants';

import { Button } from '../../components';
import { TargetCategory, Targets } from '../../types';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    minHeight: '20rem',
    minWidth: '40rem',
  },
  buttons: {
    marginTop: theme.spacing(5),
    gap: theme.spacing(2),
  },
  inputFields: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridGap: theme.spacing(2),
  },
  error: {
    gap: theme.spacing(1),
    marginBottom: theme.spacing(4),
    color: theme.palette.error.main,
    width: '100%',
    textAlign: 'center',
  },
}));

const DEFAULT_TEXT = 'Select Type of Target';

const Wrapper = ({ children }: { children: ReactNode }) => {
  const styles = useStyles();
  return (
    <Grid
      container
      direction='column'
      justifyContent='space-between'
      alignItems='center'
      className={styles.wrapper}
    >
      {children}
    </Grid>
  );
};

interface SelectFormProps {
  onNextClick: (dataset: TargetCategory) => void;
}

const SelectForm = ({ onNextClick }: SelectFormProps) => {
  const styles = useStyles();

  type DefaultState = TargetCategory | typeof DEFAULT_TEXT;

  const [selectedDataset, setSelectedDataset] =
    useState<DefaultState>(DEFAULT_TEXT);

  const isDisabled = selectedDataset === DEFAULT_TEXT;

  return (
    <Wrapper>
      <Grid
        item
        container
        component={Select}
        value={selectedDataset}
        inputProps={{ 'aria-label': DEFAULT_TEXT }}
        onChange={({ target: { value } }) =>
          setSelectedDataset(value as TargetCategory)
        }
      >
        <MenuItem value={DEFAULT_TEXT} disabled>
          {DEFAULT_TEXT}
        </MenuItem>
        {Object.entries(targetDatasets).map(([key, value]) => (
          <MenuItem key={key} value={key}>
            {value}
          </MenuItem>
        ))}
      </Grid>
      <Grid item container justifyContent='flex-end' className={styles.buttons}>
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
  const styles = useStyles();

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
        { validation: {}, defaultValues: {}, emptyFormValues: {} }
      ),
    []
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
    <Grid item container component='form' onSubmit={handleSubmit(onSubmit)}>
      {hasErrors ? (
        <Grid item container direction='column' className={styles.error}>
          {Object.entries(errors).map(([year, error]) => (
            <span>
              Error in {formatYear(Number(year))}: {error?.message}
            </span>
          ))}
        </Grid>
      ) : null}

      <Grid item container className={styles.inputFields}>
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
      <Grid item container justifyContent='flex-end' className={styles.buttons}>
        <Button color='secondary' onClick={() => reset(emptyFormValues)}>
          Reset
        </Button>
        <Button disabled={isDisabled} type='submit'>
          Add Target
        </Button>
      </Grid>
    </Grid>
  );
};

export { SelectForm, TargetForm };
