import { createTheme, alpha } from '@material-ui/core';
import { palette } from './palette';

const borderRadius = 5;
const spacing = (factor: number) => `${0.5 * factor}rem`;

/** @type {import('@material-ui/core').ThemeOptions} */
export const core = createTheme({
  overrides: {
    MuiButton: {
      textSecondary: {
        color: palette.info.main,
        '&:hover': {
          backgroundColor: alpha(
            palette.info.main,
            palette.action.hoverOpacity
          ),
          '@media (hover: none)': {
            backgroundColor: 'transparent',
          },
        },
      },
      containedSecondary: {
        backgroundColor: palette.info.main,
        '&:hover': {
          backgroundColor: palette.info.main,
          '@media (hover: none)': {
            backgroundColor: palette.info.main,
          },
        },
      },
      outlinedSecondary: {
        color: palette.info.main,
        borderColor: alpha(palette.info.main, 0.5),
        '&:hover': {
          borderColor: palette.info.main,
          backgroundColor: alpha(
            palette.info.main,
            palette.action.hoverOpacity
          ),
          '@media (hover: none)': {
            backgroundColor: 'transparent',
          },
        },
        '&$disabled': {
          borderColor: palette.action.disabled,
        },
      },
    },
    MuiChip: {
      root: {
        borderRadius: 9,
      },
      colorSecondary: {
        backgroundColor: palette.info.main,
      },
      clickableColorSecondary: {
        '&:hover, &:focus': {
          backgroundColor: palette.info.dark,
        },
      },
      outlinedSecondary: {
        borderColor: palette.info.main,
        color: palette.info.main,
      },
      deleteIconColorSecondary: {
        '&:hover': {
          color: palette.info.dark,
        },
      },
      deleteIconOutlinedColorSecondary: {
        color: palette.info.main,
        '&:hover': {
          color: palette.info.dark,
        },
      },
    },
    MuiDialog: {
      paper: {
        backgroundColor: palette.background.default,
        borderRadius: 10,
      },
    },
    MuiDialogContent: {
      root: {
        padding: `${spacing(5)} ${spacing(3)} ${spacing(2)}`,
      },
    },
    MuiDialogActions: {
      root: {
        display: 'flex',
        justifyContent: 'center',
        padding: `${spacing(2)} ${spacing(3)} ${spacing(4)}`,
      },
    },
    MuiIconButton: {
      root: {
        '&:focus': {
          backgroundColor: alpha(
            palette.action.active,
            palette.action.hoverOpacity
          ),
        },
      },
      colorPrimary: {
        '&:focus': {
          backgroundColor: alpha(
            palette.primary.main,
            palette.action.hoverOpacity
          ),
        },
      },
      colorSecondary: {
        color: palette.info.main,
        '&:hover': {
          backgroundColor: alpha(
            palette.info.main,
            palette.action.hoverOpacity
          ),
          '@media (hover: none)': {
            backgroundColor: 'transparent',
          },
        },
        '&:focus': {
          backgroundColor: alpha(
            palette.info.main,
            palette.action.hoverOpacity
          ),
        },
      },
    },
    MuiLink: {
      root: {
        fontWeight: 600,
      },
    },
    MuiFormControlLabel: {
      root: {
        margin: 0,
        marginLeft: 0,
        '& .Mui-disabled': {
          opacity: palette.action.disabledOpacity,
        },
        '&$disabled': {
          cursor: 'not-allowed',
        },
      },
      label: {
        marginLeft: spacing(2),
      },
      labelPlacementBottom: {
        '& $label': {
          margin: 0,
          marginTop: spacing(1),
        },
      },
      labelPlacementStart: {
        '& $label': {
          margin: 0,
          marginRight: spacing(2),
        },
      },
      labelPlacementTop: {
        '& $label': {
          margin: 0,
          marginBottom: spacing(1),
        },
      },
      disabled: {},
    },
    MuiFormHelperText: {
      root: {
        fontStyle: 'italic',
      },
    },
    MuiInputLabel: {
      root: {
        zIndex: 1,
        '&$error': {
          color: palette.text.secondary,
          '&$focused': {
            color: palette.primary.main,
          },
        },
      },
      formControl: {
        transform: 'translate(16px, 32px) scale(1)',
      },
      shrink: {
        transform: 'translate(0, 1.5px) scale(0.75)',
      },
      error: {},
      focused: {},
    },
    MuiFormLabel: {
      root: {
        fontSize: '14px',
      },
    },
    MuiTabs: {
      flexContainer: {
        borderBottom: `1px solid ${palette.divider}`,
      },
    },
    MuiTab: {
      root: {
        [`&$textColorInherit,
          &$textColorPrimary,
          &$textColorSecondary`]: {
          opacity: 1,
        },
      },
      textColorInherit: {},
      textColorPrimary: {},
      textColorSecondary: {},
    },
    MuiTooltip: {
      arrow: {
        color: palette.primary.main,
      },
      tooltip: {
        color: palette.secondary.main,
        backgroundColor: palette.primary.main,
      },
    },
    MuiCssBaseline: {
      '@global': {
        html: { fontSize: '1rem' },
        body: {
          fontSize: '1rem',
        },
      },
    },
  },
  palette,
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
    MuiButtonGroup: {
      disableRipple: true,
      variant: 'contained',
      color: 'primary',
    },
    MuiLink: {
      variant: 'body1',
    },
    MuiFormControl: {
      fullWidth: true,
    },
    MuiTabs: {
      indicatorColor: 'primary',
      textColor: 'primary',
    },
  },
  shape: {
    borderRadius,
  },
  spacing,
  typography: {
    fontFamily: '"Open Sans", sans-serif',
    h1: {
      fontSize: '26px',
      fontWeight: 600,
    },
    h2: {
      fontSize: '18px',
      fontWeight: 600,
    },
    h3: {
      fontSize: '16px',
      fontWeight: 600,
    },
    h4: {
      fontSize: '14px',
      fontWeight: 600,
    },
    h5: {
      fontSize: '12px',
      fontWeight: 600,
    },
    body1: {
      fontSize: '14px',
    },
    body2: {
      fontSize: '12px',
    },
    button: {
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: 'normal',
      textTransform: 'none',
    },
  },
});
