import React, {useCallback, useEffect, useState} from 'react';
import {
  IconButton,
  FormControl,
  Grid,
  Select,
  MenuItem,
} from '@material-ui/core';
import {MyBalances} from 'types/blockchain';
import NFTListItem from 'shared/components/NFTListItem';
import {useHistory} from 'react-router';
import TokenListItemSkeleton from 'shared/components/TokenListItemSkeleton';

import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import {EmptyWallet} from 'shared/components/EmptyWallet';

const INITIAL_PAGE_SIZE = 10;

const PAGE_SIZES = [
  INITIAL_PAGE_SIZE,
  2 * INITIAL_PAGE_SIZE,
  5 * INITIAL_PAGE_SIZE,
  10 * INITIAL_PAGE_SIZE,
];

interface AssetListProps {
  balances: MyBalances[];
  loading?: boolean;
}

export const NFTList = (props: AssetListProps) => {
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

  const [itemsPerPage, setItemsPerPage] = useState(INITIAL_PAGE_SIZE);

  const handleItemsPerPageChange = useCallback((e) => {
    setItemsPerPage(e.target.value);
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
      ) : balances.length === 0 ? (
        <Grid item xs={12}>
          <EmptyWallet />
        </Grid>
      ) : (
        <>
          {paginate(balances, itemsPerPage, page).map(
            (balance: MyBalances, index: number) => (
              <Grid item xs={12} key={index}>
                <NFTListItem
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
            <Grid justify='flex-end' container alignItems='center' spacing={2}>
              <Grid item>
                <FormControl variant='outlined' size='small'>
                  <Select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    variant='outlined'>
                    {PAGE_SIZES.map((pageSize) => (
                      <MenuItem value={pageSize}>{pageSize}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <IconButton disabled={page == 1} onClick={handleGoPrevious}>
                  <KeyboardArrowLeftIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  disabled={page >= 1 && paginate(balances, 5, page).length < 5}
                  onClick={handleGoNext}>
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default NFTList;
