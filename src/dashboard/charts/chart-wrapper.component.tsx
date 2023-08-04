import { ReactNode } from 'react';

import {
  Grid,
  Paper,
  Typography,
  lighten,
  makeStyles,
} from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
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

export { ChartWrapper };
