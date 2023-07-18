import { Grid, Select, MenuItem } from '@material-ui/core';

import { ColorScalePropType, VictoryBar, VictoryStack } from 'victory';

import { BaseChart } from '../../charts/base-chart/base-chart.component';
import { ChartWrapper } from '../../charts/chart-wrapper.component';
import { StyledParentSize } from '../../charts/styled-parent-size.component';
import { useChartTheme } from '../../useChartTheme';
import FlyoutTooltip from '../../FlyoutTooltip';
import { filterByType, getStackDatumTotal } from '../../utils/utils';
import { useWalthamSelectStyles } from '../../custom-date-range/custom-date-range.component';
import { WalthamCustomLegend } from '../../custom-legend/custom-legend.component';
import {
  progressionVsPlanningCategories,
  progressionVsPlanningPalette,
  ALL_TENURE_TYPES,
} from '../../../constants';
import { ProgressionOfUnitsData } from '../../../mocks/fixtures';
import {
  Settings,
  UpdateOrbStateArgs,
  ChartTheme,
  ProgressionVsPlanningCategory,
} from '../../../types';

interface Props {
  data: ProgressionOfUnitsData;
  settings: Settings;
  updateOrbState: (orbState: UpdateOrbStateArgs) => void;
}

const ProgressionVsPlanningSchedule = ({
  data,
  settings,
  updateOrbState,
}: Props) => {
  const chartTheme = useChartTheme();
  const { root, select } = useWalthamSelectStyles({});

  const selectedCategory =
    settings.progressionVsPlanningCategory ?? ALL_TENURE_TYPES;

  const progressVsPlanningValues = Object.values(
    progressionVsPlanningCategories
  );

  /**
   * The theme has a hard-coded value for stacked charts, but we want the
   * colours to be a different set. Therefore the theme is being extended
   */
  const extendedTheme: ChartTheme = {
    ...chartTheme,
    stack: {
      colorScale: chartTheme.chartColors
        .progressionVsPlanning as ColorScalePropType,
    },
  };

  const apiLegendData = progressVsPlanningValues.map((range, i) => ({
    name: `Units ${range}` /** example: 'Units' + 'Ahead of Schedule' */,
    color: chartTheme.chartColors.progressionVsPlanning[i],
  }));

  const handleTypeSelect = (category: ProgressionVsPlanningCategory) =>
    updateOrbState({
      settings: { progressionVsPlanningCategory: category },
    });

  return (
    <ChartWrapper
      title='Progression of Units Relating to Planning Schedule'
      info='This graph uses mock data to demonstrate how housing delivery progress information could be presented.'
    >
      <StyledParentSize>
        {({ width }: { width: number }) => {
          const barWidth = width / 20;

          const showAllData = selectedCategory === ALL_TENURE_TYPES;

          const ranges = showAllData
            ? progressVsPlanningValues
            : [progressionVsPlanningCategories[selectedCategory]];

          const x = 'Year';

          const filteredData = showAllData
            ? data
            : filterByType<ProgressionOfUnitsData[number]>({
                data,
                selectedType: progressionVsPlanningCategories[selectedCategory],
              });

          // TODO: skeleton here?
          if (!filteredData) return null;

          console.log('filteredData: ', filteredData);

          return (
            <>
              <Grid
                container
                justifyContent='space-between'
                alignItems='center'
                wrap='nowrap'
              >
                <Grid item>
                  <WalthamCustomLegend
                    apiLegendData={apiLegendData}
                    width={width}
                  />
                </Grid>
                <Grid item>
                  <Select
                    value={selectedCategory}
                    onChange={({ target: { value } }) =>
                      handleTypeSelect(value as ProgressionVsPlanningCategory)
                    }
                    classes={{ root, select }}
                    disableUnderline
                  >
                    <MenuItem value={ALL_TENURE_TYPES}>
                      {ALL_TENURE_TYPES}
                    </MenuItem>
                    {Object.entries(progressionVsPlanningCategories).map(
                      ([key, value]) => (
                        <MenuItem key={key} value={key}>
                          {value}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </Grid>
              </Grid>

              <BaseChart
                width={width}
                yLabel='Number Of Units'
                xLabel='Financial Year'
                theme={extendedTheme}
                financialYearFormat
              >
                <VictoryStack>
                  {ranges.map((range) => (
                    <VictoryBar
                      labelComponent={FlyoutTooltip()}
                      key={range}
                      data={filteredData}
                      x={x}
                      y={range}
                      labels={({ datum }) => getStackDatumTotal(datum, ranges)}
                      style={{
                        data: {
                          width: barWidth,
                          fill: progressionVsPlanningPalette[range],
                        },
                      }}
                    />
                  ))}
                </VictoryStack>
              </BaseChart>
            </>
          );
        }}
      </StyledParentSize>
    </ChartWrapper>
  );
};

export default ProgressionVsPlanningSchedule;
