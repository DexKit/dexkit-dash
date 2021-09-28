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
import {hasLondonHardForkSupport} from 'utils/blockchain';

interface TransactionConfirmDialogProps extends DialogProps {
  data?: any;
  onCancel?: () => void;
  onConfirm?: (data: any) => void;
}

export const TransactionConfirmDialog = (
  props: TransactionConfirmDialogProps,
) => {
  const {data, onCancel, onConfirm} = props;

  const [values, setValues] = useState({
    gasPrice: 0,
    gasLimit: 0,
    maxFeePerGas: 0,
    maxPriorityFeePerGas: 0,
  });

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  const {web3State, getProvider, chainId} = useWeb3();

  const isEIP1559Transaction = useCallback(() => {
    if (data) {
      let params = data.params;

      if (params.length > 0) {
        let firstParams = params[0];

        return firstParams.maxFeePerGas;
      }
    }

    return false;
  }, [data]);

  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      let dataCopy = {...data};

      if (dataCopy.params.length > 0) {
        if (
          isEIP1559Transaction() ||
          (chainId && hasLondonHardForkSupport(chainId))
        ) {
          delete dataCopy.params[0]['gasPrice'];
          delete dataCopy.params[0]['gasLimit'];

          dataCopy.params[0].maxFeePerGas = BigNumber.from(
            values.maxFeePerGas,
          ).toHexString();

          dataCopy.params[0].maxPriorityFeePerGas = BigNumber.from(
            values.maxPriorityFeePerGas,
          ).toHexString();
        }
      }

      onConfirm(dataCopy);
    }
  }, [onConfirm, data, isEIP1559Transaction, values, chainId]);

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
      setValues({...values, [e.target.name]: e.target.value});
    },
    [values],
  );

  useEffect(() => {
    const provider = getProvider();

    if (web3State === Web3State.Done && data) {
      if (provider) {
        if (data.params.length > 0) {
        }
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

        {isEIP1559Transaction() ? (
          <>
            <Box
              mb={2}
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='space-between'>
              <Typography>Max Priority Fee</Typography>
              <Typography>
                {ethers.utils.formatEther(BigNumber.from(values.gasPrice))}
              </Typography>
            </Box>
            <Box
              mb={4}
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='space-between'>
              <Typography>Max Fee</Typography>
              <Typography>
                {ethers.utils.formatEther(BigNumber.from(values.maxFeePerGas))}
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Box
              mb={2}
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='space-between'>
              <Typography>Gas price</Typography>
              <Typography>
                {ethers.utils.formatEther(BigNumber.from(values.gasPrice))}
              </Typography>
            </Box>
            <Box
              mb={4}
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='space-between'>
              <Typography>Gas Limit</Typography>
              <Typography>
                {ethers.utils.formatEther(BigNumber.from(values.gasLimit))}
              </Typography>
            </Box>
          </>
        )}
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
                  {isEIP1559Transaction() ? (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          size='small'
                          value={values.maxPriorityFeePerGas}
                          onChange={handleChange}
                          name='maxPriorityFeePerGas'
                          fullWidth
                          variant='outlined'
                          label='Priority Fee'
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          size='small'
                          value={values.maxFeePerGas}
                          onChange={handleChange}
                          name='maxFeePerGas'
                          fullWidth
                          variant='outlined'
                          label='Max fee'
                        />
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          size='small'
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
                          size='small'
                          value={values.gasLimit}
                          onChange={handleChange}
                          name='gasLimit'
                          fullWidth
                          variant='outlined'
                          label='Gas Limit'
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            </Collapse>
          </Box>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={balances === 0}
          onClick={handleConfirm}
          color='primary'
          variant='contained'>
          Confirm
        </Button>
        <Button onClick={handleCancel} variant='contained'>
          Reject
        </Button>
      </DialogActions>
    </Dialog>
  );
};
