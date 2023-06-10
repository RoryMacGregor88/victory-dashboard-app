import clsx from 'clsx';
import { ToggleButtonGroup as MuiToggleButtonGroup } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    /** @param {{ fullWidth: boolean }} props */
    width: (props) => (props.fullWidth ? '100%' : 'auto'),
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

/**
 * @param {import('@material-ui/lab').ToggleButtonGroupProps&{fullWidth?: boolean}} props
 */
export const ToggleButtonGroup = ({
  classes = {},
  exclusive = true,
  fullWidth = true,
  ...props
}) => {
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
      exclusive={exclusive}
      classes={combinedStyles}
      {...props}
    />
  );
};
