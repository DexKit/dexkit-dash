import React from 'react';
import {ListItem, ListItemText, Avatar, ListItemIcon} from '@material-ui/core';

import {Skeleton} from '@material-ui/lab';

interface Props {}

export default (props: Props) => {
  return (
    <ListItem dense>
      <ListItemIcon>
        <Avatar>
          <Skeleton variant='circle' />
        </Avatar>
      </ListItemIcon>
      <ListItemText>
        <Skeleton />
      </ListItemText>
    </ListItem>
  );
};
