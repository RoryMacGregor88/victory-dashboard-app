import { makeStyles } from '@material-ui/core';

import { ParentSize, ParentSizeState } from '@visx/responsive';
import { ReactNode } from 'react';

const useStyles = makeStyles(() => ({
  parentSize: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 'inherit !important',
  },
}));

interface Props {
  children: (
    args: {
      ref: HTMLDivElement | null;
      resize: (state: ParentSizeState) => void;
    } & ParentSizeState
  ) => React.ReactNode;
}

export const StyledParentSize = ({ children }: Props) => {
  const { parentSize } = useStyles({});
  return <ParentSize className={parentSize}>{children}</ParentSize>;
};
