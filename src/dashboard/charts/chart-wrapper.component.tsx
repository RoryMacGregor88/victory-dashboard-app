import { Paper, Typography, lighten, makeStyles } from '@material-ui/core';

import { Skeleton } from '@material-ui/lab';

import clsx from 'clsx';

import { InfoButtonTooltip } from '../../components/info-button-tooltip/info-button-tooltip.component';

const useStyles = makeStyles((theme) => ({
  info: {
    marginLeft: theme.spacing(2),
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: lighten(theme.palette.background.default, 0.055),
    padding: theme.spacing(3),
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
}));

const skeletonStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: lighten(theme.palette.background.default, 0.055),
    padding: theme.spacing(3),
    width: '100%',
  },
  heading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

/**
 * @param {{
 * children: React.ReactNode
 * title: string
 * titleSize?: string
 * info?: string
 * classes?: object
 * }} props
 */
const ChartWrapper = ({
  children,
  title,
  titleSize = 'medium',
  info,
  classes = {},
  ...rest
}) => {
  const styles = useStyles({});
  const { header, paper } = classes;
  return (
    <Paper className={clsx(styles.paper, paper)} {...rest}>
      <div className={clsx(styles.header, header)}>
        <Typography
          component='h3'
          variant={titleSize === 'small' ? 'h4' : 'h2'}
          color='primary'
        >
          {title}
        </Typography>
        {info ? (
          <InfoButtonTooltip
            tooltipContent={info}
            iconButtonClassName={styles.info}
          />
        ) : null}
      </div>
      {children}
    </Paper>
  );
};

export const ChartWrapperSkeleton = ({ children }) => {
  const styles = skeletonStyles();

  return (
    <Paper className={styles.paper}>
      <span className={styles.heading}>
        <Skeleton variant='text' width={300} />
        <Skeleton variant='circle' width={15} height={15} />
      </span>

      <div>
        <Skeleton variant='text' />
        <Skeleton variant='text' />
      </div>

      {children}
    </Paper>
  );
};

export { ChartWrapper };
