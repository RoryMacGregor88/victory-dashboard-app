import { darken, makeStyles } from '@material-ui/core';
import {
  ToggleButton as MuiToggleButton,
  ToggleButtonProps,
} from '@material-ui/lab';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    flexBasis: '100%',
    border: 'none',
    padding: '0.65em',
    color: theme.palette.common.white,
    backgroundColor: darken(theme.palette.secondary.main, 0.3),
    transition: theme.transitions.create(
      ['background-color', 'box-shadow', 'border', 'opacity'],
      {
        duration: theme.transitions.duration.short,
      },
    ),
    '&:hover': {
      backgroundColor: darken(theme.palette.secondary.main, 0.3),
      opacity: 0.5,
    },
    '&$disabled': {
      backgroundColor: theme.palette.grey['300'],
      color: theme.palette.grey.A700,
    },
    '&$selected': {
      color: theme.palette.secondary.main,
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        opacity: 0.5,
      },
    },
    '&$sizeSmall': {
      padding: '0.57em',
      fontSize: theme.typography.pxToRem(14),
    },
    '&$sizeLarge': {
      padding: '0.73em',
      fontSize: theme.typography.pxToRem(22),
    },
  },
  selected: {},
  disabled: {},
  sizeSmall: {},
  sizeLarge: {},
}));

export const ToggleButton = ({ classes = {}, ...props }: ToggleButtonProps) => {
  const styles = useStyles();
  const { root, selected, disabled, sizeSmall, sizeLarge, ...rest } = classes;

  const combinedStyles = {
    root: clsx(styles.root, root),
    selected: clsx(styles.selected, selected),
    disabled: clsx(styles.disabled, disabled),
    sizeSmall: clsx(styles.sizeSmall, sizeSmall),
    sizeLarge: clsx(styles.sizeLarge, sizeLarge),
    ...rest,
  };

  return (
    <MuiToggleButton
      disableFocusRipple
      disableRipple
      classes={combinedStyles}
      {...props}
    />
  );
};
