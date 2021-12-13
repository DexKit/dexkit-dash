import IntlMessages from '@crema/utility/IntlMessages';
import {isAddress} from '@ethersproject/address';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  IconButton,
  Tooltip,
  Divider,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {useAddCustomToken, useCustomTokenList} from 'hooks/tokens';
import {useAddCustomNetwork} from 'hooks/network';
import {useToggler} from 'hooks/useToggler';
import {useWeb3} from 'hooks/useWeb3';
import _ from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {
  AddNetworkDialog,
  AddNetworkValues,
} from '../components/AddNetworkDialog';
import ImportNftTokenDialog, {
  ImportNftTokenValues,
} from '../components/ImportNftTokenDialog';
import ImportTokenDialog, {
  ImportTokenValues,
} from '../components/ImportTokenDialog';
import {TokenList} from '../components/TokenList';
import {useTokenInfo} from '../hooks';

const TOKEN_VALUES_EMPTY = {
  name: '',
  address: '',
  decimals: '0',
  symbol: '',
};

export const ADD_NETWORK_VALUES_EMPTY: AddNetworkValues = {
  chainId: '0',
  name: '',
  nativeTokenSymbol: '',
  rpcUrl: '',
  explorerUrl: '',
};

export const Settings: React.FC = () => {
  const {account} = useWeb3();
  const [address, setAddress] = useState<string>();
  const {chainId} = useWeb3();
  const {addToken} = useAddCustomToken();
  const {addNetwork} = useAddCustomNetwork();
  const {tokens} = useCustomTokenList();

  const importDialogToggler = useToggler(false);
  const importNftDialogToggler = useToggler(false);
  const addNetworkDialogToggler = useToggler(false);

  const [tokenValues, setTokenValues] =
    useState<ImportTokenValues>(TOKEN_VALUES_EMPTY);

  const [addNetworkValues, setAddNetworkValues] = useState<AddNetworkValues>(
    ADD_NETWORK_VALUES_EMPTY,
  );

  const tokenInfo = useTokenInfo(address);

  const [nftTokenValues, setNftTokenValues] = useState<ImportNftTokenValues>({
    address: '',
    tokenId: '',
    symbol: '',
  });

  const handleLazySetAddress = useCallback(
    _.debounce((address: string) => {
      setAddress(address);
    }, 500),
    [],
  );

  const handleAddTokenChange = useCallback(
    (key: string, value: string) => {
      setTokenValues({...tokenValues, [key]: value});

      if (key === 'address') {
        if (isAddress(value)) {
          handleLazySetAddress(value);
        }
      }
    },
    [tokenValues, handleLazySetAddress],
  );

  const handleAddNftChange = useCallback(
    (key: string, value: string) => {
      setNftTokenValues({...nftTokenValues, [key]: value});
    },
    [nftTokenValues],
  );

  const handleCloseTokenImport = useCallback(() => {
    importDialogToggler.set(false);
    setTokenValues(TOKEN_VALUES_EMPTY);
  }, [importDialogToggler]);

  const handleCloseAddNetworkDialog = useCallback(() => {
    addNetworkDialogToggler.set(false);
    setAddNetworkValues(ADD_NETWORK_VALUES_EMPTY);
  }, [addNetworkDialogToggler]);

  const handleTokenSubmit = useCallback(() => {
    if (chainId) {
      addToken({
        name: tokenValues.name,
        address: tokenValues.address,
        chainId,
        symbol: tokenValues.symbol,
        decimals: parseInt(tokenValues.decimals),
      });
      handleCloseTokenImport();
    }
  }, [addToken, tokenValues, chainId, handleCloseTokenImport]);

  const handleNftTokenSubmit = useCallback(() => {}, []);

  const handleOpenImportToken = useCallback(() => {
    importDialogToggler.set(true);
  }, [importDialogToggler]);

  const handleChangeAddNetwork = useCallback(
    (key: string, value: string) => {
      if (key === 'nativeTokenSymbol') {
        const newValue = value.toUpperCase();
        if (/^[A-Z]+$/.test(newValue) || newValue === '') {
          setAddNetworkValues({...addNetworkValues, [key]: newValue});
        }
      } else if (key === 'chainId') {
        if (/^[0-9]+$/.test(value) || value === '') {
          setAddNetworkValues({...addNetworkValues, [key]: value});
        }
      } else {
        setAddNetworkValues({...addNetworkValues, [key]: value});
      }
    },
    [addNetworkValues],
  );

  const handleSubmitAddNetwork = useCallback(() => {
    addNetwork({
      chainId: parseInt(addNetworkValues.chainId),
      name: addNetworkValues.name,
      nativeTokenSymbol: addNetworkValues.nativeTokenSymbol,
      rpcUrl: addNetworkValues.rpcUrl,
      explorerUrl: addNetworkValues.explorerUrl,
    });
  }, [addNetwork, addNetworkValues]);

  const {messages} = useIntl();

  useEffect(() => {
    if (tokenInfo.data) {
      const {symbol, decimals, name} = tokenInfo.data;

      setTokenValues((values) => ({
        ...values,
        decimals: decimals.toString(),
        symbol,
        name,
      }));
    }
  }, [tokenInfo.data]);

  return (
    <>
      <ImportTokenDialog
        dialogProps={{
          open: importDialogToggler.show,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseTokenImport,
        }}
        values={tokenValues}
        onSubmit={handleTokenSubmit}
        onChange={handleAddTokenChange}
      />
      <ImportNftTokenDialog
        dialogProps={{
          open: importNftDialogToggler.show,
          maxWidth: 'xs',
          fullWidth: true,
        }}
        values={nftTokenValues}
        onChange={handleAddNftChange}
        onSubmit={handleNftTokenSubmit}
      />
      <AddNetworkDialog
        dialogProps={{
          open: addNetworkDialogToggler.show,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseAddNetworkDialog,
        }}
        values={addNetworkValues}
        onChange={handleChangeAddNetwork}
        onSubmit={handleSubmitAddNetwork}
      />
      <Box>
        <Box></Box>
        <Box>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardHeader
                  title={
                    <Typography variant='h6'>
                      <IntlMessages id='app.settings.availableTokens' />
                    </Typography>
                  }
                  action={
                    <Tooltip
                      title={messages['app.settings.importToken'] as string}>
                      <IconButton onClick={handleOpenImportToken}>
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  }
                />
                <Divider />
                <TokenList
                  tokens={tokens.map((t) => ({
                    contractAddress: t.address,
                    symbol: t.symbol,
                  }))}
                  account={account}
                />
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={() => importNftDialogToggler.toggle()}>
                Toggle
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={() => addNetworkDialogToggler.toggle()}>
                Toggle Add Network
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Settings;
