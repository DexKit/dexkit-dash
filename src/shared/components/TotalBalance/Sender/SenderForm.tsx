import React, { useCallback, useState, useEffect } from 'react';

import { CircularProgress, useTheme, Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Fonts } from 'shared/constants/AppEnums';
import { CremaTheme } from 'types/AppContextPropsType';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@material-ui/core';
import clsx from 'clsx';
import { useWeb3 } from 'hooks/useWeb3';

import { isAddress } from '@ethersproject/address';

import CallReceivedIcon from '@material-ui/icons/CallReceived';
import { GetMyBalance_ethereum_address_balances } from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import { useTransfer } from 'hooks/useTransfer';

import { useDispatch, useSelector } from 'react-redux';
import { useSenderTokens } from 'hooks/useSenderTokens';
import SelectTokenDialog from 'shared/components/Dialogs/SelectTokenDialog';
import { SelectTokenButton } from './SelectTokenButton';
import { Token } from 'types/app';
import { isNativeCoinFromNetworkName } from 'utils';
import { useAllBalance } from 'hooks/balance/useAllBalance';
import { useDefaultAccount } from 'hooks/useDefaultAccount';
import SelectAddressDialog from 'shared/components/SelectAddressDialog';
import { AppState } from 'redux/store';
import { Alert } from '@material-ui/lab';
import { setDefaultAccount } from 'redux/_ui/actions';
import { SupportedNetworkType } from 'types/blockchain';
import { switchAddress, switchChain } from 'utils/wallet';
import { AccountSelect } from 'shared/components/AccountSelect';
import { useDefaultLabelAccount } from 'hooks/useDefaultLabelAccount';
import { useChainInfo } from 'hooks/useChainInfo';

interface Props {
  balances: GetMyBalance_ethereum_address_balances[];
  amount?: number;
  token?: Token;
  address?: string;
  onResult?: (err?: any) => void;
  error?: string;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
  root: {
    color: theme.palette.secondary.main,
    fontSize: 18,
    marginTop: 6,
    [theme.breakpoints.up('xl')]: {
      fontSize: 20,
      marginTop: 16,
    },
  },
  textRes: {
    fontSize: 16,
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
    },
  },
  inputText: {
    fontFamily: Fonts.MEDIUM,
    width: '100%',
  },
}));

