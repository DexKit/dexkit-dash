import {Box, ButtonBase, Grid, makeStyles} from '@material-ui/core';
import React, {useCallback, useState} from 'react';
import {GET_MAGIC_NETWORK_FROM_CHAIN_ID, isMagicProvider} from 'services/magic';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {useWeb3} from 'hooks/useWeb3';
import SwitchNetworkDialog from '../SwitchNetworkDialog';
import {useChainInfo} from 'hooks/useChainInfo';
import {useMagicProvider} from 'hooks/provider/useMagicProvider';
import {setWeb3State} from 'redux/actions';
import {switchChain} from 'utils/wallet';
import {Web3State} from 'types/blockchain';
import {CremaTheme} from 'types/AppContextPropsType';
import {useDispatch} from 'react-redux';
import {useAppNetworks, useCustomNetworkList} from 'hooks/network';
const useStyles = makeStyles((theme: CremaTheme) => {
  return {
    badgeRoot: {
      borderRadius: theme.shape.borderRadius,
    },
    switchNetworkButton: {
      textTransform: 'uppercase',
      padding: theme.spacing(2),
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.divider}`,
      background: theme.palette.background.paper,
    },
  };
});

interface Props {
  useOnlyCustom?: boolean;
}

const NetworkSwitcher = (props: Props) => {
  const {useOnlyCustom} = props;
  const {chainId, getProvider} = useWeb3();
  const [showSwitchNetwork, setShowSwitchNetwork] = useState(false);
  const {chainName} = useChainInfo();
  const {onSwitchMagicNetwork} = useMagicProvider();
  const classes = useStyles();
  const dispatch = useDispatch();
  const {networks} = useCustomNetworkList();
  const appNetworks = useAppNetworks();
  const handleCloseSwitchNetwork = useCallback(() => {
    setShowSwitchNetwork(false);
  }, []);

  const isMetamask = useCallback(() => {
    if (window.ethereum) {
      if ((window.ethereum as any).isMetaMask) {
        return true;
      }
    }

    return false;
  }, []);
  const handleOpenSwitchNetwork = useCallback(() => {
    setShowSwitchNetwork(true);
  }, []);
  const handleSelectChain = useCallback(
    async (_chainId: number) => {
      setShowSwitchNetwork(false);

      if (isMagicProvider()) {
        const magicNetwork = GET_MAGIC_NETWORK_FROM_CHAIN_ID(_chainId);
        onSwitchMagicNetwork(magicNetwork);
      } else {
        dispatch(setWeb3State(Web3State.Connecting));

        const provider = getProvider();

        try {
          const customIndex = appNetworks.findIndex(
            (n) => n.chainId === _chainId,
          );
          if (customIndex > -1) {
            const params: {
              chainId: string; // A 0x-prefixed hexadecimal string
              chainName: string;
              nativeCurrency?: {
                name: string;
                symbol: string; // 2-6 characters long
                decimals: number;
              };
              rpcUrls: string[];
              blockExplorerUrls?: string[];
              iconUrls?: string[]; // Currently ignored.
            } = {
              chainId: '0x' + appNetworks[customIndex].chainId.toString(16),
              chainName: appNetworks[customIndex].name,
              rpcUrls: [appNetworks[customIndex].rpcURL],
              blockExplorerUrls: appNetworks[customIndex].explorerURL
                ? [appNetworks[customIndex].explorerURL]
                : undefined,
            };

            const nativeCurrency: {
              name: string;
              symbol: string;
              decimals: number;
            } = {
              name: appNetworks[customIndex].name,
              //@ts-ignore
              symbol: appNetworks[customIndex].symbol,
              decimals: 18,
            };

            nativeCurrency.symbol = appNetworks[customIndex].symbol;

            params.nativeCurrency = nativeCurrency;

            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [params],
            });
            dispatch(setWeb3State(Web3State.Done));
            return;
          }
        } catch {
          dispatch(setWeb3State(Web3State.Done));
          return;
        }

        try {
          const customIndex = networks.findIndex((n) => n.chainId === _chainId);

          if (customIndex > -1) {
            const params: {
              chainId: string; // A 0x-prefixed hexadecimal string
              chainName: string;
              nativeCurrency?: {
                name: string;
                symbol: string; // 2-6 characters long
                decimals: number;
              };
              rpcUrls: string[];
              blockExplorerUrls?: string[];
              iconUrls?: string[]; // Currently ignored.
            } = {
              chainId: '0x' + networks[customIndex].chainId.toString(16),
              chainName: networks[customIndex].name,
              rpcUrls: [networks[customIndex].rpcUrl],
              blockExplorerUrls: networks[customIndex].explorerUrl
                ? [networks[customIndex].explorerUrl]
                : undefined,
            };

            const nativeCurrency: {
              name: string;
              symbol: string;
              decimals: number;
            } = {
              name: networks[customIndex].name,
              //@ts-ignore
              symbol: networks[customIndex].symbol,
              decimals: 18,
            };

            if (networks[customIndex].nativeTokenSymbol) {
              nativeCurrency.symbol = networks[customIndex].nativeTokenSymbol;
            }

            params.nativeCurrency = nativeCurrency;

            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [params],
            });
            //  window.location.reload();
            dispatch(setWeb3State(Web3State.Done));
            return;
          }
        } catch {
          //  window.location.reload();
          dispatch(setWeb3State(Web3State.Done));
          return;
        }
        await switchChain(provider, _chainId);
      }
    },
    [dispatch, getProvider, onSwitchMagicNetwork, networks, appNetworks],
  );

  return (
    <>
      {' '}
      {chainId ? (
        <SwitchNetworkDialog
          selected={chainId}
          open={showSwitchNetwork}
          onSelectChain={handleSelectChain}
          onClose={handleCloseSwitchNetwork}
          useOnlyCustom={useOnlyCustom}
        />
      ) : null}
      {chainId !== undefined && (isMetamask() || isMagicProvider()) ? (
        <Grid item>
          <ButtonBase
            onClick={handleOpenSwitchNetwork}
            className={classes.switchNetworkButton}>
            <Box
              className={classes.badgeRoot}
              display={'flex'}
              alignItems={'center'}>
              {chainName}
              <ExpandMoreIcon />
            </Box>
          </ButtonBase>
        </Grid>
      ) : (
        chainId && (
          <Grid item>
            <Box
              className={classes.badgeRoot}
              display={'flex'}
              alignItems={'center'}>
              {chainName}
            </Box>
          </Grid>
        )
      )}
    </>
  );
};

export default NetworkSwitcher;
