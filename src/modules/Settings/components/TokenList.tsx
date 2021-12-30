import {List} from '@material-ui/core';
import React from 'react';
import {TokenListItem} from './TokenListItem';

export interface TokenListToken {
  symbol: string;
  imageUrl?: string;
  contractAddress: string;
}

interface Props {
  tokens: TokenListToken[];
  account?: string;
}

export const TokenList: React.FC<Props> = ({tokens, account}) => {
  return (
    <List disablePadding>
      {tokens.map((t, index) => (
        <TokenListItem
          key={index}
          tokenSymbol={t.symbol}
          imageUrl={t.imageUrl}
          contractAddress={t.contractAddress}
          account={account}
        />
      ))}
    </List>
  );
};
