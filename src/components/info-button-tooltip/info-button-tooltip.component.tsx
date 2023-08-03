import { useState } from 'react';

import {
  ClickAwayListener,
  IconButton,
  Tooltip,
  Typography,
  makeStyles,
} from '@material-ui/core';
import clsx from 'clsx';

import { InfoIcon } from '../../components';

const useStyles = makeStyles((theme) => ({
  infoButton: {
    fontSize: theme.typography.pxToRem(8),
    padding: theme.typography.pxToRem(2),
    height: 'min-content',
    width: 'min-content',
    backgroundColor: theme.palette.text.primary,
    color: theme.palette.background.default,
    '&:focus': {
      backgroundColor: theme.palette.text.primary,
    },
    '&:hover, &:active, &$open': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  open: {},
  content: {
    fontWeight: 600,
    color: theme.palette.common.black,
  },
}));

const TooltipTitle = ({ title }: { title: string }) => {
  const { content } = useStyles();
  return <Typography className={content}>{title}</Typography>;
};

interface Props {
  placement?:
    | 'left'
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
  tooltipContent: string;
  iconButtonClassName?: string;
}

export const InfoButtonTooltip = ({
  tooltipContent,
  placement = 'left',
  iconButtonClassName,
}: Props) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const { open, infoButton } = useStyles();

  const handleIconClick = () => setIsInfoVisible((c) => !c);

  return (
    <ClickAwayListener onClickAway={() => setIsInfoVisible(false)}>
      <Tooltip
        arrow
        disableFocusListener
        disableHoverListener
        disableTouchListener
        open={isInfoVisible}
        placement={placement}
        title={<TooltipTitle title={tooltipContent} />}
      >
        <IconButton
          aria-label="Info"
          className={clsx(
            infoButton,
            isInfoVisible ? open : null,
            iconButtonClassName,
          )}
          color="inherit"
          onClick={handleIconClick}
        >
          <InfoIcon fontSize="inherit" titleAccess="Info" />
        </IconButton>
      </Tooltip>
    </ClickAwayListener>
  );
};
