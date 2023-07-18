import { useMemo } from 'react';

import { VictoryBar, VictoryStack } from 'victory';

import { BaseChart } from '../../charts/base-chart/base-chart.component';
import { ChartWrapper } from '../../charts/chart-wrapper.component';
import { useChartTheme } from '../../useChartTheme';
import FlyoutTooltip from '../../FlyoutTooltip';
import { labelsForArrayOfObjects } from '../../../dashboard/utils/utils';
import { CustomLegend } from '../../custom-legend/custom-legend.component';
import { deliverableSupplySummaryTypes } from '../../../constants';
import { StyledParentSize } from '../../charts/styled-parent-size.component';

const DeliverableSupplySummary = ({ data }) => {
  const chartTheme = useChartTheme();
  /**
   * This chart was implemented but was subsequently dropped when it was
   * found to have been done too early. Currently not used but code kept
   * here in case it is needed again
   */
  const updatedTheme = {
    ...chartTheme,
    stack: {
      colorScale: chartTheme.chartColors.deliverableSupplySummary,
    },
  };

  const DeliverableSupplySummaryChartData = useMemo(
    () => data.properties.data,
    [data]
  );

  const legendData = deliverableSupplySummaryTypes.map((range, i) => ({
    name: range,
    color: chartTheme.chartColors.deliverableSupplySummary[i],
  }));

  const apiData = data?.properties.data;
  const totalsArray = labelsForArrayOfObjects(
    apiData,
    'Year',
    (item) => `Total is ${item}`
  );

  // TODO: update info

  return (
    <ChartWrapper
      title='Deliverable Supply Summary'
      info='Deliverable Supply Summary in Units'
    >
      <StyledParentSize>
        {({ width }: { width: number }) => {
          const barWidth = width / 20;
          const ranges = deliverableSupplySummaryTypes;
          const x = 'Year';

          return DeliverableSupplySummaryChartData ? (
            <BaseChart
              width={width}
              yLabel='Number Of Units'
              xLabel='Financial Year'
              theme={updatedTheme}
            >
              <CustomLegend apiLegendData={legendData} width={1024} />
              <VictoryStack>
                {ranges?.map((range) => (
                  <VictoryBar
                    key={range}
                    data={DeliverableSupplySummaryChartData}
                    x={x}
                    y={range}
                    labelComponent={FlyoutTooltip()}
                    labels={totalsArray}
                    style={{
                      data: {
                        width: barWidth,
                      },
                    }}
                  />
                ))}
              </VictoryStack>
            </BaseChart>
          ) : null;
        }}
      </StyledParentSize>
    </ChartWrapper>
  );
};

export default DeliverableSupplySummary;
