import React, {useCallback} from 'react';

import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

import {KittygotchiRankingItem} from '../types';
import {useWeb3} from 'hooks/useWeb3';
import {KittygotchiRankingListItem} from './KittygotchiRankingListItem';
import {GET_KITTYGOTCHI_CONTRACT_ADDR} from '../constants';
import {getAssetMetadata} from 'services/nfts';

interface Props {
  items: KittygotchiRankingItem[];
  onSelect: (
    contractAddress: string,
    tokenId: string,
    metadata: any,
    chainId: number,
  ) => void;
  loading: boolean;
}

export const KittygotchiRankingList: React.FC<Props> = ({
  items,
  loading,
  onSelect,
}) => {
  const {chainId, getProvider} = useWeb3();

  const handleItemClick = useCallback(
    async (item: KittygotchiRankingItem) => {
      const kittygotchiAddress = GET_KITTYGOTCHI_CONTRACT_ADDR(chainId);

      if (chainId && kittygotchiAddress) {
        const metadata: any = await getAssetMetadata(
          kittygotchiAddress,
          getProvider(),
          item.tokenId,
        );

        onSelect(kittygotchiAddress, item.tokenId, metadata, chainId);
      }
    },
    [onSelect, chainId, getProvider],
  );

  return (
    <List disablePadding>
      {loading ? (
        <>
          {new Array(10).fill(null).map((_, index: number) => (
            <ListItem key={index}>
              <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
              <ListItemSecondaryAction>
                <Skeleton />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </>
      ) : (
        items.map((item: KittygotchiRankingItem, index: number) => (
          <KittygotchiRankingListItem
            item={item}
            key={index}
            onClick={handleItemClick}
          />
        ))
      )}
    </List>
  );
};

export default KittygotchiRankingList;
