import React, {useCallback} from 'react';
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@material-ui/core';

import {Collection} from 'redux/_wizard/reducers';

interface CollectionsListItemProps {
  collection: Collection;
  onClick: (collection: Collection) => void;
}

export const CollectionsListItem = (props: CollectionsListItemProps) => {
  const {onClick, collection} = props;

  const handleClick = useCallback(() => {
    onClick(collection);
  }, [collection, onClick]);

  return (
    <ListItem button onClick={handleClick}>
      <ListItemAvatar>
        <Avatar src={collection.imageUrl} />
      </ListItemAvatar>
      <ListItemText
        primary={collection.name}
        secondary={collection.description}
        secondaryTypographyProps={{color: 'textSecondary'}}
      />
    </ListItem>
  );
};

export default CollectionsListItem;
