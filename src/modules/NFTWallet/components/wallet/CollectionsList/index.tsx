import React from 'react';
import CollectionList from '../CollectionList';

interface Props {
  collection: string;
  collections: any[];
  onSelect: (slug: string) => void;
}

export default (props: Props) => {
  const {collection, collections, onSelect} = props;

  return (
    <CollectionList
      selected={collection}
      onSelect={onSelect}
      collections={collections}
    />
  );
};
