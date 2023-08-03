import { VictoryBar, VictoryStack } from 'victory';

import { FlyoutTooltip } from '~/components';

import { getStackTotals } from './utils/utils';
import { StyledParentSize } from '../../../components';
import { deliverableSupplySummaryTypes } from '../../../constants';
import { DeliverableSupplySummaryData } from '../../../mocks/fixtures/deliverable_supply_summary';
import { BaseChart } from '../../charts/base-chart/base-chart.component';
import { ChartWrapper } from '../../charts/chart-wrapper.component';
import { CustomLegend } from '../../custom-legend/custom-legend.component';
import { useChartTheme } from '../../useChartTheme';

interface Props {
  data: DeliverableSupplySummaryData;
}

const DeliverableSupplySummary = ({ data }: Props) => {
  const chartTheme = useChartTheme();

  /** Override default stack chart colors */
  const updatedTheme = {
    ...chartTheme,
    stack: {
      colorScale: chartTheme.chartColors.deliverableSupplySummary,
    },
  };

  const legendData = deliverableSupplySummaryTypes.map((range, i) => ({
    name: range,
    color: chartTheme.chartColors.deliverableSupplySummary[i],
  }));

  // TODO: update info
  return (
    <ChartWrapper
      info="Deliverable Supply Summary in Units"
      title="Deliverable Supply Summary"
    >
      <StyledParentSize>
        {({ width }: { width: number }) => {
          const barWidth = width / 20,
            ranges = deliverableSupplySummaryTypes,
            x = 'startYear';

          if (!data) return null;

          return (
            <BaseChart
              financialYearFormat
              theme={updatedTheme}
              width={width}
              xLabel="Financial Year"
              yLabel="Number Of Units"
            >
              <CustomLegend apiData={legendData} width={1024} />
              <VictoryStack>
                {ranges?.map((range) => (
                  <VictoryBar
                    key={range}
                    data={data}
                    labelComponent={FlyoutTooltip()}
                    labels={getStackTotals(data)}
                    style={{ data: { width: barWidth } }}
                    x={x}
                    y={range}
                  />
                ))}
              </VictoryStack>
            </BaseChart>
          );
        }}
      </StyledParentSize>
    </ChartWrapper>
  );
};

export default DeliverableSupplySummary;
