import {
  GridProps,
  GridTypeMap,
  Grid as MuiGrid,
  makeStyles,
} from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: { gap: theme.spacing(2) },
}));

/**
 * This is here simply to avoid having to space every single Grid instance.
 * Can be overrided/extended by passing the 'className' prop
 */

export const Grid: OverridableComponent<GridTypeMap> = ({
  className,
  ...rest
}: GridProps) => {
  const { root } = useStyles();
  return <MuiGrid className={clsx(root, className)} {...rest} />;
};
