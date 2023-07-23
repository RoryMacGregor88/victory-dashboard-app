import { VictoryBar, VictoryStack } from 'victory';

import { BaseChart } from '../../charts/base-chart/base-chart.component';
import { ChartWrapper } from '../../charts/chart-wrapper.component';
import { useChartTheme } from '../../useChartTheme';
import FlyoutTooltip from '../../FlyoutTooltip';
import { getStackTotals } from './utils/utils';
import { CustomLegend } from '../../custom-legend/custom-legend.component';
import { deliverableSupplySummaryTypes } from '../../../constants';
import { StyledParentSize } from '../../../components';
import { DeliverableSupplySummaryData } from '../../../mocks/fixtures/deliverable_supply_summary';

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
      title='Deliverable Supply Summary'
      info='Deliverable Supply Summary in Units'
    >
      <StyledParentSize>
        {({ width }: { width: number }) => {
          const barWidth = width / 20,
            ranges = deliverableSupplySummaryTypes,
            x = 'startYear';

          if (!data) return null;

          return (
            <BaseChart
              width={width}
              yLabel='Number Of Units'
              xLabel='Financial Year'
              theme={updatedTheme}
              financialYearFormat
            >
              <CustomLegend apiData={legendData} width={1024} />
              <VictoryStack>
                {ranges?.map((range) => (
                  <VictoryBar
                    key={range}
                    data={data}
                    x={x}
                    y={range}
                    labelComponent={FlyoutTooltip()}
                    labels={getStackTotals(data)}
                    style={{ data: { width: barWidth } }}
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
