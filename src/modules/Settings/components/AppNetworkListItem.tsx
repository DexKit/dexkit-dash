import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import {AppNetworkParams} from 'shared/constants/Networks';

interface Props {
  network: AppNetworkParams;
}

export const AppNetworkListItem: React.FC<Props> = ({network}) => {
  return (
    <ListItem button>
      <ListItemText primary={network.name} />
    </ListItem>
  );
};

export default AppNetworkListItem;
