import React, {useCallback, useEffect, useState} from 'react';
import {Box, Button, Grid} from '@material-ui/core';
import {MyBalances} from 'types/blockchain';
import TokenListItem from 'shared/components/TokenListItem';
import {useHistory} from 'react-router';
import TokenListItemSkeleton from 'shared/components/TokenListItemSkeleton';

import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import {EmptyWallet} from 'shared/components/EmptyWallet';

interface AssetListProps {
  balances: MyBalances[];
  loading?: boolean;
}

export const AssetList = (props: AssetListProps) => {
  const {balances, loading} = props;

  const history = useHistory();

  const handleClick = useCallback(
    (network: string, address: string) => {
      history.push(`/wallet/overview/${network}/${address}`);
    },
    [history],
  );

  const [page, setPage] = useState(1);

  const paginate = useCallback(
    (array: MyBalances[], page_size: number, page_number: number) => {
      return array.slice(
        (page_number - 1) * page_size,
        page_number * page_size,
      );
    },
    [],
  );

  const handleGoNext = useCallback(() => {
    setPage((value) => value + 1);
  }, []);

  const handleGoPrevious = useCallback(() => {
    setPage((value) => value - 1);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [balances]);

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
      ) : balances.length === 0 ? (
        <Grid item xs={12}>
          <EmptyWallet />
        </Grid>
      ) : (
        <>
          {paginate(balances, 5, page).map(
            (balance: MyBalances, index: number) => (
              <Grid item xs={12} key={index}>
                <TokenListItem
                  address={balance.currency?.address || ''}
                  network={balance.network}
                  symbol={balance.currency?.symbol || ''}
                  name={balance.currency?.name || ''}
                  amount={balance?.value || 0}
                  amountUsd={balance?.valueInUsd || 0}
                  onClick={handleClick}
                  dayChange={balance.price24hPercentage}
                />
              </Grid>
            ),
          )}
          <Grid item xs={12}>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'>
              <Button
                startIcon={<KeyboardArrowLeftIcon />}
                disabled={page == 1}
                onClick={handleGoPrevious}>
                Previous
              </Button>
              <Button
                endIcon={<KeyboardArrowRightIcon />}
                disabled={page >= 1 && paginate(balances, 5, page).length < 5}
                onClick={handleGoNext}>
                Next
              </Button>
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default AssetList;
