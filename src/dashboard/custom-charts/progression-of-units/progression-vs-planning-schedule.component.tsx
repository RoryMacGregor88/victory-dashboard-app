import { Grid, Select, MenuItem } from '@material-ui/core';

import { ColorScalePropType, VictoryBar, VictoryStack } from 'victory';

import { BaseChart } from '../../charts/base-chart/base-chart.component';
import { ChartWrapper } from '../../charts/chart-wrapper.component';
import { StyledParentSize } from '../../charts/styled-parent-size.component';
import { useChartTheme } from '../../useChartTheme';
import FlyoutTooltip from '../../FlyoutTooltip';
import { filterByType, getStackDatumTotal } from '../../utils/utils';
import { useSelectStyles } from '../../custom-date-range/custom-date-range.component';
import { CustomLegend } from '../../custom-legend/custom-legend.component';
import {
  progressionVsPlanningCategories,
  progressionVsPlanningPalette,
  ALL_TENURE_CATEGORIES,
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
  const { root, select } = useSelectStyles({});

  const selectedCategory =
    settings.progressionVsPlanningCategory ?? ALL_TENURE_CATEGORIES;

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
      title='Progression of Units Relating to Planning Schedule'
      info='This graph uses mock data to demonstrate how housing delivery progress information could be presented.'
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

          // TODO: skeleton here?
          if (!filteredData) return null;

          return (
            <>
              <Grid
                container
                justifyContent='space-between'
                alignItems='center'
                wrap='nowrap'
              >
                <Grid item>
                  <CustomLegend apiData={legendData} width={width} />
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
                    <MenuItem value={ALL_TENURE_CATEGORIES}>
                      {ALL_TENURE_CATEGORIES}
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
                      labels={({ datum }) =>
                        getStackDatumTotal({ datum, ranges })
                      }
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
