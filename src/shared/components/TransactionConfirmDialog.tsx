import {
  Divider,
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
  useTheme,
} from '@material-ui/core';

import {Skeleton} from '@material-ui/lab';

import {estimateFees} from '@mycrypto/gas-estimation';

import {GET_CHAIN_ID_NAME} from 'shared/constants/Blockchain';

import React, {useCallback, useState, useEffect, ChangeEvent} from 'react';
import CloseIcon from '@material-ui/icons/Close';
import {ReceiptTextIcon} from './Icons';
import {useNetwork} from 'hooks/useNetwork';
import {useNativeSingleBalance} from 'hooks/balance/useNativeSingleBalance';
import {
  GET_NATIVE_COIN_FROM_NETWORK_NAME,
  GET_NETWORK_NAME,
} from 'shared/constants/Bitquery';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {GetNativeCoinFromNetworkName, truncateAddress} from 'utils';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {ExpandLess} from '@material-ui/icons';
import {BigNumber, ethers} from 'ethers';
import {useWeb3} from 'hooks/useWeb3';
import {Web3State} from 'types/blockchain';
import {hasLondonHardForkSupport} from 'utils/blockchain';
import {useNativeCoinPriceUSD} from 'hooks/useNativeCoinPriceUSD';
import {useActiveChainBalance} from 'hooks/balance/useActiveChainBalance';

interface TransactionConfirmDialogProps extends DialogProps {
  data?: any;
  onCancel?: () => void;
  onConfirm?: (data: any) => void;
}

interface ValuesType {
  maxPriorityFeePerGas?: ethers.BigNumber | null;
  maxFeePerGas?: ethers.BigNumber | null;
  gasPrice?: ethers.BigNumber | null;
  gasLimit?: ethers.BigNumber | null;
}

