import React from 'react';

import {
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@material-ui/core';

import {useTokensList} from 'modules/Wizard/hooks';

export const TokensList = () => {
  const {data, error, loading} = useTokensList();

  return (
    <List>
      {data.map((token: any, index: number) => (
        <ListItem key={index}>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText
            primary=''
            secondary=''
            secondaryTypographyProps={{color: 'textSecondary'}}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TokensList;
