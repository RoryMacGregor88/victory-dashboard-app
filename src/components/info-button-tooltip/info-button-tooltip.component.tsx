import { useState } from 'react';

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

/**
 * @param {{
 *   placement?: "left" | "bottom-end" | "bottom-start" | "bottom" | "left-end" | "left-start" | "right-end" | "right-start" | "right" | "top-end" | "top-start" | "top"
 *   tooltipContent: React.ReactNode
 *   iconButtonClassName?: string
 * }} props
 */
export const InfoButtonTooltip = ({
  tooltipContent,
  placement = 'left',
  iconButtonClassName,
}) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const styles = useStyles();

  /**
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e
   */
  const handleIconClick = (e) => {
    setIsInfoVisible((c) => !c);
  };

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
            <Typography className={styles.content}>{tooltipContent}</Typography>
          ) : (
            tooltipContent
          )
        }
      >
        <IconButton
          color='inherit'
          className={clsx(
            styles.infoButton,
            isInfoVisible ? styles.open : null,
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
