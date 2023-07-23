import { useState, ReactNode, MouseEvent } from 'react';

import {
  ClickAwayListener,
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';

import { InfoIcon } from '../../components';

import clsx from 'clsx';

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
  tooltipContent: ReactNode;
  iconButtonClassName?: string;
}

export const InfoButtonTooltip = ({
  tooltipContent,
  placement = 'left',
  iconButtonClassName,
}: Props) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const { content, open, infoButton } = useStyles();

  const handleIconClick = () => setIsInfoVisible((c) => !c);

  return (
    <ClickAwayListener onClickAway={() => setIsInfoVisible(false)}>
      <Tooltip
        arrow
        placement={placement}
        disableHoverListener
        disableFocusListener
        disableTouchListener
        open={isInfoVisible}
        title={
          typeof tooltipContent === 'string' ? (
            <Typography className={content}>{tooltipContent}</Typography>
          ) : (
            tooltipContent
          )
        }
      >
        <IconButton
          color='inherit'
          className={clsx(
            infoButton,
            isInfoVisible ? open : null,
            iconButtonClassName
          )}
          aria-label='Info'
          onClick={handleIconClick}
        >
          <InfoIcon titleAccess='Info' fontSize='inherit' />
        </IconButton>
      </Tooltip>
    </ClickAwayListener>
  );
};
