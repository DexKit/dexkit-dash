import React from 'react';
import TransactionTable from './TransactionTable';
import {Box, Typography, Grid} from '@material-ui/core';
import {GetAffiliateTrades} from 'services/graphql/bitquery/affiliate/__generated__/GetAffiliateTrades';
import FilterList from 'shared/components/Filter/list';
import FilterMenu from 'shared/components/Filter/menu';
import IntlMessages from '../../../@crema/utility/IntlMessages';

interface Props {
  transactionData: GetAffiliateTrades | undefined;
  isLoading: boolean;
  page: number;
  total: number;
  perPage: number;
  onChangePage: (newPage: number) => void;
  onChangePerPage: (newPerPage: number) => void;
}

const AffiliateHistory: React.FC<Props> = (props: Props) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Box
          display='flex'
          alignItems='center'
          alignContent='center'
          justifyContent='space-between'>
          <Typography variant='subtitle1'>
            <IntlMessages id='app.affiliate.tradeHistory' />
          </Typography>
          <Box>
            <FilterList />
            <FilterMenu />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TransactionTable {...props} />
      </Grid>
    </Grid>
  );
};

export default AffiliateHistory;
