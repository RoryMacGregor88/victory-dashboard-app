import {
  DialogTitleProps,
  DialogTitle as MuiDialogTitle,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { CloseIcon, IconButton } from '~/components';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'grid',
    placeItems: 'center',
    gridAutoFlow: 'row',
    padding: theme.spacing(5, 3),
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    '& .content': {
      fontSize: theme.typography.pxToRem(24),
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(3),
    top: '50%',
    transform: 'translateY(-50%)',
  },
}));

interface Props {
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
}

export const DialogTitle = ({
  disableTypography,
  children,
  onClose,
}: DialogTitleProps & Props) => {
  const styles = useStyles();
  return (
    <MuiDialogTitle disableTypography className={styles.root}>
      {disableTypography ? (
        children
      ) : (
        <Typography className="content" variant="h1">
          {children}
        </Typography>
      )}
      {!!onClose ? (
        <IconButton
          aria-label="Close Dialog"
          className={styles.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};
