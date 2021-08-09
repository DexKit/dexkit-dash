import React from 'react';
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
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import {CremaTheme} from 'types/AppContextPropsType';
import {Link, Tooltip} from '@material-ui/core';

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

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant='outlined'
        onClick={handleClickOpen}
        className={classes.openButton}>
        <Tooltip title={'Info about this page'}>
          <InfoIcon />
        </Tooltip>
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}>
        <DialogTitle id='customized-dialog-title' onClose={handleClose}>
          Trading Page
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Welcome to the Trading Page! This is where you can place market and
            limit orders for your favorite tokens across all supported Defi
            Protocols.
          </Typography>
          <Typography gutterBottom>
            Here you can copy the contract address for your selected token,
            share the URL on social media, and click the heart to add it to your
            favorites
          </Typography>
          <Typography gutterBottom>
            Here you can see your token balance, buy with fiat, send and receive
            tokens.
          </Typography>
          <Typography gutterBottom>
            The Trading Section is where you can swap tokens and place limit
            orders. It also has a full-featured tradingview chart for
            decentralized protocols as well as a Binance chart.
          </Typography>
          <Typography gutterBottom>
            On this tab you can swap tokens in the market section. Simply select
            your token pair and enter how many tokens you wish to buy or sell.
            Click trade, select the gas for your transaction, and click confirm!
          </Typography>
          <Typography gutterBottom>
            On the limit tab you can place limit orders without paying a gas fee
            to the Ethereum network. This only works by using Wrapped Ethereum
            (WETH) for the order. When your order price is reached, a wallet to
            wallet swap is performed with the taker paying the gas fee. If you
            don’t have WETH don’t sweat it! DEXKIT will convert your ETH for
            you. Once you have your WETH, simply enter the information for the
            trade, choose an expiry date, and click trade.
          </Typography>
          <Typography gutterBottom>
            Once you have confirmed your limit order, it will show up in the “My
            Orders” tab. Here you will see all of your active limit orders that
            you have placed.
          </Typography>
          <Typography gutterBottom>
            In "Trade History" tab you can see all of your buys and sells for a
            token and your calculated profit/loss. There are also links to the
            block explorer for the transaction.
          </Typography>
          <Typography gutterBottom>
            In this tab you can see the analytics for your selected token
            including the market cap, trading volume, 24 hour high and low, as
            well as links to social platforms and web pages.
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};
