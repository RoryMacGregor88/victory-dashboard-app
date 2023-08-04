import { Grid, MenuItem, Select } from '@material-ui/core';
import { ColorScalePropType, VictoryBar, VictoryStack } from 'victory';

import { FlyoutTooltip, StyledParentSize } from '~/components';
import {
  ALL_TENURE_CATEGORIES,
  progressionVsPlanningCategories,
  progressionVsPlanningPalette,
} from '~/constants';
import { BaseChart } from '~/dashboard/charts/base-chart/base-chart.component';
import { ChartWrapper } from '~/dashboard/charts/chart-wrapper.component';
import { useSelectStyles } from '~/dashboard/custom-date-range/custom-date-range.component';
import { CustomLegend } from '~/dashboard/custom-legend/custom-legend.component';
import { useChartTheme } from '~/dashboard/useChartTheme';
import { filterByType, getStackDatumTotal } from '~/dashboard/utils/utils';
import { ProgressionOfUnitsData } from '~/mocks/fixtures';
import {
  ChartTheme,
  ProgressionVsPlanningCategory,
  Settings,
  UpdateOrbStateArgs,
} from '~/types';

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
  const { root, select } = useSelectStyles({});

  const selectedCategory =
    settings.progressionVsPlanningCategory ?? ALL_TENURE_CATEGORIES;

  const progressVsPlanningValues = Object.values(
    progressionVsPlanningCategories,
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

  const legendData = progressVsPlanningValues.map((range, i) => ({
    name: `Units ${range}` /** example: 'Units' + 'Ahead of Schedule' */,
    color: chartTheme.chartColors.progressionVsPlanning[i],
  }));

  const handleTypeSelect = (category: ProgressionVsPlanningCategory) =>
    updateOrbState({
      settings: { progressionVsPlanningCategory: category },
    });

  return (
    <ChartWrapper
      info="This graph uses mock data to demonstrate how housing delivery progress information could be presented."
      title="Progression of Units Relating to Planning Schedule"
    >
      <StyledParentSize>
        {({ width }: { width: number }) => {
          const barWidth = width / 20;

          const showAllData = selectedCategory === ALL_TENURE_CATEGORIES;

          const ranges = showAllData
            ? progressVsPlanningValues
            : [progressionVsPlanningCategories[selectedCategory]];

          const selectedType = showAllData
            ? null
            : (progressionVsPlanningCategories[
                selectedCategory
              ] as keyof ProgressionOfUnitsData[number]);

          const x = 'startYear';

          const filteredData = filterByType<ProgressionOfUnitsData[number]>({
            apiData: data,
            selectedType,
          });

          return !!filteredData ? (
            <>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                wrap="nowrap"
              >
                <Grid item>
                  <CustomLegend apiData={legendData} width={width} />
                </Grid>
                <Grid item>
                  <Select
                    disableUnderline
                    classes={{ root, select }}
                    value={selectedCategory}
                    onChange={({ target: { value } }) =>
                      handleTypeSelect(value as ProgressionVsPlanningCategory)
                    }
                  >
                    <MenuItem value={ALL_TENURE_CATEGORIES}>
                      {ALL_TENURE_CATEGORIES}
                    </MenuItem>
                    {Object.entries(progressionVsPlanningCategories).map(
                      ([key, value]) => (
                        <MenuItem key={key} value={key}>
                          {value}
                        </MenuItem>
                      ),
                    )}
                  </Select>
                </Grid>
              </Grid>

              <BaseChart
                financialYearFormat
                theme={extendedTheme}
                width={width}
                xLabel="Financial Year"
                yLabel="Number Of Units"
              >
                <VictoryStack>
                  {ranges.map((range) => (
                    <VictoryBar
                      key={range}
                      data={filteredData}
                      labelComponent={FlyoutTooltip()}
                      labels={({ datum }) =>
                        getStackDatumTotal({ datum, ranges })
                      }
                      style={{
                        data: {
                          width: barWidth,
                          fill: progressionVsPlanningPalette[range],
                        },
                      }}
                      x={x}
                      y={range}
                    />
                  ))}
                </VictoryStack>
              </BaseChart>
            </>
          ) : null;
        }}
      </StyledParentSize>
    </ChartWrapper>
  );
};

export default ProgressionVsPlanningSchedule;
