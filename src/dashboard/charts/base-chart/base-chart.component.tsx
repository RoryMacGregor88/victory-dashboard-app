import { ReactNode } from 'react';

import numeral from 'numeral';
import { VictoryAxis, VictoryChart } from 'victory';

import { useChartTheme } from '../../useChartTheme';
import { ChartTheme } from '../../../types';

interface Props {
  children: ReactNode;
  width: number;
  xLabel?: string;
  yLabel?: string;
  financialYearFormat?: boolean;
  theme?: Partial<ChartTheme>;
}

export const BaseChart = ({
  children,
  width,
  xLabel = '',
  yLabel = '',
  financialYearFormat = false,
  theme = {},
}: Props) => {
  const chartTheme = { ...useChartTheme(), ...theme };

  // TODO: what's going on with this? Is it a string or a number?
  const getXTickFormat = (tick: number) => {
    if (financialYearFormat) {
      const year = Math.floor(tick);
      return [`${year}-`, `${year + 1}`];
    } else {
      // TODO: what does this NaN check do?
      return isNaN(Number(tick)) ? tick.toString() : tick;
    }
  };

  // TODO: same here, seemingly both a string and a number
  const getYTickFormat = (tick: number) =>
    numeral(Number(tick).toLocaleString()).format(
      `${tick > 1000 ? '0.0' : '0'} a`
    );

  return (
    <VictoryChart
      theme={chartTheme}
      width={width}
      height={width / 1.778}
      domainPadding={{ x: width * 0.1 }}
      animate={{ duration: 1000 }}
    >
      <VictoryAxis label={xLabel} tickFormat={getXTickFormat} />
      <VictoryAxis
        dependentAxis
        label={yLabel}
        tickFormat={getYTickFormat}
        style={{
          axisLabel: { padding: 50 },
        }}
      />
      {children}
    </VictoryChart>
  );
};
