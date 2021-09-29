import React, {useCallback} from 'react';
import {Button, Grid} from '@material-ui/core';
import {useWeb3} from 'hooks/useWeb3';

import {ChainId, Web3State} from 'types/blockchain';

import Box from '@material-ui/core/Box';

import {useTheme} from '@material-ui/core/styles';

import {Empty} from 'shared/components/Empty';
import {useDispatch} from 'react-redux';
import {useMagicProvider} from 'hooks/provider/useMagicProvider';
import { GET_MAGIC_NETWORK_FROM_CHAIN_ID, isMagicProvider} from 'services/magic';
import {switchChain} from 'utils/wallet';
import {setWeb3State} from 'redux/actions';
import {ReactComponent as EmptyNetwork} from 'assets/images/icons/empty-network.svg';

const WrongNetwork = () => {
  const theme = useTheme();
  const {onSwitchMagicNetwork} = useMagicProvider();
  const {getProvider} = useWeb3();

  const dispatch = useDispatch();
  const handleSelectChain = useCallback(
    async (chainId: number) => {
      if (isMagicProvider()) {
        const network = GET_MAGIC_NETWORK_FROM_CHAIN_ID(chainId as ChainId);
        onSwitchMagicNetwork(network);
      } else {
        dispatch(setWeb3State(Web3State.Connecting));
        switchChain(getProvider(), chainId);
        dispatch(setWeb3State(Web3State.Done));
      }
    },
    [getProvider, isMagicProvider],
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Empty
          title={'Not Supported Network'}
          message={'Please connect your wallet to the supported networks below'}
          image={<EmptyNetwork/>}
          callToAction={
            <Box display='flex' alignItems='center' justifyContent='center'>
              <Box m={2}>
                <Button
                  size='large'
                  variant='contained'
                  onClick={() => handleSelectChain(ChainId.Matic)}
                  startIcon={
                    <img
                      height={theme.spacing(6)}
                      width={theme.spacing(6)}
                      src={require('assets/images/chains/polygon-matic-logo.svg')}
                    />
                  }>
                  Polygon
                </Button>
              </Box>
              <Box m={2}>
                <Button
                  size='large'
                  variant='contained'
                  onClick={() => handleSelectChain(ChainId.Mumbai)}
                  startIcon={
                    <img
                      height={theme.spacing(6)}
                      width={theme.spacing(6)}
                      src={require('assets/images/chains/polygon-matic-logo.svg')}
                    />
                  }>
                  Mumbai Testnet
                </Button>
              </Box>
            </Box>
          }
        />
      </Grid>
    </Grid>
  );
};

export default WrongNetwork;
