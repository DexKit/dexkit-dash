import React from 'react';
import {useIntl} from 'react-intl';
import TransactionTable from './TransactionTable';
import {Box, makeStyles, Paper, Toolbar, Typography} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import {GetAffiliateTrades} from 'services/graphql/bitquery/affiliate/__generated__/GetAffiliateTrades';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
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
  const {messages} = useIntl();

  const classes = useStyles();

  return (
    // <AppCard height={1} title={messages['app.tradeHistory']}>
    <Paper className={classes.paper}>
      <Toolbar className={classes.toolbar}>
        <Box
          display={'flex'}
          justifyContent={'flex-start'}
          alignItems={'center'}>
          <SwapHorizontalCircleIcon color={'primary'} />
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
    </Paper>
    // </AppCard>
  );
};

export default AffiliateHistory;
