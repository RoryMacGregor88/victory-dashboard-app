import { Fade, Backdrop } from '@material-ui/core';

export const LoadMaskFallback = ({ zIndex = 1 }) => (
  <Fade in>
    <div>
      <Backdrop style={{ zIndex }} open />
    </div>
  </Fade>
);
