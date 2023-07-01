import { Button as MuiButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { forwardRef } from 'react';

const styles = makeStyles((theme) => ({
  root: {
    padding: '0.65em 4em',
    transition: theme.transitions.create(
      ['background-color', 'box-shadow', 'border', 'opacity'],
      {
        duration: theme.transitions.duration.short,
      }
    ),
  },
  disabled: {},
  contained: {
    color: theme.palette.secondary.main,
    '&:hover': {
      opacity: 0.5,
    },
    '&$disabled': {
      backgroundColor: theme.palette.grey['300'],
      color: theme.palette.grey.A700,
    },
  },
  containedPrimary: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  textSizeSmall: {
    fontSize: theme.typography.pxToRem(14),
  },
  textSizeLarge: {
    fontSize: theme.typography.pxToRem(22),
  },
  outlinedSizeSmall: {
    fontSize: theme.typography.pxToRem(14),
  },
  outlinedSizeLarge: {
    fontSize: theme.typography.pxToRem(22),
  },
  containedSizeSmall: {
    fontSize: theme.typography.pxToRem(14),
  },
  containedSizeLarge: {
    fontSize: theme.typography.pxToRem(22),
  },
}));

/**
 * @param { import('@material-ui/core/Button/Button').ButtonProps} props
 * @param { React.Ref<HTMLButtonElement> } ref
 */
export const Button = forwardRef(
  ({ variant = 'contained', color = 'primary', ...rest }, ref) => {
    const classes = styles({ variant, color, ...rest });
    const component = (
      <MuiButton
        ref={ref}
        classes={classes}
        variant={variant}
        color={color}
        {...rest}
      />
    );
    return rest.disabled ? (
      <span style={{ cursor: 'not-allowed' }}>{component}</span>
    ) : (
      component
    );
  }
);
