import { makeStyles } from '@material-ui/core';
import {
  ToggleButtonGroup as MuiToggleButtonGroup,
  ToggleButtonGroupProps,
} from '@material-ui/lab';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  root: {
    width: ({ fullWidth }: { fullWidth: boolean }) =>
      fullWidth ? '100%' : 'auto',
  },
  groupedHorizontal: {
    '&:not(:first-child)': {
      border: 'none',
      margin: '0',
    },
  },
  groupedVertical: {
    '&:not(:first-child)': {
      border: 'none',
      margin: '0',
    },
  },
}));

export const ToggleButtonGroup = ({
  classes = {},
  exclusive = true,
  fullWidth = true,
  ...props
}: ToggleButtonGroupProps & { fullWidth?: boolean }) => {
  const styles = useStyles({ fullWidth });
  const { root, groupedHorizontal, groupedVertical, ...rest } = classes;

  const combinedStyles = {
    root: clsx(styles.root, root),
    groupedHorizontal: clsx(styles.groupedHorizontal, groupedHorizontal),
    groupedVertical: clsx(styles.groupedVertical, groupedVertical),
    ...rest,
  };

  return (
    <MuiToggleButtonGroup
      classes={combinedStyles}
      exclusive={exclusive}
      {...props}
    />
  );
};
