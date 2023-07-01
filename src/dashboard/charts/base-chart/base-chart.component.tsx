import numeral from 'numeral';
import { VictoryAxis, VictoryChart } from 'victory';

import { useChartTheme } from '../../useChartTheme';

/**
 * @param {{
 *  children: React.ReactNode
 *  width: number
 *  xLabel?: string
 *  yLabel?: string
 *  financialYear?: boolean
 *  theme?: object
 * }} props
 */
const BaseChart = ({
  children,
  width,
  xLabel = '',
  yLabel = '',
  financialYear = false,
  theme = {},
}) => {
  const chartTheme = { ...useChartTheme(), ...theme };

  const getXTickFormat = (tick) => {
    if (financialYear) {
      const year = Math.floor(tick);
      return [`${year}-`, `${year + 1}`];
    } else {
      return isNaN(Number(tick)) ? tick.toString() : tick;
    }
  };

  const getYTickFormat = (tick) =>
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

export { BaseChart };
