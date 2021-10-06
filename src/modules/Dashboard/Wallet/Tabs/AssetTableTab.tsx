import React, {useCallback} from 'react';
import {Grid, Box, Typography, Button} from '@material-ui/core';
import ErrorView from 'modules/Common/ErrorView';
import {MyBalances} from 'types/blockchain';
import AssetTable from '../AssetTable';
import DefiCoins from '../DefiCoins';
import {useDefi} from 'hooks/useDefi';
import {WalletEmptyImage} from 'shared/components/Icons';
import {useTransak} from 'hooks/useTransak';

import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

type Props = {
  account: string;
  loading: boolean;
  error: any;
  data: MyBalances[];
  hideBalance?: boolean;
};

export const AssetTableTab = (props: Props) => {
  const {account, loading, error, data, hideBalance} = props;

  // const {defiBalance} = useDefi(account);

  // <Grid item xs={12} md={6} style={{marginTop: 15}}>
  //   {/* <DefiCoins {...defiBalance} /> */}
  // </Grid>

  const transak = useTransak({});

  const handleTransak = useCallback(() => {
    transak.init();
  }, [transak.init]);

  if (data.length === 0 && !loading) {
    return (
      <Box
        py={4}
        display='flex'
        flexDirection='column'
        alignItems='center'
        alignContent='center'
        justifyContent='center'>
        <Box mb={2}>
          <WalletEmptyImage />
        </Box>
        <Box mb={4}>
          <Typography align='center' variant='h5'>
            No Assets
          </Typography>
        </Box>
        <Button
          variant='outlined'
          startIcon={<MonetizationOnIcon />}
          onClick={handleTransak}>
          Buy Crypto
        </Button>
      </Box>
    );
  }

  return error ? (
    <ErrorView message={error.message} />
  ) : (
    <AssetTable hideBalance={hideBalance} balances={data} loading={loading} />
  );
};
