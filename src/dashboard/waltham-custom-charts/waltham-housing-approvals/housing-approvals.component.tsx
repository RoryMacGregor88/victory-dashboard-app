import { useMemo, useState } from 'react';

import { makeStyles } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '../../../components';

import { VictoryGroup, VictoryLine, VictoryScatter } from 'victory';

import { BaseChart } from '../../charts/base-chart/base-chart.component';
import { ChartWrapper } from '../../charts/chart-wrapper.component';
import { StyledParentSize } from '../../charts/styled-parent-size.component';
import { useChartTheme } from '../../useChartTheme';
import FlyoutTooltip from '../../FlyoutTooltip';
import { WalthamCustomLegend } from '../../waltham-custom-legend/waltham-custom-legend.component';
import { HOUSING_APPROVAL_DATA_TYPES } from '../../../constants';

import { lineDataTransformer } from '../../utils/utils';
import { HousingApprovalsData } from '../../../mocks/fixtures';
import { Settings, UserOrbState } from '../../../accounts/accounts.slice';
import { LegendData } from '../../../types';

const useStyles = makeStyles(() => ({
  wrapper: {
    height: 'fit-content',
  },
  toggleButtonGroup: {
    width: '40%',
    marginLeft: '60%',
  },
}));

interface Props {
  x?: string;
  xLabel?: string;
  yLabel?: string;
  ranges?: string[];
  data: HousingApprovalsData;
  settings: Settings;
  setDashboardSettings: React.Dispatch<React.SetStateAction<UserOrbState>>;
}

const HousingApprovalsComponent = ({
  x = 'x',
  xLabel = '',
  yLabel = '',
  ranges = ['y'],
  data,
  settings,
  setDashboardSettings,
}: Props) => {
  const { walthamChartColors } = useChartTheme();
  const styles = useStyles();

  const [configuration, setConfiguration] = useState(
    settings?.approvalsGrantedDataType ?? HOUSING_APPROVAL_DATA_TYPES.monthly
  );

  const handleToggleClick = (
    _: unknown,
    newValue: Settings['approvalsGrantedDataType']
  ) => {
    setConfiguration(newValue);
    setDashboardSettings((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        approvalsGrantedDataType: newValue,
      },
    }));
  };

  // TODO: how to type this?
  const dataByType = useMemo(
    () =>
      lineDataTransformer(
        data?.find((datum) => datum.name === configuration)?.data
      ),
    [data, configuration]
  );

  const apiLegendData: LegendData[] = [
    {
      name: 'Actual 2019',
      color: walthamChartColors.housingApproval[0],
    },
    {
      name: 'Actual 2020',
      color: walthamChartColors.housingApproval[1],
    },
  ];

  const HousingApprovalsLineChart = () => {
    if (!dataByType) return null;
    return (
      <VictoryGroup>
        {ranges?.map((range, i) => {
          const color = walthamChartColors.housingApproval[i],
            props = {
              data: dataByType,
              x,
              y: range,
            };

          return (
            <VictoryLine
              {...props}
              style={{ data: { stroke: color } }}
              key={range}
            />
          );
        })}
        {ranges?.map((range, i) => {
          const color = walthamChartColors.housingApproval[i],
            props = {
              data: dataByType,
              x,
              y: range,
            };

          return (
            <VictoryScatter
              key={range}
              {...props}
              style={{ data: { stroke: color } }}
              labelComponent={FlyoutTooltip()}
              labels={({ datum }) => `${datum._y}`}
            />
          );
        })}
      </VictoryGroup>
    );
  };

  return (
    <ChartWrapper
      title='No. of housing approvals granted over time'
      info='This shows the number of housing approvals granted over time'
      classes={{ paper: styles.wrapper }}
    >
      <StyledParentSize>
        {({ width }: { width: number }) => (
          <>
            <ToggleButtonGroup
              size='small'
              value={configuration}
              orientation='horizontal'
              onChange={handleToggleClick}
              className={styles.toggleButtonGroup}
            >
              <ToggleButton value={HOUSING_APPROVAL_DATA_TYPES.monthly}>
                {HOUSING_APPROVAL_DATA_TYPES.monthly}
              </ToggleButton>
              <ToggleButton value={HOUSING_APPROVAL_DATA_TYPES.cumulative}>
                {HOUSING_APPROVAL_DATA_TYPES.cumulative}
              </ToggleButton>
            </ToggleButtonGroup>
            <WalthamCustomLegend apiLegendData={apiLegendData} width={width} />
            <BaseChart width={width} xLabel={xLabel} yLabel={yLabel}>
              {HousingApprovalsLineChart()}
            </BaseChart>
          </>
        )}
      </StyledParentSize>
    </ChartWrapper>
  );
};

export { HousingApprovalsComponent };