export const TransactionConfirmDialog = (
  props: TransactionConfirmDialogProps,
) => {
  const {data, onCancel, onConfirm} = props;

  const [values, setValues] = useState<ValuesType>({});

  const theme = useTheme();

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  const {web3State, getProvider, chainId, account} = useWeb3();

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
      let params = {...data.params[0]};

      params.gas = values.gasLimit?.toHexString();

      if (chainId && hasLondonHardForkSupport(chainId)) {
        params.maxPriorityFeePerGas =
          values.maxPriorityFeePerGas?.toHexString();
        params.maxFeePerGas = values.maxFeePerGas?.toHexString();
      } else {
        params.gasPrice = values.gasPrice?.toHexString();
      }

      dataCopy.params[0] = params;

      onConfirm(dataCopy);
    }
  }, [onConfirm, data, isEIP1559Transaction, values, chainId]);

  const defaultAccount = useDefaultAccount();
  const network = useNetwork();

  const {
    data: balances,
    loading: balanceLoading,
    error,
  } = useNativeSingleBalance(
    GET_NATIVE_COIN_FROM_NETWORK_NAME(GET_NETWORK_NAME(chainId)).toUpperCase(),
    network,
    defaultAccount,
  );

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleToggleAdvanced = useCallback(() => {
    setShowAdvanced((value) => !value);
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<any>) => {
      if (
        e.target.name === 'maxPriorityFeePerGas' ||
        e.target.name === 'maxFeePerGas' ||
        e.target.name === 'gasPrice'
      ) {
        setValues({
          ...values,
          [e.target.name]: ethers.utils.parseUnits(e.target.value, 'gwei'),
        });
      } else {
        setValues({
          ...values,
          [e.target.name]: BigNumber.from(e.target.value),
        });
      }
    },
    [values],
  );

  const isEIP1559 = useCallback(() => {
    return values.maxFeePerGas && values.maxPriorityFeePerGas;
  }, [values]);

  const coinPrice = useNativeCoinPriceUSD(GET_NETWORK_NAME(chainId));

  useEffect(() => {
    const provider = getProvider();

    if (web3State === Web3State.Done && data && props.open) {
      if (provider) {
        if (data.params.length > 0) {
          (async () => {
            let params = data.params[0];

            let pr = new ethers.providers.Web3Provider(provider);
            let vals: ValuesType = {};

            if (params.gas) {
              vals.gasLimit = BigNumber.from(parseInt(params.gas, 16));
            } else {
              vals.gasLimit = await pr.estimateGas(params);
            }

            if (chainId && hasLondonHardForkSupport(chainId)) {
              let result = await estimateFees(provider);

              vals.maxFeePerGas = BigNumber.from(result.maxFeePerGas);

              vals.maxPriorityFeePerGas = BigNumber.from(
                result.maxPriorityFeePerGas,
              );
            } else {
              vals.gasPrice = await pr.getGasPrice();
            }

            setValues(vals);
          })();
        }
      }
    }
  }, [web3State, getProvider, data, chainId, props.open]);

  const gasCost = useCallback(
    (values: any) => {
      let cost = 0;

      if (isEIP1559()) {
        cost = parseFloat(
          ethers.utils.formatEther(
            values.gasLimit?.mul(
              values.maxFeePerGas || ethers.BigNumber.from(0),
            ) || BigNumber.from(0),
          ),
        );
      } else {
        cost = parseFloat(
          ethers.utils.formatEther(
            values.gasLimit?.mul(values.gasPrice || ethers.BigNumber.from(0)) ||
              BigNumber.from(0),
          ),
        );
      }

      return cost;
    },
    [isEIP1559],
  );

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
          mb={4}
          display='flex'
          alignItems='center'
          alignContent='center'
          justifyContent='space-between'>
          <Typography variant='body1'>Account</Typography>
          <Typography variant='body1' color='textSecondary'>
            {account ? truncateAddress(account) : null}
          </Typography>
        </Box>
        <Box
          mb={4}
          display='flex'
          alignItems='center'
          alignContent='center'
          justifyContent='space-between'>
          <Typography variant='body1'>Balance</Typography>
          <Typography variant='body1' color='textSecondary'>
            {balanceLoading || !balances ? (
              <Skeleton width={theme.spacing(12)} />
            ) : (
              balances?.toFixed(3)
            )}{' '}
            {GetNativeCoinFromNetworkName(network)}
          </Typography>
        </Box>
        <Box mb={4}>
          <Divider />
        </Box>
        <Box
          mb={4}
          display='flex'
          alignItems='center'
          alignContent='center'
          justifyContent='space-between'>
          <Typography variant='body1'>Gas cost</Typography>
          <Typography variant='body1' color='textSecondary'>
            {gasCost(values)} {GetNativeCoinFromNetworkName(network)}
          </Typography>
        </Box>
        <Box
          mb={4}
          display='flex'
          alignItems='center'
          alignContent='center'
          justifyContent='space-between'>
          <Typography variant='body1'>Total cost</Typography>
          <Typography variant='body1' color='textSecondary'>
            ${(coinPrice.data || 0) * gasCost(values)} USD
          </Typography>
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
                      size='small'
                      value={values.gasLimit?.toNumber() || 0}
                      onChange={handleChange}
                      name='gasLimit'
                      fullWidth
                      variant='outlined'
                      label='Gas Limit'
                    />
                  </Grid>
                  {isEIP1559() ? (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          size='small'
                          value={ethers.utils.formatUnits(
                            values.maxPriorityFeePerGas?.toString() || '0',
                            'gwei',
                          )}
                          onChange={handleChange}
                          name='maxPriorityFeePerGas'
                          fullWidth
                          variant='outlined'
                          label='Max Priority Fee'
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          size='small'
                          value={ethers.utils.formatUnits(
                            values.maxFeePerGas?.toString() || '0',
                            'gwei',
                          )}
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
                          value={ethers.utils.formatUnits(
                            values.gasPrice?.toString() || '0',
                            'gwei',
                          )}
                          onChange={handleChange}
                          name='gasPrice'
                          fullWidth
                          variant='outlined'
                          label='Gas Price'
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
          disabled={
            balances === 0 ||
            gasCost(values) === 0 ||
            gasCost(values) > (balances || 0)
          }
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
