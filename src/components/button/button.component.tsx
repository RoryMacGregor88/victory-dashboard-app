import { Button as MuiButton, PropTypes } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ReactNode } from 'react';

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

interface ButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
  color?: PropTypes.Color | undefined;
  size: 'small' | 'medium' | 'large';
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  children: ReactNode;
}

export const Button = ({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  onClick,
  children,
}: ButtonProps) => (
  <MuiButton
    classes={styles()}
    variant={variant}
    color={color}
    size={size}
    onClick={onClick}
  >
    {children}
  </MuiButton>
);
