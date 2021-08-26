import React from 'react';
import {useIntl} from 'react-intl';
import {useAMMPairTrades} from 'hooks/protocolExplorer/useAMMPairTrades';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import {Box, Fade, Hidden, Paper, Toolbar, Typography} from '@material-ui/core';
import AMMTradeHistoryTable from './AMMTradeHistoryTable';
import ErrorView from 'modules/Common/ErrorView';
import {useStyles} from './index.style';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import FilterList from 'shared/components/Filter/list';
import FilterMenu from 'shared/components/Filter/menu';
import LoadingTable from 'modules/Common/LoadingTable';

interface Props {
  networkName: EthereumNetwork;
  exchange: EXCHANGE;
  address: string;
}

const AMMTradeHistory: React.FC<Props> = (props: Props) => {
  const {networkName, exchange, address} = props;
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
  } = useAMMPairTrades({networkName, exchange, address});

  return (
    // <AppCard height={1} title={messages['app.tradeHistory']}>
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
          <LoadingTable columns={7} rows={10} />
        ) : error ? (
          <ErrorView message={error.message} />
        ) : (
          <AMMTradeHistoryTable
            networkName={networkName}
            data={data}
            exchange={exchange}
            totalRows={100}
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
  );
};

export default AMMTradeHistory;
