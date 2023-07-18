import { Select, MenuItem, makeStyles } from '@material-ui/core';

import { DEFAULT_FILTER_RANGE } from '../../constants';

const useSelectStyles = makeStyles((theme) => ({
  root: {
    padding: '0.5rem',
    width: '10rem',
  },
  select: {
    border: `1.5px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    maxWidth: '15rem',
    marginLeft: 'auto',
    '&:focus': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

/**
 * @param {{
 *  timeline: number[]
 *  value: number
 *  onSelect: (value: number) => void
 *  range?: number,
 * }} props
 */
const CustomDateRange = ({
  timeline,
  value,
  onSelect,
  range = DEFAULT_FILTER_RANGE,
}) => {
  const { root, select } = useSelectStyles({});
  return (
    <Select
      value={value ?? ''}
      onChange={({ target: { value } }) => onSelect(Number(value))}
      classes={{ root, select }}
      disableUnderline
    >
      {timeline?.map((year) => {
        const startYear = Number(timeline[timeline.indexOf(year) - range]);

        const optionLabel = `
          ${startYear}-${startYear + 1} -
          ${year}-${year + 1}
        `;

        return startYear ? (
          <MenuItem key={year} value={year}>
            {optionLabel}
          </MenuItem>
        ) : null;
      })}
    </Select>
  );
};

export { CustomDateRange, useSelectStyles };
