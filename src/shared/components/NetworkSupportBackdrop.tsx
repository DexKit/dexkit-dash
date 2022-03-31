import React, {useMemo, useCallback} from 'react';
import IntlMessages from '@crema/utility/IntlMessages';
import {
  Backdrop,
  Box,
  Button,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@material-ui/core';
import {useWeb3} from 'hooks/useWeb3';
import {useEffect, useState} from 'react';
import {GET_CHAIN_ID_NAME_V2} from 'shared/constants/Blockchain';
import {switchChain} from 'utils/wallet';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.modal + 1,
    color: '#fff',
  },
}));

interface Props {
  supportedChains: number[];
}

export function NetworkSupportBackdrop({supportedChains}: Props) {
  const classes = useStyles();
  const {chainId} = useWeb3();
  const [open, setOpen] = useState(false);

  const {getProvider} = useWeb3();

  const provider = useMemo(() => {
    return getProvider();
  }, [getProvider]);

  const handleSwitchNetwork = useCallback((chainId: number) => {
    switchChain(provider, chainId);
  }, []);

  useEffect(() => {
    if (chainId !== undefined) {
      let tempChainId: number = 0;

      if (typeof chainId === 'string') {
        if ((chainId as string).startsWith('0x')) {
          tempChainId = parseInt(chainId, 16);
        } else {
          tempChainId = parseInt(chainId);
        }
      } else {
        tempChainId = chainId;
      }

      if (supportedChains.indexOf(tempChainId) > -1) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    }
  }, [chainId, String(supportedChains)]);

  return (
    <Backdrop open={open} className={classes.root}>
      <Grid container justifyContent='center'>
        <Grid item xs={12} sm={4}>
          <Grid container spacing={4} direction='column' alignItems='center'>
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
    </Backdrop>
  );
}
