import Box from '@material-ui/core/Box';
import Dialog, {DialogProps} from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import React, {useCallback} from 'react';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {Token} from 'types/app';
import {MyBalances} from 'types/blockchain';
import BuySell from '.';
import CloseIcon from '@material-ui/icons/Close';
import {BitcoinConvertWhiteIcon} from 'shared/components/Icons';

const useStyles = makeStyles((theme) => ({
  icon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));

interface Props extends DialogProps {
  networkName: EthereumNetwork;
  balances: MyBalances[];
  tokenAddress?: string;
  tokenInfo?: Token;
}

export const BuySellModal = (props: Props) => {
  const {onClose} = props;
  const theme = useTheme();
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }
  }, [onClose]);

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const classes = useStyles();

  return (
    <Dialog
      maxWidth='sm'
      fullWidth
      {...props}
      aria-labelledby='form-dialog-title'
      fullScreen={fullScreen}>
      <DialogTitle id='form-dialog-title'>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box>
            <Box display='flex' alignItems='center'>
              <Box
                mr={2}
                display='flex'
                alignItems='center'
                justifyContent='center'>
                <BitcoinConvertWhiteIcon className={classes.icon} />
              </Box>

              <Typography variant='body1'>Trade</Typography>
            </Box>
          </Box>
          <IconButton size='small' onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <BuySell {...props} />
      </DialogContent>
    </Dialog>
  );
};
