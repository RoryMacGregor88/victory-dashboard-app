import {
  Theme,
  ThemeOptions,
  alpha,
  createTheme,
  lighten,
} from '@material-ui/core';
import createPalette, {
  PaletteOptions,
} from '@material-ui/core/styles/createPalette';
import deepmerge from 'deepmerge';

import { core } from './core';
import { palette as corePalette } from './palette';

const darkPalette: PaletteOptions = {
  type: 'dark',
  text: {
    primary: corePalette.grey[100],
    secondary: corePalette.grey.A100,
    disabled: alpha(corePalette.grey[100], 0.5),
  },
  background: { default: corePalette.secondary.main, paper: '#5d666e' },
  action: {
    active: corePalette.grey[300],
    hover: alpha(corePalette.grey[300], corePalette.action.hoverOpacity),
    disabled: corePalette.grey[500],
  },
  divider: alpha(corePalette.grey[100], 0.12),
};

const palette = createPalette(deepmerge(corePalette, darkPalette));

const dark: ThemeOptions = {
  palette,
  overrides: {
    MuiButton: {
      outlined: {
        '&$disabled': {
          borderColor: palette.action.disabled,
        },
      },
      disabled: {},
    },
    MuiChip: {
      root: {
        backgroundColor: palette.action.active,
        color: palette.secondary.main,
      },
      outlined: { color: 'unset' },
      clickable: {
        '&:hover': {
          backgroundColor: palette.grey[400],
        },
      },
      avatar: {
        backgroundColor: palette.secondary.main,
      },
      icon: {
        color: 'inherit',
      },
      deleteIcon: {
        color: 'inherit',
        '&:hover': {
          color: palette.secondary.light,
        },
      },
    },
    MuiDialog: {
      paper: {
        backgroundColor: palette.background.default,
      },
    },
    MuiIconButton: {
      root: {
        '&:focus': {
          backgroundColor: palette.action.hover,
        },
        '&$disabled': {
          color: palette.action.disabled,
        },
      },
      disabled: {},
    },
    MuiInputLabel: {
      root: {
        '&$error': {
          color: palette.text.primary,
        },
      },
    },
    MuiFormLabel: {
      root: {
        color: palette.text.primary,
      },
    },
    MuiMenuItem: {
      root: {
        '&:hover': {
          backgroundColor: lighten(palette.background.default, 0.1),
        },
      },
    },
    MuiTabs: {
      flexContainer: {
        borderBottomColor: palette.divider,
      },
    },
    MuiTab: {
      root: {
        '&$textColorPrimary': {
          color: palette.text.primary,
        },
      },
      textColorPrimary: {},
    },
  },
};

const theme: Theme = createTheme(deepmerge(core, dark));

export default theme;
