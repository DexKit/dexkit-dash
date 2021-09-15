import React, {useCallback} from 'react';

import {
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@material-ui/core';

import {useCollectionList} from 'modules/Wizard/hooks';
import {Collection} from 'redux/_wizard/reducers';
import CollectionsListItem from './CollectionsListItem';
import {useHistory} from 'react-router';

export const CollectionsList = () => {
  const {data, error, loading} = useCollectionList();

  const history = useHistory();

  const handleClick = useCallback(
    (collection: Collection) => {
      history.push(`/wizard/collection/${collection.address}`);
    },
    [history],
  );

  return (
    <List disablePadding>
      {data.map((collection: any, index: number) => (
        <CollectionsListItem
          collection={collection}
          key={index}
          onClick={handleClick}
        />
      ))}
    </List>
  );
};

export default CollectionsList;
