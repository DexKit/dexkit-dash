import React, {useEffect, useCallback} from 'react';

import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Grid,
  Box,
} from '@material-ui/core';

import {NFTEmptyStateImage} from 'shared/components/Icons';

import {useTokensList} from 'modules/Wizard/hooks';
import IntlMessages from '@crema/utility/IntlMessages';
import {useWeb3} from 'hooks/useWeb3';
import {getScannerUrlV2} from 'utils/blockchain';

import {useCustomNetworkList} from 'hooks/network';

export const TokensList = () => {
  const {list, data} = useTokensList();

  const {chainId} = useWeb3();

  const {networks} = useCustomNetworkList();

  useEffect(() => {
    list();
  }, [list]);

  const handleItemClick = useCallback(
    (address: string, chainId?: number) => {
      if (chainId) {
        window.open(
          `${getScannerUrlV2(
            chainId,
            networks.map((n) => ({
              chainId: n.chainId,
              explorerUrl: n.explorerUrl,
            })),
          )}/address/${address}`,
          '_blank',
        );
      }
    },
    [networks],
  );

  if (data.length > 0) {
    return (
      <List disablePadding>
        {data
          .filter((t) => t.chainId === chainId)
          .map((token: any, index: number) => (
            <ListItem
              button
              onClick={() => handleItemClick(token.address, token.chainId)}
              key={index}>
              <ListItemText
                primary={token.name}
                secondary={token.symbol}
                secondaryTypographyProps={{color: 'textSecondary'}}
              />
              <ListItemSecondaryAction>
                <Typography variant='body1'>{token.supply}</Typography>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
    );
  } else {
    return (
      <Box p={4}>
        <Grid
          container
          spacing={4}
          alignItems='center'
          alignContent='center'
          justifyContent='center'
          direction='column'>
          <Grid item xs={12}>
            <Box
              pb={2}
              display='flex'
              justifyContent='center'
              alignContent='center'
              alignItems='center'>
              <NFTEmptyStateImage />
            </Box>
          </Grid>
          <Typography variant='body2' color={'textSecondary'}>
            <IntlMessages id='app.wizard.noTokensYet' />
          </Typography>
        </Grid>
      </Box>
    );
  }
};

export default TokensList;
