import React from 'react';
import {Grid, Box} from '@material-ui/core';
import ErrorView from 'modules/Common/ErrorView';
import {MyBalances} from 'types/blockchain';
import AssetTable from '../AssetTable';
import DefiCoins from '../DefiCoins';
import {useDefi} from 'hooks/useDefi';

type Props = {
  account: string;
  loading: boolean;
  error: any;
  data: MyBalances[];
};

export const AssetTableTab = (props: Props) => {
  const {account, loading, error, data} = props;

  const {defiBalance} = useDefi(account);

  // <Grid item xs={12} md={6} style={{marginTop: 15}}>
  //   {/* <DefiCoins {...defiBalance} /> */}
  // </Grid>

  return error ? (
    <ErrorView message={error.message} />
  ) : (
    <AssetTable balances={data} loading={loading} />
  );
};
