import { Grid, makeStyles } from '@material-ui/core';

import { LegendData } from '~/types';

const RATIOS = {
    legendContainer: 0.1125,
    squareIconSize: 0.03,
    fontSize: 0.025,
    lineIconWidth: 0.06,
    lineIconHeight: 0.005,
    iconSpacing: 0.015,
  },
  MAX_FONT_SIZE = 16;

interface StylesProps {
  padTop?: boolean;
  padBottom?: boolean;
}

const useStyles = makeStyles((theme) => ({
  apiLegend: {
    width: '100%',
    height: theme.spacing(8),
    marginTop: ({ padTop }: StylesProps) => (padTop ? theme.spacing(2) : '0'),
    marginBottom: ({ padBottom }: StylesProps) =>
      padBottom ? theme.spacing(2) : '0',
  },
  legendItem: { width: 'fit-content' },
  userTarget: {
    width: '100%',
  },
}));

interface Props {
  apiData: LegendData[];
  targetData?: { name: string; color: string } | null;
  width: number;
  padTop?: boolean;
  padBottom?: boolean;
}

export const CustomLegend = ({
  apiData,
  targetData,
  width,
  padTop = false,
  padBottom = false,
}: Props) => {
  const fontSize = width * RATIOS.fontSize,
    fontSizeLimit = fontSize < MAX_FONT_SIZE ? fontSize : MAX_FONT_SIZE,
    styles = useStyles({ padTop, padBottom });

  return (
    <Grid container direction="column" justifyContent="space-between">
      <Grid
        container
        item
        className={styles.apiLegend}
        direction="column"
        wrap="wrap"
      >
        {apiData?.map(({ name, color }) => {
          const legendItemMargin = width * RATIOS.iconSpacing;
          return (
            <Grid
              key={name}
              container
              item
              alignItems="center"
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

      {!!targetData ? (
        <Grid
          container
          item
          alignItems="center"
          className={styles.userTarget}
          justifyContent="flex-end"
        >
          {/* creates line with correct color */}
          <div
            style={{
              width: width * RATIOS.lineIconWidth,
              height: width * RATIOS.lineIconHeight,
              backgroundColor: `${targetData.color}`,
              marginRight: width * RATIOS.iconSpacing,
            }}
          />
          <span
            style={{
              fontSize: fontSizeLimit,
            }}
          >
            {targetData.name}
          </span>
        </Grid>
      ) : null}
    </Grid>
  );
};
