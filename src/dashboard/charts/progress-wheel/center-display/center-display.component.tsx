import { Text } from '@visx/text';

import {
  ERROR_FONT_DEVISOR,
  PERCENT_FONT_DEVISOR,
  TARGET_FONT_DEVISOR,
} from '~/constants';

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
        dy={-8}
        style={{
          fill: '#fff',
          fontSize: `${width / PERCENT_FONT_DEVISOR}rem`,
        }}
        textAnchor="middle"
        verticalAnchor="end"
        width={radius}
        x={radius}
        y={radius}
      >
        {`${Math.round(percentage)}%`}
      </Text>
      <Text
        dy={8}
        style={{
          fill: '#fff',
          fontSize: `${width / TARGET_FONT_DEVISOR}rem`,
        }}
        textAnchor="middle"
        verticalAnchor="start"
        width={radius}
        x={radius}
        y={radius}
      >
        {`Target ${target} Units`}
      </Text>
    </>
  ) : (
    <Text
      style={{
        fill: '#fff',
        fontSize: `${width / ERROR_FONT_DEVISOR}rem`,
      }}
      textAnchor="middle"
      verticalAnchor="middle"
      width={radius}
      x={radius}
      y={radius}
    >
      {`${name} Target Required`}
    </Text>
  );

export default CenterDisplay;