const SenderForm: React.FC<Props> = (props) => {
  const { token: defaultToken, onResult, error } = props;
  const classes = useStyles();
  const theme = useTheme();

  const dispatch = useDispatch();

  const { network: networkName, tokenSymbol } = useChainInfo();

  const accounts = useSelector<AppState, AppState['ui']['wallet']>(
    (state) => state.ui.wallet,
  );

  const { chainId, account: userAccount, getProvider } = useWeb3();

  const account = useDefaultAccount();
  const accountLabel = useDefaultLabelAccount();

  const { onTransfer } = useTransfer();
  const { data: balances } = useAllBalance(account);

  const [amount, setAmount] = useState<string>(String(props.amount || ''));
  const [address, setAddress] = useState<string>('');

  const handleConnect = useCallback(() => {
    switchAddress(getProvider()).then(() => {
      if (userAccount) {
        dispatch(
          setDefaultAccount({
            account: {
              address: userAccount,
              label: userAccount,
              networkType: SupportedNetworkType.evm,
            },
            type: SupportedNetworkType.evm,
          }),
        );
      }
    });
  }, [userAccount, dispatch, getProvider]);

  const [sending, setSending] = useState(false);

  const handleSend = () => {
    if (account) {
      try {
        if (token && chainId) {
          setSending(true);
          onTransfer(account, address, amount, {
            address: token?.address,
            decimals: token?.decimals,
            name: token?.name,
            symbol: token?.symbol,
            chainId: chainId,
          })
            .then((result) => {
              if (onResult) {
                onResult();
              }
            })
            .catch((err) => {

              if (onResult) {
                onResult(err);
              }
            })
            .finally(() => {
              setSending(false);
            });
        }

        // if(isNativeCoin(selected.currency.symbol, chainId as ChainId)){
        //     onActionWeb3Transaction({
        //       to: address,
        //       from: account,
        //       value: Web3.utils.toWei(amount),
        //     })
        // } else if (selected.currency.address && selected.currency.name && chainId != null) {
        //   onTransferToken(account, address, fromTokenUnitAmount(amount, selected.currency.decimals), {
        //     address: selected.currency.address,
        //     decimals: selected.currency.decimals,
        //     name: selected.currency.name,
        //     symbol: selected.currency.symbol,
        //     chainId: chainId
        //   }).then((c: any) => {
        //     const notification = new Notification('Success', { body: 'Sent with success' });
        //     dispatch(onAddNotification(notification));
        //   })
        //   .catch(() => {
        //     const notification = new Notification('Error', { body: 'Error sending' });
        //     dispatch(onAddNotification(notification, NotificationType.ERROR));
        //   })
        // }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const [showSelectTokenDialog, setShowSelectTokenDialog] = useState(false);
  const [token, setToken] = useState<Token>();
  const { tokens } = useSenderTokens();

  const handleShowDialog = useCallback(() => {
    setShowSelectTokenDialog(true);
  }, []);

  const handleSelectTokenDialogClose = useCallback(() => {
    setShowSelectTokenDialog(false);
  }, []);

  const handleSelectToken = useCallback((token: Token) => {
    setToken(token);
    setShowSelectTokenDialog(false);
  }, []);

  const [tokenBalance, setTokenBalance] = useState(0);

  const amountError = useCallback((): undefined | string => {
    if (parseFloat(amount) > tokenBalance) {
      return 'Insufficient balance';
    }

    return undefined;
  }, [amount, tokenBalance]);

  const handleMax = useCallback(() => {
    setAmount(String(tokenBalance));
  }, [tokenBalance]);

  useEffect(() => {
    if (balances) {
      let value = balances.find((e) => {
        if (
          token?.symbol && networkName &&
          isNativeCoinFromNetworkName(token?.symbol, networkName)
        ) {
          return (
            e.currency?.symbol?.toLowerCase() === token?.symbol.toLowerCase()
          );
        } else {
          return (
            e.currency?.address?.toLowerCase() === token?.address.toLowerCase()
          );
        }
      })?.value;

      if (value) {
        setTokenBalance(value);
      }
    }
  }, [balances, token, networkName]);

  const [showSelectAddress, setShowSelectAddress] = useState(false);

  const handleSwitchChain = useCallback(() => {
    if (token && token?.chainId) {
      switchChain(getProvider(), token?.chainId);
    }
  }, [getProvider, token]);

  const handleCloseSelectAddress = useCallback(() => {
    setShowSelectAddress(false);
  }, []);

  const handleSelectAccount = useCallback((address: string) => {
    setAddress(address);
    setShowSelectAddress(false);
  }, []);

  const handleOpenSelectAddress = useCallback(() => {
    setShowSelectAddress(true);
  }, []);

  useEffect(() => {
    if (defaultToken !== undefined) {
      setToken(defaultToken);
    } else if (tokens.length > 0) {
      // Check if native exists to put as default
      const token = tokens.find(t => t.networkName === networkName && t.symbol.toLowerCase() === tokenSymbol?.toLowerCase());
      if (token) {
        setToken(token);
      } else {
        // If no native, just find one from the selected network
        const tk = tokens.find(t => t.networkName === networkName);
        if (tk) {
          setToken(tk);
        } else {
          setToken(tokens[0]);
        }
      }

    }
  }, [tokens, defaultToken, networkName, tokenSymbol]);

  // default address is not connected
  const notConnected = userAccount !== account;
  const invalidChain =
    token?.chainId !== chainId && token?.networkName !== networkName;

  const [showSenderSelectAddress, setShowSenderSelectAddress] = useState(false);
  const handleSelectSenderAddress = useCallback(
    (address: string, label?: string) => {
      dispatch(
        setDefaultAccount({
          account: {
            address: address,
            label: label || '',
            networkType: SupportedNetworkType.evm,
          },
          type: SupportedNetworkType.evm,
        }),
      );

      setShowSenderSelectAddress(false);
    },
    [dispatch],
  );

  const handleShowSenderSelectAddress = useCallback(() => {
    setShowSenderSelectAddress(true);
  }, []);

  const handeCloseSenderAddress = useCallback(() => {
    setShowSenderSelectAddress(false);
  }, []);

  useEffect(() => { }, []);

  return (
    <>
      <SelectTokenDialog
        title='You send'
        open={showSelectTokenDialog}
        tokens={tokens}
        onSelectToken={handleSelectToken}
        onClose={handleSelectTokenDialogClose}
        showNetwork
        chainId={chainId}
      />
      <SelectAddressDialog
        key={'to-address'}
        open={showSelectAddress}
        accounts={accounts.evm}
        onSelectAccount={handleSelectAccount}
        onClose={handleCloseSelectAddress}
      />
      <SelectAddressDialog
        key={'sender-address'}
        open={showSenderSelectAddress}
        accounts={accounts.evm}
        onSelectAccount={handleSelectSenderAddress}
        onClose={handeCloseSenderAddress}
      />
      <Box>
        <form noValidate autoComplete='off'>
          <Grid container spacing={4}>
            {account ? (
              <Grid item xs={12}>
                <AccountSelect
                  onClick={handleShowSenderSelectAddress}
                  account={{ label: accountLabel, address: account || '' }}
                />
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <SelectTokenButton onClick={handleShowDialog} token={token} />
            </Grid>
            <Grid item xs={12}>
              <Box
                mb={2}
                color='grey.400'
                textAlign='right'
                className={classes.textRes}>
                {tokenBalance} {token?.symbol?.toUpperCase()}
              </Box>
              <FormControl
                className={clsx(classes.inputText)}
                variant='outlined'>
                <InputLabel htmlFor='outlined-adornment-amount'>
                  Amount
                </InputLabel>
                <OutlinedInput
                  id='outlined-adornment-amount'
                  fullWidth
                  type='text'
                  label='Amount'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  error={amountError() !== undefined}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton onClick={handleMax} edge='end'>
                        <CallReceivedIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {amountError() !== undefined ? (
                  <FormHelperText error>{amountError()}</FormHelperText>
                ) : null}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                className={clsx(classes.inputText)}
                variant='outlined'>
                <InputLabel htmlFor='outlined-adornment-to'>To</InputLabel>
                <OutlinedInput
                  id='outlined-adornment-to'
                  fullWidth
                  type={'text'}
                  label='To'
                  value={address}
                  error={address.length > 0 && !isAddress(address ?? '')}
                  onChange={(e) => setAddress(e.target.value)}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton onClick={handleOpenSelectAddress} edge='end'>
                        <AccountBoxIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {!isAddress(address ?? '') && address.length > 0 ? (
                  <FormHelperText error>Invalid address</FormHelperText>
                ) : null}
              </FormControl>
            </Grid>
            {notConnected ? (
              <Grid item xs={12}>
                <Alert
                  severity='warning'
                  action={<Button onClick={handleConnect}>Connect</Button>}>
                  Please, switch to your connected account to make transactions.
                </Alert>
              </Grid>
            ) : null}
            {invalidChain ? (
              <Grid item xs={12}>
                <Alert
                  severity='warning'
                  action={<Button onClick={handleSwitchChain}>Switch</Button>}>
                  Please, switch to the to te correct blockhain to make
                  transactions.
                </Alert>
              </Grid>
            ) : null}
            {error ? (
              <Grid item xs={12}>
                <Alert severity='error'>{error}</Alert>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <Button
                fullWidth
                size='large'
                variant='contained'
                color='primary'
                onClick={handleSend}
                startIcon={
                  sending ? (
                    <CircularProgress size={theme.spacing(6)} color='inherit' />
                  ) : undefined
                }
                disabled={
                  !isAddress(address) ||
                  parseFloat(amount) === 0 ||
                  amount === '' ||
                  notConnected ||
                  sending ||
                  amountError() !== undefined
                }>
                Send
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
};

export default SenderForm;
