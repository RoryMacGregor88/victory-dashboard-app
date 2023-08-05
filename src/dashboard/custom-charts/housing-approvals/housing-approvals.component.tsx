import { MouseEvent, useMemo } from 'react';

import { makeStyles } from '@material-ui/core';
import { VictoryGroup, VictoryLine, VictoryScatter } from 'victory';

import {
  FlyoutTooltip,
  StyledParentSize,
  ToggleButton,
  ToggleButtonGroup,
} from '~/components';
import { HOUSING_APPROVAL_DATA_TYPES } from '~/constants';
import { BaseChart, ChartWrapper } from '~/dashboard/charts';
import { housingApprovalsTransformer } from '~/dashboard/custom-charts/housing-approvals/housing-approvals-transformer/housing-approvals-transformer';
import { CustomLegend } from '~/dashboard/custom-legend/custom-legend.component';
import { useChartTheme } from '~/dashboard/useChartTheme';
import { HousingApprovalsData } from '~/mocks/fixtures';
import {
  ApprovalsGrantedDataType,
  LegendData,
  Settings,
  UpdateOrbStateArgs,
} from '~/types';

const useStyles = makeStyles(() => ({
  paper: {
    height: 'fit-content',
  },
  toggleButtonGroup: {
    width: '40%',
    marginLeft: '60%',
  },
}));

// TODO: no tests

interface Props {
  data: HousingApprovalsData;
  settings: Settings;
  updateOrbState: (orbState: UpdateOrbStateArgs) => void;
}

const HousingApprovals = ({ data, settings, updateOrbState }: Props) => {
  const { chartColors } = useChartTheme();
  const { paper, toggleButtonGroup } = useStyles();

  const approvalsGrantedDataType =
    settings.approvalsGrantedDataType ?? HOUSING_APPROVAL_DATA_TYPES.monthly;

  const handleToggleClick = ({
    currentTarget: { value },
  }: MouseEvent<HTMLButtonElement>) => {
    const newDataType = value as ApprovalsGrantedDataType;

    /** prevent repeated toggling */
    if (newDataType === approvalsGrantedDataType) return;
    updateOrbState({
      settings: { approvalsGrantedDataType: newDataType },
    });
  };

  /** switches between 'Monthly' or 'Cumulative' datasets */
  const dataByType = useMemo(() => {
    const { data: dataArray } = data.find(
      ({ name }) => name === approvalsGrantedDataType,
    )!;

    return housingApprovalsTransformer(dataArray);
  }, [data, approvalsGrantedDataType]);

  const legendData: LegendData[] = [
    {
      name: 'Actual 2019',
      color: chartColors.approvalsGranted[0],
    },
    {
      name: 'Actual 2020',
      color: chartColors.approvalsGranted[1],
    },
  ];

  const ranges = ['2019', '2020'],
    xLabel = 'Month',
    yLabel = 'No. Housing Approvals Granted';

  return !!dataByType ? (
    <ChartWrapper
      classes={{ paper }}
      info="This shows the number of housing approvals granted over time"
      title="No. of housing approvals granted over time"
    >
      <StyledParentSize>
        {({ width }: { width: number }) => (
          <>
            <ToggleButtonGroup
              className={toggleButtonGroup}
              orientation="horizontal"
              size="small"
              value={approvalsGrantedDataType}
              onChange={handleToggleClick}
            >
              <ToggleButton value={HOUSING_APPROVAL_DATA_TYPES.monthly}>
                {HOUSING_APPROVAL_DATA_TYPES.monthly}
              </ToggleButton>
              <ToggleButton value={HOUSING_APPROVAL_DATA_TYPES.cumulative}>
                {HOUSING_APPROVAL_DATA_TYPES.cumulative}
              </ToggleButton>
            </ToggleButtonGroup>

            <CustomLegend apiData={legendData} width={width} />

            <BaseChart width={width} xLabel={xLabel} yLabel={yLabel}>
              <VictoryGroup>
                {ranges.map((range, i) => {
                  const stroke = chartColors.approvalsGranted[i],
                    x = 'Month';

                  return (
                    <VictoryGroup key={range}>
                      <VictoryLine
                        data={dataByType}
                        style={{ data: { stroke } }}
                        x={x}
                        y={range}
                      />
                      <VictoryScatter
                        data={dataByType}
                        labelComponent={FlyoutTooltip()}
                        labels={({ datum: { _y } }) => `${_y}`}
                        style={{ data: { fill: stroke, stroke } }}
                        x={x}
                        y={range}
                      />
                    </VictoryGroup>
                  );
                })}
              </VictoryGroup>
            </BaseChart>
          </>
        )}
      </StyledParentSize>
    </ChartWrapper>
  ) : null;
};

export default HousingApprovals;
