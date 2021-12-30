import React, {useCallback} from 'react';
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
import CustomDialogTitle from 'shared/components/CustomDialogTitle';
import {useIntl} from 'react-intl';

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
  const {messages} = useIntl();
  return (
    <Dialog onClose={handleClose} open={open}>
      <CustomDialogTitle
        title={messages['app.dashboard.tradingPage']}
        onClose={handleClose}
      />

      <DialogContent dividers>
        <Typography variant='body1' gutterBottom>
          Welcome to the Trading Page! This is where you can place market and
          limit orders for your favorite tokens across all supported Defi
          Protocols.
        </Typography>
        <Typography variant='body1' gutterBottom>
          Here you can copy the contract address for your selected token, share
          the URL on social media, and click the heart to add it to your
          favorites
        </Typography>
        <Typography variant='body1' gutterBottom>
          Here you can see your token balance, buy with fiat, send and receive
          tokens.
        </Typography>
        <Typography variant='body1' gutterBottom>
          The Trading Section is where you can swap tokens and place limit
          orders. It also has a full-featured tradingview chart for
          decentralized protocols as well as a Binance chart.
        </Typography>
        <Typography variant='body1' gutterBottom>
          On this tab you can swap tokens in the market section. Simply select
          your token pair and enter how many tokens you wish to buy or sell.
          Click trade, select the gas for your transaction, and click confirm!
        </Typography>
        <Typography variant='body1' gutterBottom>
          On the limit tab you can place limit orders without paying a gas fee
          to the Ethereum network. This only works by using Wrapped Ethereum
          (WETH) for the order. When your order price is reached, a wallet to
          wallet swap is performed with the taker paying the gas fee. If you
          don’t have WETH don’t sweat it! DEXKIT will convert your ETH for you.
          Once you have your WETH, simply enter the information for the trade,
          choose an expiry date, and click trade.
        </Typography>
        <Typography variant='body1' gutterBottom>
          Once you have confirmed your limit order, it will show up in the “My
          Orders” tab. Here you will see all of your active limit orders that
          you have placed.
        </Typography>
        <Typography variant='body1' gutterBottom>
          In "Trade History" tab you can see all of your buys and sells for a
          token and your calculated profit/loss. There are also links to the
          block explorer for the transaction.
        </Typography>
        <Typography variant='body1' gutterBottom>
          In this tab you can see the analytics for your selected token
          including the market cap, trading volume, 24 hour high and low, as
          well as links to social platforms and web pages.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
