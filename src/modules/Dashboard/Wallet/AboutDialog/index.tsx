import React from 'react';

import {useIntl} from 'react-intl';

import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import {CremaTheme} from 'types/AppContextPropsType';
import {Tooltip} from '@material-ui/core';
import IntlMessages from '../../../../@crema/utility/IntlMessages';

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
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label='close'
          className={classes.closeButton}
          onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const useStyles = makeStyles((theme: CremaTheme) => ({
  openButton: {
    marginLeft: '10px',
  },
}));

export const AboutDialog = () => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const {messages} = useIntl();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title={messages['app.dashboard.infoPage'] as string}>
        <Button
          variant='outlined'
          onClick={handleClickOpen}
          className={classes.openButton}>
          <InfoIcon />
        </Button>
      </Tooltip>
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}>
        <DialogTitle id='customized-dialog-title' onClose={handleClose}>
          <IntlMessages id='app.dashboard.wallet' />
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <IntlMessages id='app.dashboard.wallet.walletPageInfo' />
          </Typography>
          <Typography gutterBottom>
            <IntlMessages id='app.dashboard.wallet.youCanAlsoSeeDefi' />
          </Typography>
          <Typography gutterBottom>
            <IntlMessages id='app.dashboard.wallet.assetChartInfo' />
          </Typography>
          <Typography gutterBottom>
            <IntlMessages id='app.dashboard.wallet.transfersInfo' />
          </Typography>
          <Typography gutterBottom>
            <IntlMessages id='app.dashboard.wallet.tradeHistoryInfo' />
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};
