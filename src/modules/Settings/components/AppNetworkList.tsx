import React from 'react';

import List from '@material-ui/core/List';
import AppNetworkListItem from './AppNetworkListItem';
import {useAppNetworks} from 'hooks/network';

export const AppNetworkList: React.FC = () => {
  const networks = useAppNetworks();

  return (
    <List disablePadding>
      {networks?.map((network, index: number) => (
        <AppNetworkListItem network={network} key={index} />
      ))}
    </List>
  );
};
