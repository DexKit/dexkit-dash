import React, {useCallback, useState} from 'react';
import {
  Typography,
  Box,
  Button,
  Dialog,
  ListSubheader,
  DialogProps,
  List,
  ListItem,
  DialogTitle,
  Divider,
  IconButton,
  ListItemText,
  ListItemIcon,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import {useMobile} from 'hooks/useMobile';
import {NetworkCodes} from 'utils/blockchain';
import IntlMessages from '@crema/utility/IntlMessages';

import {isMagicProvider} from 'services/magic';

import {useToggler} from 'hooks/useToggler';

import * as settingsTypes from 'modules/Settings/types';

import {useCustomNetworkList, useAddCustomNetwork} from 'hooks/network';

import AddIcon from '@material-ui/icons/Add';

import {
  NetworkFormDialog,
  NetworkFormState,
} from 'modules/Settings/components/NetworkFormDialog';

export const ADD_NETWORK_VALUES_EMPTY: NetworkFormState = {
  chainId: '0',
  name: '',
  nativeTokenSymbol: '',
  rpcUrl: '',
  explorerUrl: '',
};

interface CustomNetworkListItemProps {
  network: settingsTypes.Network;
  onClick: (network: settingsTypes.Network) => void;
  selected: boolean;
}

const CustomNetworkListItem: React.FC<CustomNetworkListItemProps> = ({
  network,
  onClick,
  selected,
}) => {
  const handleClick = useCallback(() => {
    onClick(network);
  }, [network, onClick]);

  const classes = useStyles();

  return (
    <ListItem selected={selected} onClick={handleClick} button>
      <ListItemIcon>
        <Box className={classes.icon}>
          <Typography variant='body1'>
            {network.name.substring(0, 1).toUpperCase()}
          </Typography>
        </Box>
      </ListItemIcon>
      <ListItemText primary={network.name} />
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
  icon: {
    backgroundColor: theme.palette.common.white,
    height: theme.spacing(8),
    width: theme.spacing(8),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: '50%',
  },
}));

interface SwitchNetworkDialogProps extends DialogProps {
  selected: number;
  onSelectChain: (chainId: number) => void;
}

