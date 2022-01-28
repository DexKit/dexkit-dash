import React, {useCallback} from 'react';

import {
  Link,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@material-ui/core';

import {KittygotchiRankingItem} from '../types';
import {truncateAddress} from 'utils';
import {useChainInfo} from 'hooks/useChainInfo';
import {useWeb3} from 'hooks/useWeb3';

interface Props {
  item: KittygotchiRankingItem;
  onClick: (item: KittygotchiRankingItem) => void;
}

export const KittygotchiRankingListItem: React.FC<Props> = ({
  item,
  onClick,
}) => {
  const {getScannerUrl} = useChainInfo();

  const {chainId} = useWeb3();

  const handleClick = useCallback(() => {
    onClick(item);
  }, [item, onClick]);

  return (
    <ListItem button onClick={handleClick}>
      <ListItemText
        primary={
          <Typography variant='body1'>Kittygotchi #${item.tokenId}</Typography>
        }
        secondary={
          <Typography variant='body2' color='textSecondary'>
            Owned by{' '}
            <Link
              href={`${chainId && getScannerUrl(chainId)}/address/${
                item.owner
              }`}
              rel='noopener nofollow noreferrer'
              target='_blank'>
              {truncateAddress(item.owner)}
            </Link>
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <Typography variant='body1'>
          <strong>{item.strength}</strong>
        </Typography>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
