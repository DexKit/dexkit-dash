import {
  Grid,
  DialogProps,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  DialogTitle,
  Box,
  IconButton,
  Typography,
  TextField,
  Collapse,
} from '@material-ui/core';
import React, {useCallback, useState, useEffect, ChangeEvent} from 'react';
import CloseIcon from '@material-ui/icons/Close';
import {ReceiptTextIcon} from './Icons';
import {useNetwork} from 'hooks/useNetwork';
import {useNativeSingleBalance} from 'hooks/balance/useNativeSingleBalance';
import {GET_NATIVE_COIN_FROM_NETWORK_NAME} from 'shared/constants/Bitquery';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {GetNativeCoinFromNetworkName} from 'utils';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {ExpandLess} from '@material-ui/icons';
import {BigNumber, ethers} from 'ethers';
import {useWeb3} from 'hooks/useWeb3';
import {Web3State} from 'types/blockchain';

interface TransactionConfirmDialogProps extends DialogProps {
  data?: any;
  onCancel?: () => void;
  onConfirm?: (data: any) => void;
}

export const TransactionConfirmDialog = (
  props: TransactionConfirmDialogProps,
) => {
  const {data, onCancel, onConfirm} = props;

  const [values, setValues] = useState({gasPrice: 0, gasLimit: 0});

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  const {web3State, getProvider} = useWeb3();

  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      let dataCopy = {...data};

      if (!dataCopy.maxFeePerGas && !dataCopy.maxPriorityFeePerGas) {
        dataCopy.params[0].gasPrice = BigNumber.from(
          values.gasPrice,
        ).toHexString();

        dataCopy.params[0].gasLimit = BigNumber.from(
          values.gasLimit,
        ).toHexString();
      }

      onConfirm(dataCopy);
    }
  }, [web3State, getProvider, data, onConfirm, values]);

  const defaultAccount = useDefaultAccount();
  const network = useNetwork();

  const {data: balances} = useNativeSingleBalance(
    GET_NATIVE_COIN_FROM_NETWORK_NAME(network).toUpperCase(),
    network,
    defaultAccount,
  );

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleToggleAdvanced = useCallback(() => {
    setShowAdvanced((value) => !value);
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<any>) => {
      setValues({...values, [e.target.nae]: e.target.value});
    },
    [values],
  );

  useEffect(() => {
    const provider = getProvider();

    if (web3State == Web3State.Done && data) {
      if (provider) {
        let pr = new ethers.providers.Web3Provider(provider);
        pr.getGasPrice().then(async (gasPrice: BigNumber) => {
          console.log(data);
          if (data.params.length > 0) {
            if (data.params[0].gas) {
              let gasLimit = BigNumber.from(data.params[0].gas);

              setValues({
                gasLimit: gasLimit.toNumber(),
                gasPrice: gasPrice.toNumber(),
              });
            } else {
              setValues({
                gasLimit: 200000,
                gasPrice: gasPrice.toNumber(),
              });
            }
          }
        });
      }
    }
  }, [web3State, getProvider, data]);

  return (
    <Dialog {...props} fullWidth maxWidth='xs'>
      <DialogTitle>
        <Box
          display='flex'
          alignItems='center'
          alignContent='center'
          justifyContent='space-between'>
          <Box alignContent='center' alignItems='center' display='flex'>
            <Box mr={2}>
              <Typography variant='body1'>
                <ReceiptTextIcon />
              </Typography>
            </Box>
            <Typography variant='body1' style={{fontWeight: 500}}>
              Confirm transaction
            </Typography>
          </Box>
          <IconButton onClick={handleCancel} size='small'>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box
          mb={2}
          display='flex'
          alignItems='center'
          alignContent='center'
          justifyContent='space-between'>
          <Typography variant='body1'>Balance</Typography>
          <Typography variant='body1' color='textSecondary'>
            {balances?.toFixed(4)} {GetNativeCoinFromNetworkName(network)}
          </Typography>
        </Box>
        <Box
          mb={2}
          display='flex'
          alignItems='center'
          alignContent='center'
          justifyContent='space-between'>
          <Typography>Gas price</Typography>
          <Typography></Typography>
        </Box>
        <Box
          mb={4}
          display='flex'
          alignItems='center'
          alignContent='center'
          justifyContent='space-between'>
          <Typography>Gas Limit</Typography>
          <Typography></Typography>
        </Box>
        <Paper variant='outlined'>
          <Box p={4}>
            <Box
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='space-between'>
              <Typography>Advanced</Typography>
              <IconButton size='small' onClick={handleToggleAdvanced}>
                {showAdvanced ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            <Collapse in={showAdvanced}>
              <Box mt={4}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <TextField
                      value={values.gasPrice}
                      onChange={handleChange}
                      name='gasPrice'
                      fullWidth
                      variant='outlined'
                      label='Gas Price'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={values.gasLimit}
                      onChange={handleChange}
                      name='gasLimit'
                      fullWidth
                      variant='outlined'
                      label='Gas Limit'
                    />
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} color='primary' variant='contained'>
          Confirm
        </Button>
        <Button onClick={handleCancel} variant='contained'>
          Reject
        </Button>
      </DialogActions>
    </Dialog>
  );
};
