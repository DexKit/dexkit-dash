import React, {useCallback} from 'react';

import {Box, Typography, Button} from '@material-ui/core';
import ErrorView from 'modules/Common/ErrorView';
import {MyBalances} from 'types/blockchain';
import AssetTable from '../AssetTable';
import {WalletEmptyImage} from 'shared/components/Icons';
import {useTransak} from 'hooks/useTransak';

import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import {useIsBalanceVisible} from 'hooks/useIsBalanceVisible';
import IntlMessages from '../../../../@crema/utility/IntlMessages';

type Props = {
  account: string;
  loading: boolean;
  error: any;
  loadingUsd: boolean;
  errorUsd: boolean;
  data: MyBalances[];
};

export const AssetTableTab = (props: Props) => {
  const {loading, error, data, loadingUsd, errorUsd} = props;

  // const {defiBalance} = useDefi(account);

  // <Grid item xs={12} md={6} style={{marginTop: 15}}>
  //   {/* <DefiCoins {...defiBalance} /> */}
  // </Grid>

  const {isBalanceVisible} = useIsBalanceVisible();
  const transak = useTransak({});

  /* eslint-disable */
  const handleTransak = useCallback(() => {
    transak.init();
  }, [transak.init]);

  if (data.length === 0 && !loading) {
    return (
      <Box>
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
              <IntlMessages id='app.dashboard.noAssets' />
            </Typography>
          </Box>
          <Button
            variant='outlined'
            color={'primary'}
            startIcon={<MonetizationOnIcon />}
            onClick={handleTransak}>
            <IntlMessages id='app.dashboard.buyCrypto' />
          </Button>
        </Box>
      </Box>
    );
  }

  return error ? (
    <ErrorView message={error.message} />
  ) : (
    <AssetTable
      hideBalance={!isBalanceVisible}
      balances={data}
      loading={loading}
      loadingUsd={loadingUsd}
      errorUsd={errorUsd}
    />
  );
};
