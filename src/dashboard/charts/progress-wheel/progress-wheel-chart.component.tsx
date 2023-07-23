import { Grid, makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import { ParentSize } from '@visx/responsive';
import { VictoryAnimation, VictoryPie } from 'victory';
import CenterDisplay from './center-display/center-display.component';
import { ProgressIndicatorData } from '../../../types';

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
            width={halfWidth}
            height={halfWidth}
            viewBox={`0 0 ${halfWidth} ${halfWidth}`}
          >
            <circle
              cx={radius}
              cy={radius}
              r={bgCirlceRadius > 0 ? bgCirlceRadius : 0}
              className={circle}
            />
            <VictoryPie
              standalone={false}
              width={halfWidth}
              height={halfWidth}
              padding={0}
              data={data}
              innerRadius={radius - progressBarWidth}
              cornerRadius={progressBarWidth / 2}
              animate={{ duration: 1000 }}
              labels={() => null}
              style={{
                data: {
                  fill: ({ datum }) => (datum.x === 1 ? color : 'transparent'),
                },
              }}
            />
            <VictoryAnimation duration={1000}>
              {() => (
                <CenterDisplay
                  percentage={percentage}
                  target={target}
                  name={name}
                  radius={radius}
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
  const { ekeleton } = useStyles();
  return (
    <Grid
      item
      container
      alignItems='center'
      justifyContent='center'
      className={skeleton}
    >
      <Skeleton variant='circle' width='8rem' height='8rem' />
    </Grid>
  );
};

export default ProgressIndicatorChart;
