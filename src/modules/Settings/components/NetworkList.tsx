import React from 'react';

import List from '@material-ui/core/List';
import * as types from '../types';
import NetworkListItem from './NetworkListItem';

interface Props {
  networks: types.Network[];
  onEdit: (network: types.Network) => void;
  onRemove: (network: types.Network) => void;
}

export const NetworkList: React.FC<Props> = ({networks, onEdit, onRemove}) => {
  return (
    <List disablePadding>
      {networks.map((network: types.Network, index: number) => (
        <NetworkListItem
          onEdit={onEdit}
          onRemove={onRemove}
          network={network}
          key={index}
        />
      ))}
    </List>
  );
};
