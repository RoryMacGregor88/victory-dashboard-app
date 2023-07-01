import React, { useMemo } from 'react';

import { VictoryBar, VictoryStack } from 'victory';

import { BaseChart } from '~/dashboard/charts/base-chart/base-chart.component';
import { ChartWrapper } from '~/dashboard/charts/chart-wrapper.component';
import { useChartTheme } from '~/dashboard/useChartTheme';
import FlyoutTooltip from '~/dashboard/chartDashboard/FlyoutTooltip';
import { labelsForArrayOfObjects } from '~/dashboard/chartDashboard/tooltips-utils';
import { WalthamCustomLegend } from '~/dashboard/chartDashboard/waltham-custom-legend/waltham-custom-legend.component';
import { deliverableSupplySummaryTypes } from '~/dashboard/chartDashboard/waltham.constants';

const DeliverableSupplySummary = ({ data }) => {
  const chartTheme = useChartTheme();
  // This chart was implemented but was subsequently dropped when it was
  // found to have been done too early. Currently not used but code kept
  // here in case it is needed again
  const updatedTheme = {
    ...chartTheme,
    stack: {
      colorScale: chartTheme.walthamChartColors.deliverableSupplySummary,
    },
  };

  const DeliverableSupplySummaryChartData = useMemo(
    () => data?.properties[0].data,
    [data]
  );

  const legendData = deliverableSupplySummaryTypes.map((range, i) => ({
    name: range,
    color: chartTheme.walthamChartColors.deliverableSupplySummary[i],
  }));

  const DeliverableSupplySummaryLegend = () => {
    return <WalthamCustomLegend apiLegendData={legendData} width={1024} />;
  };

  const apiData = data?.properties[0]?.data;
  const totalsArray = labelsForArrayOfObjects(
    apiData,
    'Year',
    (item) => `Total is ${item}`
  );

  const renderStackedBarChart = (width) => {
    const barWidth = width / 20;
    const ranges = deliverableSupplySummaryTypes;
    const x = 'Year';

    return DeliverableSupplySummaryChartData ? (
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
    ) : null;
  };

  return (
    <ChartWrapper
      title='Deliverable Supply Summary'
      info='Deliverable Supply Summary in Units'
    >
      <BaseChart
        yLabel='Number Of Units'
        xLabel='Financial Year'
        renderChart={renderStackedBarChart}
        renderLegend={DeliverableSupplySummaryLegend}
        theme={updatedTheme}
      />
    </ChartWrapper>
  );
};

export default DeliverableSupplySummary;
