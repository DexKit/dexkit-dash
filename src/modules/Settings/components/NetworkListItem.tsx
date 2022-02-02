import React, {useCallback} from 'react';

import * as types from '../types';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

interface Props {
  network: types.Network;
  onEdit: (network: types.Network) => void;
  onRemove: (network: types.Network) => void;
}

export const NetworkListItem: React.FC<Props> = ({
  network,
  onEdit,
  onRemove,
}) => {
  const handleClick = useCallback(() => {
    onEdit(network);
  }, [onEdit, network]);

  const handleClickRemove = useCallback(() => {
    onRemove(network);
  }, [onRemove, network]);

  return (
    <ListItem onClick={handleClick} button>
      <ListItemText primary={network.name} />

      <ListItemSecondaryAction>
        <IconButton size='small' onClick={handleClickRemove}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default NetworkListItem;
