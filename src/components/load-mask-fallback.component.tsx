import { Fade, Backdrop } from '@material-ui/core';

export const LoadMaskFallback = ({ zIndex = 1 }) => (
  <Fade in>
    <Backdrop data-testid='loadmask' style={{ zIndex }} open />
  </Fade>
);
