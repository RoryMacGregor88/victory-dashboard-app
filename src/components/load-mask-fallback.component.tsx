import { ReactNode } from 'react';

import { Backdrop, Fade, makeStyles } from '@material-ui/core';

import { Grid } from '~/components/';

const useStyles = makeStyles(({ palette }) => ({
  container: {
    backgroundColor: palette.secondary.main,
    color: palette.common.white,
  },
}));

interface Props {
  children: ReactNode;
}

export const LoadMaskFallback = ({ children }: Props) => {
  const { container } = useStyles();
  return (
    <Fade in>
      <Backdrop open className={container} data-testid="loadmask">
        <Grid container alignItems="center" direction="column">
          {children}
        </Grid>
      </Backdrop>
    </Fade>
  );
};
