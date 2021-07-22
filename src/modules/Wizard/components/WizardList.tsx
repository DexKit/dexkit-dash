import React, {useCallback} from 'react';
import {List} from '@material-ui/core';
import WizardListItem from './WizardListItem';

export interface Item {
  slug: string;
  title: string;
  description: string;
}

const ITEMS: Item[] = [
  {
    slug: 'erc20',
    title: 'Fungible Token',
    description:
      'This is a common standard for creating tokens on Ethereum compatible blockchains',
  },
  {
    slug: 'erc721',
    title: 'Non-Fungible Token',
    description:
      'It is a standard for representing ownership of non-fungible tokens (NFTs), that is, where each token is unique.',
  },
  {slug: 'erc1155', title: 'Semi-Fungible Token', description: ''},
  {
    slug: 'custom',
    title: 'Custom',
    description: 'Select from a list of all available smart contracts',
  },
];

export interface WizardListProps {
  slug: string;
  onSelect: (slug: string) => void;
}

export const WizardList = (props: WizardListProps) => {
  const {onSelect, slug} = props;

  const handleClick = useCallback(
    (slug: string) => {
      onSelect(slug);
    },
    [onSelect],
  );

  return (
    <List>
      {ITEMS.map((item: Item, index: number) => (
        <WizardListItem
          key={index}
          title={item.title}
          description={item.description}
          onClick={handleClick}
          selected={slug == item.slug}
          slug={item.slug}
        />
      ))}
    </List>
  );
};

export default WizardList;
