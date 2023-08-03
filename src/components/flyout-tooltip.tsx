import { useTheme } from '@material-ui/core';
import { VictoryTooltip } from 'victory';

import { tooltipFlyoutStyle } from '~/constants';

/**
 * Usage of this is like a function call (FlyoutTooltip()), instead of
 * JSX (<FlyoutTooltip />) because Victory has a problem with wrapping its
 * components in non-Victory JSX tags. I've investigated this and discovered
 * that it's to do with cloning of children components, and will be refactored
 * at some point in the future.
 */

export const FlyoutTooltip = () => {
  const {
    palette: { common },
  } = useTheme();

  return (
    <VictoryTooltip
      constrainToVisibleArea
      flyoutHeight={40}
      flyoutStyle={tooltipFlyoutStyle}
      flyoutWidth={100}
      pointerOrientation="right"
      pointerWidth={25}
      style={{ fill: common.black }}
    />
  );
};
