import React from 'react';

import {List} from '@material-ui/core';
import CollectionListItem from '../CollectionListItem';

interface Props {
  collections: any[];
  selected: string;
  onSelect: (slug: string) => void;
}

export default (props: Props) => {
  const {collections, selected, onSelect} = props;

  return (
    <List dense>
      {collections.map((collection: any) => (
        <CollectionListItem
          onSelect={onSelect}
          selected={selected === collection.slug}
          key={collection.slug}
          collection={collection}
        />
      ))}
    </List>
  );
};
