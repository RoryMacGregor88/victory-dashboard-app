import React from 'react';

import { VictoryTooltip } from 'victory';

import { tooltipFlyoutStyle } from './waltham.constants';

const FlyoutTooltip = () => {
  return (
    <VictoryTooltip
      pointerOrientation="right"
      pointerWidth={25}
      flyoutHeight={40}
      flyoutWidth={100}
      constrainToVisibleArea
      style={{ fill: '#000' }}
      flyoutStyle={tooltipFlyoutStyle}
    />
  );
};

export default FlyoutTooltip;
