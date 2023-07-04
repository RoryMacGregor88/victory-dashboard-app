import { useState, useEffect } from 'react';

import { Grid, makeStyles, Select, MenuItem, Input } from '@material-ui/core';

import { filterEmptyStrings, getPastYears } from '../utils/utils';
import { targetDatasets } from '../../constants';
import { validate } from './validate';

import { Button } from '../../components';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    minHeight: '20rem',
    minWidth: '40rem',
  },
  buttons: {
    marginTop: '2.5rem',
    gap: '1rem',
  },
  inputFields: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridGap: '1rem',
  },
  error: {
    color: theme.palette.error.main,
    width: '100%',
    textAlign: 'center',
  },
}));

const DEFAULT_TEXT = 'Select Type of Target';

const Wrapper = ({ children }) => {
  const styles = useStyles({});
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

/**
 * @param {{
 *  onNextClick: (dataset: string) => void
 * }} props
 */
const SelectScreen = ({ onNextClick }) => {
  const styles = useStyles({});
  const [selectedDataset, setSelectedDataset] = useState(DEFAULT_TEXT);
  return (
    <Wrapper>
      <Grid
        item
        container
        component={Select}
        value={selectedDataset}
        inputProps={{ 'aria-label': 'Waltham Forest datasets' }}
        onChange={({ target: { value } }) => setSelectedDataset(value)}
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
          disabled={selectedDataset === DEFAULT_TEXT}
          onClick={() => onNextClick(selectedDataset)}
        >
          Next
        </Button>
      </Grid>
    </Wrapper>
  );
};

/**
 * @param {{
 *  onAddTargetsClick: (targets: object) => void
 *  selectedDataset: string
 *  targets: object
 * }} props
 */
const TargetScreen = ({ onAddTargetsClick, selectedDataset, targets = {} }) => {
  const styles = useStyles({});
  const [targetData, setTargetData] = useState(targets);
  const [error, setError] = useState(undefined);
  const isDirty = targetData !== targets;
  const yearRange = selectedDataset === 'affordableHousingPercentage' ? 10 : 5;

  useEffect(() => {
    if (isDirty) {
      setError(validate(targetData));
    }
  }, [targetData, isDirty]);

  /**
   * @param {object} data
   */
  const handleChange = (data) =>
    setTargetData((prev) => ({ ...prev, ...data }));

  const handleSubmit = () =>
    onAddTargetsClick({ [selectedDataset]: filterEmptyStrings(targetData) });

  return (
    <Grid item container component='form' onSubmit={handleSubmit}>
      {error ? <span className={styles.error}>{error}</span> : null}
      <Grid item container className={styles.inputFields}>
        {getPastYears(yearRange).map((field) => (
          <Input
            key={field}
            value={targetData[field] ?? ''}
            placeholder={`${field}-${field + 1}`}
            onChange={({ target: { value } }) =>
              handleChange({ [field]: value.trim() })
            }
          />
        ))}
      </Grid>
      <Grid item container justifyContent='flex-end' className={styles.buttons}>
        <Button color='secondary' onClick={() => setTargetData({})}>
          Reset
        </Button>
        <Button disabled={!isDirty || !!error} type='submit'>
          Add Target
        </Button>
      </Grid>
    </Grid>
  );
};

export { SelectScreen, TargetScreen };
