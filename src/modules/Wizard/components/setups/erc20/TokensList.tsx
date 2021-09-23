import React, {useEffect} from 'react';

import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
} from '@material-ui/core';

import {useTokensList} from 'modules/Wizard/hooks';

export const TokensList = () => {
  const {list, data, error, loading} = useTokensList();

  useEffect(() => {
    list();
  }, []);

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
};

export default TokensList;
