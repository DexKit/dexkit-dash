import React, {useEffect} from 'react';

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

export const TokensList = () => {
  const {list, data} = useTokensList();

  useEffect(() => {
    list();
  }, [list]);

  if (data.length > 0) {
    return (
      <List disablePadding>
        {data.map((token: any, index: number) => (
          <ListItem button key={index}>
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
              display='flex'
              justifyContent='center'
              alignContent='center'
              alignItems='center'>
              <NFTEmptyStateImage />
            </Box>
          </Grid>
          <Typography variant='h5'>
            <IntlMessages id='app.wizard.noTokensYet' />
          </Typography>
        </Grid>
      </Box>
    );
  }
};

export default TokensList;
