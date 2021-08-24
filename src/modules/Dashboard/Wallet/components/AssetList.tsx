import React, {useCallback} from 'react';
import {Grid} from '@material-ui/core';
import {MyBalances} from 'types/blockchain';
import TokenListItem from 'shared/components/TokenListItem';
import {useHistory} from 'react-router';
import TokenListItemSkeleton from 'shared/components/TokenListItemSkeleton';

interface AssetListProps {
  balances: MyBalances[];
  loading?: boolean;
}

export const AssetList = (props: AssetListProps) => {
  const {balances, loading} = props;

  const history = useHistory();

  const handleClick = useCallback((network: string, address: string) => {
    history.push(`/${network}/dashboard/token/${address}`);
  }, []);

  return (
    <Grid container spacing={2}>
      {loading ? (
        <>
          <Grid item xs={12}>
            <TokenListItemSkeleton />
          </Grid>
          <Grid item xs={12}>
            <TokenListItemSkeleton />
          </Grid>
          <Grid item xs={12}>
            <TokenListItemSkeleton />
          </Grid>
          <Grid item xs={12}>
            <TokenListItemSkeleton />
          </Grid>
          <Grid item xs={12}>
            <TokenListItemSkeleton />
          </Grid>
        </>
      ) : (
        balances.map((balance: MyBalances, index: number) => (
          <Grid item xs={12}>
            <TokenListItem
              key={index}
              address={balance.currency?.address || ''}
              network={balance.network}
              symbol={balance.currency?.symbol || ''}
              name={balance.currency?.name || ''}
              amount={balance?.valueInUsd || 0}
              dayChange={0}
              onClick={handleClick}
            />
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default AssetList;
