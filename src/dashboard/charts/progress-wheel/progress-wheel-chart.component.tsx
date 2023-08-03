import { Grid, makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { ParentSize } from '@visx/responsive';
import { VictoryAnimation, VictoryPie } from 'victory';

import CenterDisplay from '~/dashboard/charts/progress-wheel/center-display/center-display.component';
import { ProgressIndicatorData } from '~/types';

const useStyles = makeStyles((theme) => ({
  parentSize: {
    display: 'flex',
    justifyContent: 'center',
  },
  circle: {
    fill: theme.palette.background.default,
  },
  skeleton: {
    margin: `${theme.spacing(2)} 0`,
  },
}));

// TODO: formidable.com/open-source/victory/docs/victory-animation/

interface Props {
  color: string;
  data: ProgressIndicatorData;
  percentage: number | null;
  target: number | null;
  name: string;
}

const ProgressIndicatorChart = ({
  color,
  data,
  percentage,
  target,
  name,
}: Props) => {
  const { parentSize, circle } = useStyles();
  return (
    <ParentSize className={parentSize}>
      {({ width }) => {
        const halfWidth = width / 2,
          radius = halfWidth / 2,
          progressBarWidth = width / 20,
          bgCirlceRadius = radius - progressBarWidth / 2;

        return (
          <svg
            height={halfWidth}
            viewBox={`0 0 ${halfWidth} ${halfWidth}`}
            width={halfWidth}
          >
            <circle
              className={circle}
              cx={radius}
              cy={radius}
              r={bgCirlceRadius > 0 ? bgCirlceRadius : 0}
            />
            <VictoryPie
              animate={{ duration: 1000 }}
              cornerRadius={progressBarWidth / 2}
              data={data}
              height={halfWidth}
              innerRadius={radius - progressBarWidth}
              labels={() => null}
              padding={0}
              standalone={false}
              style={{
                data: {
                  fill: ({ datum }) => (datum.x === 1 ? color : 'transparent'),
                },
              }}
              width={halfWidth}
            />
            <VictoryAnimation duration={2000}>
              {() => (
                <CenterDisplay
                  name={name}
                  percentage={percentage}
                  radius={radius}
                  target={target}
                  width={width}
                />
              )}
            </VictoryAnimation>
          </svg>
        );
      }}
    </ParentSize>
  );
};

// TODO: use this or ditch?
export const ProgressIndicatorChartSkeleton = () => {
  const { skeleton } = useStyles();
  return (
    <Grid
      container
      item
      alignItems="center"
      className={skeleton}
      justifyContent="center"
    >
      <Skeleton height="8rem" variant="circle" width="8rem" />
    </Grid>
  );
};

export default ProgressIndicatorChart;
