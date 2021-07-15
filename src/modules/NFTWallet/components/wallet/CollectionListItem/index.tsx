import React, {useCallback} from 'react';
import {ListItem, ListItemText, Avatar, ListItemIcon} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

interface Props {
  selected?: boolean;
  collection: any;
  onSelect: (slug: string) => void;
}

export default (props: Props) => {
  const {collection, selected, onSelect} = props;

  const handleClick = useCallback(() => {
    onSelect(collection.slug);
  }, [collection, onSelect]);

  return (
    <ListItem onClick={handleClick} selected={selected} button>
      <ListItemIcon>
        {selected ? (
          <Avatar>
            <CheckIcon />
          </Avatar>
        ) : (
          <Avatar src={collection.image_url} />
        )}
      </ListItemIcon>
      <ListItemText primary={collection.name} />
    </ListItem>
  );
};
