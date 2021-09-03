import React, {useCallback, useState, useEffect} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@material-ui/core';
import clsx from 'clsx';
import {useWeb3} from 'hooks/useWeb3';

import {isAddress} from '@ethersproject/address';

import CallReceivedIcon from '@material-ui/icons/CallReceived';
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import {useTransfer} from 'hooks/useTransfer';

import {useDispatch, useSelector} from 'react-redux';
import {useNetwork} from 'hooks/useNetwork';
import {useSenderTokens} from 'hooks/useSenderTokens';
import SelectTokenDialog from 'shared/components/Dialogs/SelectTokenDialog';
import {SelectTokenButton} from './SelectTokenButton';
import {Token} from 'types/app';
import {isNativeCoinFromNetworkName} from 'utils';
import {useAllBalance} from 'hooks/balance/useAllBalance';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {Web3Wrapper} from '@0x/web3-wrapper';
import SelectAddressDialog from 'shared/components/SelectAddressDialog';
import {AppState} from 'redux/store';

interface Props {
  balances: GetMyBalance_ethereum_address_balances[];
  amount?: number;
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
  const classes = useStyles();

  const networkName = useNetwork();

  const accounts = useSelector<AppState, AppState['ui']['wallet']>(
    (state) => state.ui.wallet,
  );

  const {chainId} = useWeb3();

  const account = useDefaultAccount();

  const {onTransfer} = useTransfer();
  const {data: balances} = useAllBalance(account);

  const [amount, setAmount] = useState<string>(String(props.amount || ''));
  const [address, setAddress] = useState<string>('');

  const handleCopy = async () => {
    const cpy: any = await navigator.clipboard.readText();
    setAddress(cpy);
  };

  const handleSend = () => {
    if (account) {
      try {
        if (token && chainId) {
          onTransfer(account, address, amount, {
            address: token?.address,
            decimals: token?.decimals,
            name: token?.name,
            symbol: token?.symbol,
            chainId: chainId,
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
  const {tokens} = useSenderTokens();

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

  const handleClearToken = useCallback(() => {
    setToken(undefined);
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
          token?.symbol &&
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
    if (tokens.length > 0) {
      setToken(tokens[0]);
    }
  }, [tokens]);

  return (
    <>
      <SelectTokenDialog
        title='You send'
        open={showSelectTokenDialog}
        tokens={tokens}
        onSelectToken={handleSelectToken}
        onClose={handleSelectTokenDialogClose}
        showNetwork
      />
      <SelectAddressDialog
        open={showSelectAddress}
        accounts={accounts.evm}
        onSelectAccount={handleSelectAccount}
        onClose={handleCloseSelectAddress}
      />
      <Box>
        <form noValidate autoComplete='off'>
          <Box mb={5}>
            <SelectTokenButton
              onClick={handleShowDialog}
              token={token}
              onClear={handleClearToken}
            />
          </Box>

          <Box mb={5}>
            <Box
              mb={2}
              color='grey.400'
              textAlign='right'
              className={classes.textRes}>
              {tokenBalance} {token?.symbol?.toUpperCase()}
            </Box>
            <FormControl className={clsx(classes.inputText)} variant='outlined'>
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
          </Box>

          <Box mb={5}>
            <FormControl className={clsx(classes.inputText)} variant='outlined'>
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
                      <FileCopyIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
              {!isAddress(address ?? '') && address.length > 0 ? (
                <FormHelperText error>Invalid address</FormHelperText>
              ) : null}
            </FormControl>
          </Box>

          <Box textAlign='center' mb={5}>
            <Button
              fullWidth
              size='large'
              variant='contained'
              color='primary'
              onClick={handleSend}
              disabled={
                !isAddress(address) || parseFloat(amount) == 0 || amount == ''
              }>
              Send
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default SenderForm;
