import * as React from 'react';

import { Box } from '@astrosat/astrosat-ui';

import { OrbisLogo } from './orbis-logo.component';

export default { title: 'Components/Orbis Logo' };

export const Default = () => <OrbisLogo />;

export const Colors = () => (
  <Box display="flex" flexDirection="column">
    <OrbisLogo />
    <OrbisLogo color="secondary" />
    <OrbisLogo color="inherit" />
    <OrbisLogo color="action" />
    <OrbisLogo color="disabled" />
    <OrbisLogo color="error" />
  </Box>
);

export const Variants = () => (
  <Box display="flex" flexDirection="column">
    <OrbisLogo />
    <OrbisLogo variant="admin" />
  </Box>
);
