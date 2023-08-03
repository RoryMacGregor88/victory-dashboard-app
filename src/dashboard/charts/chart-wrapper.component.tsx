import { ReactNode } from 'react';

import {
  Grid,
  Paper,
  Typography,
  lighten,
  makeStyles,
} from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';

import { InfoButtonTooltip } from '~/components';

const useStyles = makeStyles((theme) => ({
  iconInfo: {
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
  const { paper, header, iconInfo } = useStyles();
  return (
    <Grid
      container
      item
      className={clsx(paper, classes?.paper)}
      component={Paper}
      direction="column"
      justifyContent="space-between"
      wrap="nowrap"
      {...rest}
    >
      <Grid
        container
        item
        className={clsx(header, classes?.header)}
        justifyContent="space-between"
        wrap="nowrap"
      >
        <Typography
          color="primary"
          component="h3"
          variant={titleSize === 'small' ? 'h4' : 'h2'}
        >
          {title}
        </Typography>
        {!!info ? (
          <InfoButtonTooltip
            iconButtonClassName={iconInfo}
            tooltipContent={info}
          />
        ) : null}
      </Grid>
      {children}
    </Grid>
  );
};

export const ChartWrapperSkeleton = ({ children }: { children: ReactNode }) => {
  const { paper, heading } = skeletonStyles();
  return (
    <Paper className={paper}>
      <span className={heading}>
        <Skeleton variant="text" width={300} />
        <Skeleton height={15} variant="circle" width={15} />
      </span>

      <div>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </div>

      {children}
    </Paper>
  );
};

export { ChartWrapper };
