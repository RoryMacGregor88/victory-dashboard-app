import {
  Paper,
  Typography,
  lighten,
  makeStyles,
  Grid,
} from '@material-ui/core';

import { Skeleton } from '@material-ui/lab';

import clsx from 'clsx';

import { InfoButtonTooltip } from '../../components/info-button-tooltip/info-button-tooltip.component';
import { ReactNode } from 'react';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

const useStyles = makeStyles((theme) => ({
  info: {
    marginLeft: theme.spacing(2),
  },
  paper: {
    backgroundColor: lighten(theme.palette.background.default, 0.055),
    padding: theme.spacing(3),
    width: '100%',
  },
  header: {
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

interface Props {
  children: ReactNode;
  title: string;
  titleSize?: 'small' | 'medium' | 'large';
  info?: string;
  classes?: Partial<ClassNameMap<'paper' | 'header'>>;
}

const ChartWrapper = ({
  children,
  title,
  titleSize = 'medium',
  info,
  classes,
  ...rest
}: Props) => {
  const styles = useStyles();
  return (
    <Grid
      item
      container
      direction='column'
      justifyContent='space-between'
      wrap='nowrap'
      component={Paper}
      className={clsx(styles.paper, classes?.paper)}
      {...rest}
    >
      <Grid
        item
        container
        justifyContent='space-between'
        wrap='nowrap'
        className={clsx(styles.header, classes?.header)}
      >
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
      </Grid>
      {children}
    </Grid>
  );
};

export const ChartWrapperSkeleton = ({ children }: { children: ReactNode }) => {
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
