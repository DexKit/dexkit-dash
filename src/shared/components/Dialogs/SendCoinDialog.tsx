import React, {useCallback, useState, useEffect} from 'react';

import {
  Box,
  Dialog,
  DialogContent,
  makeStyles,
  IconButton,
  DialogTitle,
  Button,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
  useTheme,
} from '@material-ui/core';

import SelectCoinv2 from '../SelectCoinv2';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import {Skeleton} from '@material-ui/lab';
import PasteIconButton from '../PasteIconButton';
import {Token} from 'types/app';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import CustomDialogTitle from '../CustomDialogTitle';

const useStyles = makeStyles((theme) => ({
  imageIcon: {
    width: theme.spacing(24),
    height: theme.spacing(24),
  },
}));

interface SendCoinDialogProps {
  open: boolean;
  onClose: () => void;
  balance?: number;
  toAmount?: number;
  toAddress?: string;
  toToken?: Token;
  onSend: (amount: number, address: string) => void;
  success: boolean;
  error: boolean;
  loading: boolean;
}

export const SendCoinDialog = (props: SendCoinDialogProps) => {
  const {
    toAddress,
    toAmount,
    toToken,
    balance,
    success,
    error,
    loading,
    onSend,
    onClose,
  } = props;

  const theme = useTheme();

  const classes = useStyles();

  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  const [selectedToken, setSelectedToken] = useState<Token>();

  const handleSelectToken = useCallback(() => {}, []);

  const handleSend = useCallback(() => {
    onSend(parseFloat(amount), address);
  }, [onSend, amount, address]);

  const handleChangeAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(e.target.value);
    },
    [],
  );

  const handleChangeAddress = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAddress(e.target.value);
    },
    [],
  );

  const handlePaste = useCallback((text: string) => {
    setAddress(text);
  }, []);

  const handleMax = useCallback(() => {
    if (balance) {
      setAmount(balance.toString());
    }
  }, [balance]);

  useEffect(() => {
    if (toAmount) {
      setAmount(toAmount.toString());
    }

    if (toAddress) {
      setAddress(toAddress);
    }

    if (toToken) {
      setSelectedToken(toToken);
    }
  }, [toToken, toAddress, toAmount]);

  const defaultUserAccount = useDefaultAccount();

  return (
    <>
      <Dialog {...props} onClose={onClose} fullWidth maxWidth='xs'>
      <CustomDialogTitle title={"Send"} onClose={onClose}/>
        
        <DialogContent dividers>
          {loading ? (
            <Box py={8}>
              <Grid
                container
                alignItems='center'
                alignContent='center'
                justify='center'
                spacing={4}
                direction='column'>
                <Grid item>
                  <CircularProgress size={theme.spacing(24)} />
                </Grid>
                <Grid item>
                  <Typography align='center' variant='h5'>
                    Sending coins to the address
                  </Typography>
                  <Typography
                    align='center'
                    variant='body1'
                    color='textSecondary'>
                    Please, sign the transaction and wait for confirmation
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ) : null}

          {success ? (
            <Box py={8}>
              <Grid
                container
                alignItems='center'
                alignContent='center'
                justify='center'
                spacing={2}
                direction='column'>
                <Grid item>
                  <img
                    alt=''
                    src='/images/ui/success-icon.svg'
                    className={classes.imageIcon}
                  />
                </Grid>
                <Grid item>
                  <Typography align='center' variant='h5'>
                    Sent with success
                  </Typography>
                  <Typography
                    align='center'
                    variant='body1'
                    color='textSecondary'>
                    Amount sent successfully
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ) : null}

          {error ? (
            <Box py={8}>
              <Grid
                container
                alignItems='center'
                alignContent='center'
                justify='center'
                spacing={2}
                direction='column'>
                <Grid item>
                  <img
                    alt=''
                    src='/images/ui/error-icon.svg'
                    className={classes.imageIcon}
                  />
                </Grid>
                <Grid item>
                  <Typography align='center' variant='h5'>
                    Ops, something has gone wrong
                  </Typography>
                  <Typography align='center' variant='body1'>
                    Something has gone wrong, try again later
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ) : null}

          {!success && !error && !loading ? (
            <Box py={4}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <TextField
                        label='From'
                        fullWidth
                        variant='outlined'
                        disabled
                        value={defaultUserAccount}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <SelectCoinv2
                        token={selectedToken}
                        onClick={handleSelectToken}
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <TextField
                        fullWidth
                        variant='outlined'
                        value={amount}
                        onChange={handleChangeAmount}
                        type='number'
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <Button
                                size='small'
                                color='primary'
                                onClick={handleMax}>
                                Max
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography align='right' variant='body1'>
                        {!balance ? <Skeleton /> : balance.toFixed(4)} ETH
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant='outlined'
                    value={address}
                    onChange={handleChangeAddress}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <PasteIconButton onPaste={handlePaste} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    size='large'
                    color='primary'
                    fullWidth
                    disabled={false}
                    onClick={handleSend}
                    variant='contained'
                    startIcon={<SendIcon />}>
                    Send
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SendCoinDialog;
