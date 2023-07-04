import { VictoryTooltip } from 'victory';

import { tooltipFlyoutStyle } from '../constants';

const FlyoutTooltip = () => (
  <VictoryTooltip
    pointerOrientation='right'
    pointerWidth={25}
    flyoutHeight={40}
    flyoutWidth={100}
    constrainToVisibleArea
    style={{ fill: '#000' }} // TODO: use theme (styled)
    flyoutStyle={tooltipFlyoutStyle}
  />
);

export default FlyoutTooltip;