export const SwitchNetworkDialog = (props: SwitchNetworkDialogProps) => {
  const {onClose, onSelectChain, selected} = props;

  const theme = useTheme();

  const classes = useStyles();

  const {addNetwork} = useAddCustomNetwork();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  const isMobile = useMobile();

  const handleEthereum = useCallback(() => {
    onSelectChain(NetworkCodes.Ethereum);
  }, [onSelectChain]);

  const handleBsc = useCallback(() => {
    onSelectChain(NetworkCodes.SmartChain);
  }, [onSelectChain]);

  const handlePolygon = useCallback(() => {
    onSelectChain(NetworkCodes.Matic);
  }, [onSelectChain]);

  const {networks} = useCustomNetworkList();

  // const handleRopsten = useCallback(() => {
  //   onSelectChain(NetworkCodes.Ropsten);
  // }, [onSelectChain]);

  const [networkValues, setNetworkValues] = useState<NetworkFormState>(
    ADD_NETWORK_VALUES_EMPTY,
  );

  const addNetworkDialogToggler = useToggler(false);

  const handleCloseAddNetworkDialog = useCallback(() => {
    addNetworkDialogToggler.set(false);
    setNetworkValues(ADD_NETWORK_VALUES_EMPTY);
  }, [addNetworkDialogToggler]);

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
        setNetworkValues({...networkValues, [key]: value.trim()});
      }
    },
    [networkValues],
  );

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

  const handleOpenAddNetwork = useCallback(() => {
    addNetworkDialogToggler.set(true);
  }, [addNetworkDialogToggler]);

  const handleSelectCustomNetwork = useCallback(
    async (network: settingsTypes.Network) => {
      onSelectChain(network.chainId);
    },
    [onSelectChain],
  );

  return (
    <>
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
      <Dialog {...props} fullScreen={isMobile} fullWidth maxWidth='xs'>
        <DialogTitle>
          <Box
            display='flex'
            alignItems='center'
            alignContent='center'
            justifyContent='space-between'>
            <Box alignContent='center' alignItems='center' display='flex'>
              <Box mr={2}>
                <Typography variant='body1'>
                  <SwapHorizIcon fontSize='inherit' />
                </Typography>
              </Box>
              <Typography variant='body1' style={{fontWeight: 500}}>
                Switch network
              </Typography>
            </Box>
            <IconButton onClick={handleClose} size='small'>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <List disablePadding>
          <ListItem
            button
            onClick={handleEthereum}
            selected={NetworkCodes.Ethereum === selected}>
            <ListItemIcon>
              <Box className={classes.icon}>
                <img
                  alt=''
                  height={theme.spacing(6)}
                  width={theme.spacing(6)}
                  src={require('assets/images/eth_logo.png')}
                />
              </Box>
            </ListItemIcon>
            <ListItemText primary='Ethereum' />
          </ListItem>
          <ListItem
            button
            onClick={handleBsc}
            selected={NetworkCodes.SmartChain === selected}>
            <ListItemIcon>
              <Box className={classes.icon}>
                <img
                  alt=''
                  height={theme.spacing(6)}
                  width={theme.spacing(6)}
                  src={require('assets/images/chains/binance-coin-bnb-logo.svg')}
                />
              </Box>
            </ListItemIcon>
            <ListItemText primary='Binance Smart Chain' />
          </ListItem>
          <ListItem
            button
            onClick={handlePolygon}
            selected={NetworkCodes.Matic === selected}>
            <ListItemIcon>
              <Box className={classes.icon}>
                <img
                  alt=''
                  height={theme.spacing(6)}
                  width={theme.spacing(6)}
                  src={require('assets/images/chains/polygon-matic-logo.svg')}
                />
              </Box>
            </ListItemIcon>
            <ListItemText primary='Polygon' />
          </ListItem>
          <Divider />
          {/* <Divider />
        <ListItem
          button
          onClick={handleRopsten}
          selected={NetworkCodes.Ropsten === selected}>
          <ListItemIcon>
            <Box className={classes.icon}>
              <img
                height={theme.spacing(6)}
                width={theme.spacing(6)}
                src={require('assets/images/eth_logo.png')}
              />
            </Box>
          </ListItemIcon>
          <ListItemText primary='Ropsten' secondary='Testnet' />
        </ListItem>
        <ListItem
          button
          onClick={handleMumbai}
          selected={NetworkCodes.MaticTestnet === selected}>
          <ListItemIcon>
            <Box className={classes.icon}>
              <img
                height={theme.spacing(6)}
                width={theme.spacing(6)}
                src={require('assets/images/chains/polygon-matic-logo.svg')}
              />
            </Box>
          </ListItemIcon>
          <ListItemText primary='Polygon' secondary='Mumbai Testnet' />
        </ListItem> */}
        </List>
        {!isMagicProvider() ? (
          <>
            <List
              disablePadding
              subheader={
                <ListSubheader component='div' id='nested-list-subheader'>
                  <IntlMessages id='app.common.customNetworks' />
                </ListSubheader>
              }>
              <Divider />
              {networks.map((network: settingsTypes.Network, index: number) => (
                <CustomNetworkListItem
                  key={index}
                  network={network}
                  onClick={handleSelectCustomNetwork}
                  selected={network.chainId === selected}
                />
              ))}
            </List>
            <Divider />
            <Box p={4}>
              <Button
                variant='outlined'
                onClick={handleOpenAddNetwork}
                startIcon={<AddIcon />}
                fullWidth
                color='primary'>
                <IntlMessages id='app.common.addCustomNetwork' />
              </Button>
            </Box>
          </>
        ) : null}
      </Dialog>
    </>
  );
};

export default SwitchNetworkDialog;
