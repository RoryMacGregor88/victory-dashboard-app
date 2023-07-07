import { makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import { ParentSize } from '@visx/responsive';
import { VictoryAnimation, VictoryPie } from 'victory';

const useStyles = makeStyles((theme) => ({
  parentSize: {
    display: 'flex',
    justifyContent: 'center',
  },
  circle: {
    fill: theme.palette.background.default,
  },
  skeleton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: `${theme.spacing(2)} 0`,
  },
}));

/**
 * @param {{
 * color: string,
 * data: {x: number, y: number}[],
 * renderCenterDisplay: function
 * }} props
 */
const ProgressIndicatorChart = ({ color, data, renderCenterDisplay }) => {
  const styles = useStyles();
  return (
    <ParentSize className={styles.parentSize}>
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
              className={styles.circle}
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
              {() =>
                renderCenterDisplay({
                  radius,
                  width,
                })
              }
            </VictoryAnimation>
          </svg>
        );
      }}
    </ParentSize>
  );
};

const ProgressIndicatorChartSkeleton = () => {
  const styles = useStyles();
  return (
    <div className={styles.skeleton}>
      <Skeleton variant='circle' width='8rem' height='8rem' />
    </div>
  );
};

export { ProgressIndicatorChart, ProgressIndicatorChartSkeleton };
