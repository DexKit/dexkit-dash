import React from 'react';
import {useIntl} from 'react-intl';
import TransactionTable from './TransactionTable';
import {OrderData} from 'types/app';
import AppCard from '@crema/core/AppCard';
import {NETWORK, EXCHANGE} from 'shared/constants/AppEnums';
import {makeStyles, Paper, Toolbar, Typography} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';

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
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));

const AMMTradeHistory: React.FC<Props> = (props: Props) => {
  const {messages} = useIntl();

  const classes = useStyles();

  return (
    // <AppCard height={1} title={messages['app.tradeHistory']}>
    <Paper className={classes.paper}>
      <Toolbar className={classes.toolbar}>
        <Typography variant='h5'>{messages['app.tradeHistory']}</Typography>
      </Toolbar>
      <TransactionTable {...props} />
    </Paper>
    // </AppCard>
  );
};

export default AMMTradeHistory;
