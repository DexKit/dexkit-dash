import IntlMessages from '@crema/utility/IntlMessages';
import {isAddress} from '@ethersproject/address';
import SettingsInputAntennaIcon from '@material-ui/icons/SettingsInputAntenna';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import * as types from '../types';

import languageData from '@crema/core/LanguageSwitcher/data';
import TranslateIcon from '@material-ui/icons/Translate';
import {ReactComponent as EmptyNetwork} from 'assets/images/icons/empty-network.svg';
import {ReactComponent as EmptyWallet} from 'assets/images/icons/empty-wallet.svg';

import {
  Box,
  Fade,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardHeader,
  Grid,
  IconButton,
  Tooltip,
  Divider,
  Typography,
  List,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {
  useAddCustomToken,
  useCustomTokenList,
  useAddCustomAsset,
} from 'hooks/tokens';
import {
  useAddCustomNetwork,
  useCustomNetworkList,
  useRemoveCustomNetwork,
} from 'hooks/network';
import {useToggler} from 'hooks/useToggler';
import {useWeb3} from 'hooks/useWeb3';
import _ from 'lodash';
import React, {useCallback, useEffect, useState, useContext} from 'react';
import {useIntl} from 'react-intl';
import {
  NetworkFormDialog,
  NetworkFormState,
} from '../components/NetworkFormDialog';
import ImportNftTokenDialog, {
  ImportNftTokenValues,
} from '../components/ImportNftTokenDialog';
import ImportTokenDialog, {
  ImportTokenValues,
} from '../components/ImportTokenDialog';
import {TokenList} from '../components/TokenList';
import {useTokenInfo} from '../hooks';
import {NetworkList} from '../components/NetworkList';
import ConfirmRemoveNetworkDialog from '../components/ConfirmRemoveNetworkDialog';
import {LanguageList} from '../components/LanguageList';
import {AppContext} from '@crema';
import AppContextPropsType from 'types/AppContextPropsType';

const MENU_CUSTOM_TOKENS = 'MENU_CUSTOM_TOKENS';
const MENU_CUSTOM_NETWORKS = 'MENU_CUSTOM_NETWORKS';
const MENU_LANGUAGE = 'MENU_CUSTOM_LANGUAGE';

const TOKEN_VALUES_EMPTY = {
  name: '',
  address: '',
  decimals: '0',
  symbol: '',
};

export const ADD_NETWORK_VALUES_EMPTY: NetworkFormState = {
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

  const {addAsset} = useAddCustomAsset();

  const {removeNetwork} = useRemoveCustomNetwork();

  const importDialogToggler = useToggler(false);
  const importNftDialogToggler = useToggler(false);
  const addNetworkDialogToggler = useToggler(false);

  const [tokenValues, setTokenValues] =
    useState<ImportTokenValues>(TOKEN_VALUES_EMPTY);

  const [networkValues, setNetworkValues] = useState<NetworkFormState>(
    ADD_NETWORK_VALUES_EMPTY,
  );

  const tokenInfo = useTokenInfo(address);

  const [nftTokenValues, setNftTokenValues] = useState<ImportNftTokenValues>({
    address: '',
    tokenId: '',
  });

  const handleLazySetAddress = useCallback(
    _.debounce((address: string) => {
      setAddress(address);
    }, 500),
    [],
  );

  const handleAddTokenChange = useCallback(
    (key: string, value: string) => {
      setTokenValues({...tokenValues, [key]: value.trim()});

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
      console.log('he');
      setNftTokenValues({...nftTokenValues, [key]: value.trim()});
    },
    [nftTokenValues],
  );

  const handleEditNetwork = useCallback(
    (network: types.Network) => {
      setNetworkValues({
        chainId: network.chainId.toString(),
        name: network.name,
        explorerUrl: network.explorerUrl,
        nativeTokenSymbol: network.nativeTokenSymbol,
        rpcUrl: network.rpcUrl,
      });
      addNetworkDialogToggler.set(true);
    },
    [addNetworkDialogToggler],
  );

  const [selectedNetwork, setSelectedNetwork] = useState<types.Network>();

  const networkRemoveDialogToggler = useToggler();

  const handleRemoveNetwork = useCallback(
    (network: types.Network) => {
      setSelectedNetwork(network);
      networkRemoveDialogToggler.set(true);
    },
    [networkRemoveDialogToggler],
  );

  const handleConfirmRemove = useCallback(() => {
    if (selectedNetwork?.chainId) {
      removeNetwork({
        chainId: selectedNetwork.chainId,
        name: selectedNetwork.name,
        nativeTokenSymbol: selectedNetwork.nativeTokenSymbol,
        rpcUrl: selectedNetwork.rpcUrl,
        explorerUrl: selectedNetwork.explorerUrl,
      });
      networkRemoveDialogToggler.set(false);
    }
  }, [networkRemoveDialogToggler, selectedNetwork, removeNetwork]);

  const handleCloseRemoveDialog = useCallback(() => {
    if (networkRemoveDialogToggler.show) {
      networkRemoveDialogToggler.set(false);
    }
    setSelectedNetwork(undefined);
  }, [networkRemoveDialogToggler]);

  const handleCloseTokenImport = useCallback(() => {
    importDialogToggler.set(false);
    setTokenValues(TOKEN_VALUES_EMPTY);
  }, [importDialogToggler]);

  const handleCloseAddNetworkDialog = useCallback(() => {
    addNetworkDialogToggler.set(false);
    setNetworkValues(ADD_NETWORK_VALUES_EMPTY);
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

  const handleNftTokenSubmit = useCallback(() => {
    if (chainId && nftTokenValues.tokenId && nftTokenValues.address) {
      addAsset({
        tokenId: nftTokenValues.tokenId,
        contractAddress: nftTokenValues.address,
        chainId: chainId,
      });
    }
  }, [addAsset, nftTokenValues, chainId]);

  const handleOpenImportToken = useCallback(() => {
    importDialogToggler.set(true);
  }, [importDialogToggler]);

  const handleChangeAddNetwork = useCallback(
    (key: string, value: string) => {
      if (key === 'nativeTokenSymbol') {
        const newValue = value.toUpperCase();
        if (/^[A-Z]+$/.test(newValue) || newValue === '') {
          setNetworkValues({...networkValues, [key]: newValue});
        }
      } else if (key === 'chainId') {
        if (/^[0-9]+$/.test(value) || value === '') {
          setNetworkValues({...networkValues, [key]: value.trim()});
        }
      } else {
        setNetworkValues({...networkValues, [key]: value});
      }
    },
    [networkValues],
  );

  const handleOpenAddNetwork = useCallback(() => {
    addNetworkDialogToggler.set(true);
  }, [addNetworkDialogToggler]);

  const handleSubmitAddNetwork = useCallback(() => {
    addNetwork({
      chainId: parseInt(networkValues.chainId),
      name: networkValues.name,
      nativeTokenSymbol: networkValues.nativeTokenSymbol,
      rpcUrl: networkValues.rpcUrl,
      explorerUrl: networkValues.explorerUrl,
    });
    addNetworkDialogToggler.set(false);
  }, [addNetwork, addNetworkDialogToggler, networkValues]);

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

  const [menuSelected, setMenuSelected] = useState(MENU_CUSTOM_TOKENS);

  const {networks} = useCustomNetworkList();

  const {changeLocale, locale} = useContext<AppContextPropsType>(AppContext);

  const handleChangeLanguage = useCallback(
    (language: types.Language) => {
      if (changeLocale) {
        changeLocale(language);
      }
    },
    [changeLocale],
  );

  const renderPanel = () => {
    if (menuSelected === MENU_CUSTOM_TOKENS) {
      return (
        <Fade in>
          <Card>
            <CardHeader
              title={
                <Typography variant='h6'>
                  <IntlMessages id='app.settings.availableTokens' />
                </Typography>
              }
              action={
                <Tooltip title={messages['app.settings.importToken'] as string}>
                  <IconButton onClick={handleOpenImportToken}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              }
            />
            <Divider />
            {tokens.length > 0 ? (
              <TokenList
                tokens={tokens.map((t) => ({
                  contractAddress: t.address,
                  symbol: t.symbol,
                }))}
                account={account}
              />
            ) : (
              <Box py={4}>
                <Grid
                  container
                  alignItems='center'
                  alignContent='center'
                  direction='column'
                  spacing={4}>
                  <Grid item>
                    <EmptyWallet />
                  </Grid>
                  <Grid item>
                    <Typography variant='h5'>
                      <IntlMessages id='app.settings.noTokensYet' />
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Card>
        </Fade>
      );
    } else if (menuSelected === MENU_CUSTOM_NETWORKS) {
      return (
        <Fade in>
          <Card>
            <CardHeader
              title={
                <Typography variant='h6'>
                  <IntlMessages id='app.settings.networks' />
                </Typography>
              }
              action={
                <Tooltip title={messages['app.settings.addNetwork'] as string}>
                  <IconButton onClick={handleOpenAddNetwork}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              }
            />
            <Divider />
            {networks.length > 0 ? (
              <NetworkList
                onEdit={handleEditNetwork}
                onRemove={handleRemoveNetwork}
                networks={networks}
              />
            ) : (
              <Box py={4}>
                <Grid
                  container
                  alignItems='center'
                  alignContent='center'
                  direction='column'
                  spacing={4}>
                  <Grid item>
                    <EmptyNetwork />
                  </Grid>
                  <Grid item>
                    <Typography variant='h5'>
                      <IntlMessages id='app.settings.noNetworksYet' />
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Card>
        </Fade>
      );
    } else if (menuSelected === MENU_LANGUAGE) {
      return (
        <Fade in>
          <Card>
            <CardHeader
              title={
                <Typography variant='h6'>
                  <IntlMessages id='app.settings.languages' />
                </Typography>
              }
            />
            <Divider />
            <LanguageList
              selected={locale as types.Language}
              onChange={handleChangeLanguage}
              languages={languageData}
            />
          </Card>
        </Fade>
      );
    }

    return null;
  };

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
      <ConfirmRemoveNetworkDialog
        dialogProps={{
          open: networkRemoveDialogToggler.show,
          onClose: handleCloseRemoveDialog,
        }}
        onConfirm={handleConfirmRemove}
      />
      <NetworkFormDialog
        dialogProps={{
          open: addNetworkDialogToggler.show,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseAddNetworkDialog,
        }}
        values={networkValues}
        onChange={handleChangeAddNetwork}
        onSubmit={handleSubmitAddNetwork}
      />
      <Box>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3}>
            <Card>
              <List disablePadding>
                <ListItem
                  divider
                  button
                  selected={menuSelected === MENU_CUSTOM_TOKENS}
                  onClick={() => setMenuSelected(MENU_CUSTOM_TOKENS)}>
                  <ListItemIcon>
                    <AttachMoneyIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={messages['app.settings.customTokens'] as string}
                  />
                </ListItem>

                <ListItem
                  divider
                  button
                  selected={menuSelected === MENU_CUSTOM_NETWORKS}
                  onClick={() => setMenuSelected(MENU_CUSTOM_NETWORKS)}>
                  <ListItemIcon>
                    <SettingsInputAntennaIcon />
                  </ListItemIcon>
                  <ListItemText primary={messages['app.settings.networks']} />
                </ListItem>
                <ListItem
                  button
                  selected={menuSelected === MENU_LANGUAGE}
                  onClick={() => setMenuSelected(MENU_LANGUAGE)}>
                  <ListItemIcon>
                    <TranslateIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={messages['app.settings.language'] as string}
                  />
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid item xs={12} sm={9}>
            {renderPanel()}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Settings;
