import React from 'react';

import {useIntl} from 'react-intl';

import {Box, makeStyles, Toolbar, Typography} from '@material-ui/core';

import TransactionTable from './TransactionTable';
import {GetAffiliateTrades} from 'services/graphql/bitquery/affiliate/__generated__/GetAffiliateTrades';
import FilterList from 'shared/components/Filter/list';
import FilterMenu from 'shared/components/Filter/menu';

interface Props {
  transactionData: GetAffiliateTrades | undefined;
  isLoading: boolean;
  page: number;
  total: number;
  perPage: number;
  onChangePage: (newPage: number) => void;
  onChangePerPage: (newPerPage: number) => void;
}

const useStyles = makeStyles((theme) => ({
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
  const {messages} = useIntl();

  const classes = useStyles();

  return (
    <>
      <Toolbar className={classes.toolbar}>
        <Box
          display={'flex'}
          justifyContent={'flex-start'}
          alignItems={'center'}>
          <Typography variant='h5' display={'block'} align={'center'}>
            {messages['app.tradeHistory']}
          </Typography>
        </Box>
        <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
          <FilterList />
          <FilterMenu />
        </Box>
      </Toolbar>
      <TransactionTable {...props} />
    </>
  );
};

export default AffiliateHistory;
