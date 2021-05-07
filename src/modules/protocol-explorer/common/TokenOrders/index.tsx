import React from 'react';
import {useIntl} from 'react-intl';

import CTable from './CTable';
import Box from '@material-ui/core/Box';

import {EXCHANGE, NETWORK} from 'shared/constants/AppEnums';

import AppCard from '@crema/core/AppCard';
import {useTokenTrades} from 'hooks/useTokenTrades';
import TextField from '@material-ui/core/TextField';
import {
  makeStyles,
  createStyles,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';

interface Props {
  baseAddress: string | null;
  quoteAddress: string | null;
  exchange: EXCHANGE;
  networkName: NETWORK;
  type: 'pair' | 'token';
}

// const useStyles = makeStyles((theme: CremaTheme) =>
//   createStyles({
//     container: {
//       display: 'flex',
//       flexWrap: 'wrap',
//     },
//     textField: {
//       marginLeft: theme.spacing(1),
//       marginRight: theme.spacing(1),
//       width: 200,
//     },
//   }),
// );

const useStyles = makeStyles((theme: CremaTheme) => ({
  toolbar: {
    padding: '0 24px',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));

const TokenOrders: React.FC<Props> = (props) => {
  const classes = useStyles();
  const {messages} = useIntl();
  const {
    trades,
    isLoadingTrades,
    totalTrades,
    page,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
  } = useTokenTrades(props.baseAddress, props.quoteAddress, props.exchange);

  return (
    // <Box py={{xs: 5, sm: 5, xl: 5}} px={{xs: 6, sm: 6, xl: 6}} height={1} clone>
    //   <AppCard contentStyle={{paddingLeft: 0, paddingRight: 0,}} title={messages['app.tradeHistory']}

    /* TODO Time filters
      action={
        (<Box>
          <TextField
            id="datetime-local"
            label="From"
            type="datetime-local" 
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="datetime-local"
            label="To"
            type="datetime-local" 
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
        />
        </Box>
      
        )

      }*/

    // >
    <Paper className={classes.paper}>
      <Toolbar className={classes.toolbar}>
        <Typography variant='h5'>{messages['app.tradeHistory']}</Typography>
      </Toolbar>
      <CTable
        data={trades}
        exchange={props.exchange}
        networkName={props.networkName}
        isLoading={isLoadingTrades}
        total={totalTrades}
        page={page}
        perPage={rowsPerPage}
        onChangePage={onChangePage}
        onChangePerPage={onChangeRowsPerPage}
        type={props.type}
      />
    </Paper>
    // </AppCard>
    // </Box>
  );
};

export default TokenOrders;
