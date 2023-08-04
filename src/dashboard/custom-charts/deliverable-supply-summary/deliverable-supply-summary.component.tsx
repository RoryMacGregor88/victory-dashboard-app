import { VictoryBar, VictoryStack } from 'victory';

import { FlyoutTooltip, StyledParentSize } from '~/components';
import { deliverableSupplySummaryTypes } from '~/constants';
import { BaseChart, ChartWrapper } from '~/dashboard/charts';
import { getStackTotals } from '~/dashboard/custom-charts/deliverable-supply-summary/utils/utils';
import { CustomLegend } from '~/dashboard/custom-legend/custom-legend.component';
import { useChartTheme } from '~/dashboard/useChartTheme';
import { DeliverableSupplySummaryData } from '~/mocks/fixtures/deliverable_supply_summary';

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

          // TODO: put these back to ternaries, looks better
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
