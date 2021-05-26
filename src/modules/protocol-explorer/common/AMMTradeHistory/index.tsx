import React from 'react';
import {useIntl} from 'react-intl';
import TransactionTable from './TransactionTable';
import {OrderData} from 'types/app';
import AppCard from '@crema/core/AppCard';
import {NETWORK, EXCHANGE} from 'shared/constants/AppEnums';
import {Box, Hidden, makeStyles, Paper, Toolbar, Typography} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import FilterList from 'shared/components/Filter/list';
import FilterMenu from 'shared/components/Filter/menu';

interface Props {
  transactionData: OrderData[];
  isLoading: boolean;
  page: number;
  total: number;
  perPage: number;
  onChangePage: (newPage: number) => void;
  onChangePerPage: (newPerPage: number) => void;
  networkName: NETWORK;
  exchange: EXCHANGE;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
  toolbar: {
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  toolbarIcon: {
    marginRight: '3px'
  }
}));

const AMMTradeHistory: React.FC<Props> = (props: Props) => {
  const {messages} = useIntl();

  const classes = useStyles();

  return (
    // <AppCard height={1} title={messages['app.tradeHistory']}>
    <Paper className={classes.paper}>
      <Toolbar className={classes.toolbar}>
         <Box display={'flex'} justifyContent={'flex-start'}  alignItems={'center'}>
              <SwapHorizontalCircleIcon color={'primary'} className={classes.toolbarIcon}/>
              <Typography variant='h5' display={'block'}  align={'center'}>{messages['app.tradeHistory']}</Typography>
          </Box>
          <Hidden mdDown>
            <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
                <FilterList />
                <FilterMenu />
            </Box>
          </Hidden>
      </Toolbar>
      <TransactionTable {...props} />
    </Paper>
    // </AppCard>
  );
};

export default AMMTradeHistory;
