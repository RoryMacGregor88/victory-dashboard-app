import { makeStyles } from '@material-ui/core';

import { ParentSize } from '@visx/responsive';

const useStyles = makeStyles((theme) => ({
  parentSize: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 'inherit !important',
  },
}));

export const StyledParentSize = ({ children }) => {
  const styles = useStyles({});
  return <ParentSize className={styles.parentSize}>{children}</ParentSize>;
};
