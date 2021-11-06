import React, {useCallback} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';

import {Box, IconButton, Typography} from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const {children, classes, onClose, ...other} = props;
  return (
    <MuiDialogTitle disableTypography {...other}>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Typography variant='h6'>{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label='close'
            className={classes.closeButton}
            onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </Box>
    </MuiDialogTitle>
  );
});

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AboutDialog = (props: AboutDialogProps) => {
  const {open, onClose} = props;

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle id='about-dialog' onClose={handleClose}>
        <IntlMessages id='app.dashboard.token.tradingPage' />
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant='body1' gutterBottom>
          <IntlMessages id='app.dashboard.token.welcomeToTradingPage' />
        </Typography>
        <Typography variant='body1' gutterBottom>
          <IntlMessages id='app.dashboard.token.hereYouCanCopyContractAddress' />
        </Typography>
        <Typography variant='body1' gutterBottom>
          <IntlMessages id='app.dashboard.token.hereYouCanSeeTokenBalance' />
        </Typography>
        <Typography variant='body1' gutterBottom>
          <IntlMessages id='app.dashboard.token.tradingSectionInfo' />
        </Typography>
        <Typography variant='body1' gutterBottom>
          <IntlMessages id='app.dashboard.token.onThisTabYouCanSwap' />
        </Typography>
        <Typography variant='body1' gutterBottom>
          <IntlMessages id='app.dashboard.token.onTheLimitTabYouCanPlaceLimitOrders' />
        </Typography>
        <Typography variant='body1' gutterBottom>
          <IntlMessages id='app.dashboard.token.onceYouHaveConfirmedYourLimitedOrder' />
        </Typography>
        <Typography variant='body1' gutterBottom>
          <IntlMessages id='app.dashboard.token.tradeHistoryTabInfo' />
        </Typography>
        <Typography variant='body1' gutterBottom>
          <IntlMessages id='app.dashboard.token.inThisTabYouCanSeeAnalytics' />
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
