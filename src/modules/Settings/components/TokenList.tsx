import {List} from '@material-ui/core';
import React from 'react';
import {ChainId} from 'types/blockchain';
import {TokenListItem} from './TokenListItem';

export interface TokenListToken {
  symbol: string;
  imageUrl?: string;
  contractAddress: string;
  chainId: number;
}

interface Props {
  tokens: TokenListToken[];
  onRemove: ({
    address,
    chainId,
    symbol,
  }: {
    address: string;
    chainId: ChainId;
    symbol: string;
  }) => void;
  account?: string;
}

export const TokenList: React.FC<Props> = ({tokens, account, onRemove}) => {
  return (
    <List disablePadding>
      {tokens.map((t, index) => (
        <TokenListItem
          key={index}
          tokenSymbol={t.symbol}
          imageUrl={t.imageUrl}
          chainId={t.chainId}
          contractAddress={t.contractAddress}
          account={account}
          onRemove={onRemove}
        />
      ))}
    </List>
  );
};
