import React, {useCallback} from 'react';
import IntlMessages from '@crema/utility/IntlMessages';
import {Box, Button, Grid, Typography} from '@material-ui/core';
import {useWeb3} from 'hooks/useWeb3';
import {GET_CHAIN_ID_NAME_V2} from 'shared/constants/Blockchain';
import {switchChain} from 'utils/wallet';
import {ReactComponent as ConnectivityImage} from 'assets/images/state/connectivity-04.svg';

interface Props {
  supportedChains: number[];
}

export function NetworkSupportCard({supportedChains}: Props) {
  const {getProvider} = useWeb3();

  const handleSwitchNetwork = useCallback(
    (chainId: number) => {
      switchChain(getProvider(), chainId);
    },
    [getProvider],
  );

  return (
    <Box p={4}>
      <Grid container justifyContent='center'>
        <Grid item xs={12} sm={4}>
          <Grid container spacing={4} direction='column' alignItems='center'>
            <Grid item xs={12}>
              <ConnectivityImage />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h5' align='center'>
                <IntlMessages
                  id='common.networkIsNotSupported'
                  defaultMessage='Network is not supported'
                />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1' align='center' color='textSecondary'>
                <IntlMessages
                  id='commin.pleaseSwitchToASupportedNetwork'
                  defaultMessage='Please, switch to a supported network'
                />
              </Typography>
            </Grid>
            <Grid item>
              <Grid container spacing={2}>
                {supportedChains.map((chainId, index) => (
                  <Grid item key={index}>
                    <Button onClick={() => handleSwitchNetwork(chainId)}>
                      {GET_CHAIN_ID_NAME_V2(chainId)}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default NetworkSupportCard;
