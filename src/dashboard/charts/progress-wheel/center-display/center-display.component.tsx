import { Text } from '@visx/text';

import {
  PERCENT_FONT_DEVISOR,
  TARGET_FONT_DEVISOR,
  ERROR_FONT_DEVISOR,
} from '../../../../constants';

interface CenterDisplayArgs {
  percentage: number | null;
  target: number | null;
  name: string;
  radius: number;
  width: number;
}

/**
 * takes the calculated percentage, as well as other props, and returns a
 * responsive component to be displayed inside the progress indicator
 */
const CenterDisplay = ({
  percentage,
  target,
  name,
  radius,
  width,
}: CenterDisplayArgs) =>
  percentage ? (
    <>
      <Text
        width={radius}
        textAnchor='middle'
        verticalAnchor='end'
        x={radius}
        y={radius}
        dy={-8}
        style={{
          fill: '#fff',
          fontSize: `${width / PERCENT_FONT_DEVISOR}rem`,
        }}
      >
        {`${Math.round(percentage)}%`}
      </Text>
      <Text
        width={radius}
        textAnchor='middle'
        verticalAnchor='start'
        x={radius}
        y={radius}
        dy={8}
        style={{
          fill: '#fff',
          fontSize: `${width / TARGET_FONT_DEVISOR}rem`,
        }}
      >
        {`Target ${target} Units`}
      </Text>
    </>
  ) : (
    <Text
      width={radius}
      textAnchor='middle'
      verticalAnchor='middle'
      x={radius}
      y={radius}
      style={{
        fill: '#fff',
        fontSize: `${width / ERROR_FONT_DEVISOR}rem`,
      }}
    >
      {`${name} Target Required`}
    </Text>
  );

export default CenterDisplay;
