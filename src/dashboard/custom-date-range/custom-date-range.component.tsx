import { MenuItem, Select, makeStyles } from '@material-ui/core';

import { DEFAULT_FILTER_RANGE } from '~/constants';

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

interface Props {
  timeline: number[];
  value: number;
  onSelect: (value: number) => void;
  range?: number;
}

const CustomDateRange = ({
  timeline,
  value,
  onSelect,
  range = DEFAULT_FILTER_RANGE,
}: Props) => {
  const { root, select } = useSelectStyles({});
  return (
    <Select
      disableUnderline
      classes={{ root, select }}
      value={value ?? ''}
      onChange={({ target: { value } }) => onSelect(Number(value))}
    >
      {timeline?.map((year) => {
        const startYear = Number(timeline[timeline.indexOf(year) - range]);

        const optionLabel = `
          ${startYear}-${startYear + 1} -
          ${year}-${year + 1}
        `;

        return !!startYear ? (
          <MenuItem key={year} value={year}>
            {optionLabel}
          </MenuItem>
        ) : null;
      })}
    </Select>
  );
};

export { CustomDateRange, useSelectStyles };
