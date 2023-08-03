import { ReactNode } from 'react';

import { makeStyles } from '@material-ui/core';
import { ParentSize } from '@visx/responsive';
import { ParentSizeProvidedProps } from '@visx/responsive/lib/components/ParentSize';

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
      resize: (state: ParentSizeProvidedProps) => void;
    } & ParentSizeProvidedProps,
  ) => ReactNode;
}

export const StyledParentSize = ({ children }: Props) => {
  const { parentSize } = useStyles({});
  return <ParentSize className={parentSize}>{children}</ParentSize>;
};
