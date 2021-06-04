import React from 'react';
import {useIntl} from 'react-intl';
import {useTokenTrades} from 'hooks/protocolExplorer/useTokenTrades';
import {Box, Fade, Hidden, Paper, Toolbar, Typography} from '@material-ui/core';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import {EXCHANGE, EthereumNetwork} from 'shared/constants/AppEnums';
import FilterMenu from 'shared/components/Filter/menu';
import FilterList from 'shared/components/Filter/list';
import ErrorView from 'modules/Common/ErrorView';
import TokenOrdersTable from './TokenOrdersTable';
import {useStyles} from './index.style';
import LoadingTable from 'modules/Common/LoadingTable';

interface Props {
  baseAddress: string | null;
  quoteAddress: string | null;
  exchange: EXCHANGE;
  networkName: EthereumNetwork;
  type: 'pair' | 'token';
}

const TokenOrders: React.FC<Props> = (props) => {
  const {baseAddress, quoteAddress, exchange, networkName, type} = props;
  const {messages} = useIntl();
  const classes = useStyles();

  const {
    loading,
    error,
    data,
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = useTokenTrades({baseAddress, quoteAddress, exchange, networkName});

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
    <Fade in={true} timeout={1000}>
      <Paper className={classes.paper}>
        <Toolbar className={classes.toolbar}>
          <Box
            display={'flex'}
            justifyContent={'flex-start'}
            alignItems={'center'}>
            <SwapHorizontalCircleIcon
              color={'primary'}
              className={classes.toolbarIcon}
            />
            <Typography variant='h5' display={'block'} align={'center'}>
              {messages['app.tradeHistory']}
            </Typography>
          </Box>
          <Hidden mdDown>
            <Box
              display={'flex'}
              justifyContent={'flex-end'}
              alignItems={'center'}>
              <FilterList />
              <FilterMenu />
            </Box>
          </Hidden>
        </Toolbar>

        {loading ? (
          <LoadingTable columns={8} rows={10} />
        ) : error ? (
          <ErrorView message={error.message} />
        ) : (
          <TokenOrdersTable
            networkName={networkName}
            data={data}
            exchange={exchange}
            type={type}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
            onChangePage={(newPage) => onChangePage(newPage)}
            onChangeRowsPerPage={(perPage) => onChangeRowsPerPage(perPage)}
          />
        )}
      </Paper>
    </Fade>
    // </AppCard>
    // </Box>
  );
};

export default TokenOrders;
