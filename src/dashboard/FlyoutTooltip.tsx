import { VictoryTooltip } from 'victory';

import { useTheme } from '@material-ui/core';

import { tooltipFlyoutStyle } from '../constants';

/**
 * Usage of this is like a function call (FlyoutTooltip()), instead of
 * JSX (<FlyoutTooltip />) because Victory has a problem with wrapping its
 * components in non-Victory JSX tags. I've investigated this and discovered
 * that it's to do with cloning of children components, and will be refactored
 * at some point in the future.
 */

const FlyoutTooltip = () => {
  const {
    palette: { common },
  } = useTheme();

  return (
    <VictoryTooltip
      pointerOrientation='right'
      pointerWidth={25}
      flyoutHeight={40}
      flyoutWidth={100}
      constrainToVisibleArea
      flyoutStyle={tooltipFlyoutStyle}
      style={{ fill: common.black }}
    />
  );
};

export default FlyoutTooltip;
