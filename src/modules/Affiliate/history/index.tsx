import React from 'react';
import TransactionTable from './TransactionTable';
import {Box, makeStyles, Toolbar, Typography, Grid} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
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

const useStyles = makeStyles((theme: CremaTheme) => ({
  toolbar: {
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));

const AffiliateHistory: React.FC<Props> = (props: Props) => {
  const classes = useStyles();

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
