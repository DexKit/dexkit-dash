import React from 'react';
import { createStyles, makeStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import { CremaTheme } from 'types/AppContextPropsType';
import {Link, Tooltip } from '@material-ui/core';

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
    }
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
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
        marginLeft: '10px'
    }
  }));

export const AboutDialog = () => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles ();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title={'Info about this page'}>
        <Button variant="outlined" onClick={handleClickOpen} className={classes.openButton}>
            <InfoIcon/>
        </Button>
      </Tooltip>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Wallet 
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
          The wallet page is where you can look at your total balances for your connected wallets across the Ethereum and Binance Smart Chain networks. 

          </Typography>
          <Typography gutterBottom>
          You can also see any Defi assets that you are holding as well. 

          </Typography>
          <Typography gutterBottom>
          The “Asset Chart” shows you your holdings over a period of time, 
          </Typography>
          <Typography gutterBottom>
          “Transfers” shows you all transfers of tokens in and out of your wallet. 

          </Typography>
          <Typography gutterBottom>
            “Trade History” shows buys and sells of tokens from your wallet. All assets can be filtered by network.

          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
}