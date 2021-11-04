import React, {useCallback} from 'react';

import {List} from '@material-ui/core';

import {useCollectionList} from 'modules/Wizard/hooks';
import {Collection} from 'redux/_wizard/reducers';
import CollectionsListItem from './CollectionsListItem';
import {useHistory} from 'react-router';
import {chainIdToSlug} from 'utils/nft';

export const CollectionsList = () => {
  const {data} = useCollectionList();

  const history = useHistory();

  const handleClick = useCallback(
    (collection: Collection) => {
      if (collection.chainId) {
        history.push(
          `/wizard/collection/${chainIdToSlug(collection.chainId)}/${
            collection.address
          }`,
        );
      }
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
