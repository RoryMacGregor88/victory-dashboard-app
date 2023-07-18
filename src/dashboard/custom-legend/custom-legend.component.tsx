import { Grid, makeStyles } from '@material-ui/core';
import { LegendData } from '../../types';

const RATIOS = {
    legendContainer: 0.1125,
    squareIconSize: 0.03,
    fontSize: 0.025,
    lineIconWidth: 0.06,
    lineIconHeight: 0.005,
    iconSpacing: 0.015,
  },
  MAX_FONT_SIZE = 16;

const useStyles = makeStyles(() => ({
  apiLegend: {
    width: '100%',
    maxHeight: '5rem',
    marginTop: ({ padTop }) => (padTop ? '1rem' : '0'),
    marginBottom: ({ padBottom }) => (padBottom ? '1rem' : '0'),
  },
  legendItem: { width: 'fit-content' },
  userTarget: {
    width: '100%',
  },
}));

interface Props {
  apiLegendData: LegendData[];
  targetLegendData?: { name: string; color: string };
  width: number;
  padTop?: boolean;
  padBottom?: boolean;
}

export const CustomLegend = ({
  apiLegendData,
  targetLegendData,
  width,
  padTop = false,
  padBottom = false,
}: Props) => {
  const maxHeight = width * RATIOS.legendContainer,
    fontSize = width * RATIOS.fontSize,
    fontSizeLimit = fontSize < MAX_FONT_SIZE ? fontSize : MAX_FONT_SIZE,
    styles = useStyles({ maxHeight, padTop, padBottom });

  return (
    <Grid container direction='column' justifyContent='space-between'>
      <Grid
        item
        container
        direction='column'
        wrap='wrap'
        className={styles.apiLegend}
      >
        {apiLegendData?.map(({ name, color }) => {
          const legendItemMargin = width * RATIOS.iconSpacing;
          return (
            <Grid
              key={name}
              item
              container
              alignItems='center'
              className={styles.legendItem}
            >
              {/* creates square with correct color */}
              <div
                style={{
                  width: width * RATIOS.squareIconSize,
                  height: width * RATIOS.squareIconSize,
                  backgroundColor: `${color}`,
                  marginRight: legendItemMargin,
                  marginLeft: legendItemMargin,
                  maxWidth: '1rem',
                  maxHeight: '1rem',
                }}
              />
              <span style={{ fontSize: fontSizeLimit }}>{name}</span>
            </Grid>
          );
        })}
      </Grid>

      {!!targetLegendData ? (
        <Grid
          item
          container
          justifyContent='flex-end'
          alignItems='center'
          className={styles.userTarget}
        >
          {/* creates line with correct color */}
          <div
            style={{
              width: width * RATIOS.lineIconWidth,
              height: width * RATIOS.lineIconHeight,
              backgroundColor: `${targetLegendData.color}`,
              marginRight: width * RATIOS.iconSpacing,
            }}
          />
          <span
            style={{
              fontSize: fontSizeLimit,
            }}
          >
            {targetLegendData.name}
          </span>
        </Grid>
      ) : null}
    </Grid>
  );
};
