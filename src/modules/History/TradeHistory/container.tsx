import React from 'react';
import {Grid, Box, Paper, Toolbar, Typography} from '@material-ui/core';
import {GridContainer} from '@crema';

import {useStyles} from './index.style';
import ErrorView from 'modules/Common/ErrorView';
import OrderTable from './OrderTable';
import LoadingTable from 'modules/Common/LoadingTable';
import {useIntl} from 'react-intl';

import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useTradeHistory} from 'hooks/history/useTradeHistory';
import {TokenAnalytics} from 'modules/Dashboard/Token/Analytics';

type Props = {
  address: string;
  token?: string;
  networkName: EthereumNetwork;
};

const TradeHistoryContainer: React.FC<Props> = (props) => {
  const {address, token, networkName} = props;
  const {messages} = useIntl();
  const classes = useStyles();

  const {
    loading,
    error,
    data,
    totalRows,
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = useTradeHistory({address, baseCurrency: token, networkName});

  return (
    <GridContainer>
      {/* token && address ? (   // TODO: remove this after implementing overview screen
        <Grid item xs={12} md={12}>
          <Paper>
            <TokenAnalytics
              account={address}
              token={token}
              networkName={networkName}
            />
          </Paper>
        </Grid>
      ) : null */}

      <Grid item xs={12} md={12}>
        <Toolbar className={classes.toolbar}>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            style={{width: '100%'}}>
            <Box>
              <Box
                display={'flex'}
                justifyContent={'flex-start'}
                alignItems={'center'}>
                <Typography variant='h5' display={'block'} align={'center'}>
                  {messages['app.tradeHistory']}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Toolbar>
        {loading ? (
          <LoadingTable columns={8} rows={10} />
        ) : error ? (
          <ErrorView message={error.message} />
        ) : (
          <OrderTable
            networkName={networkName}
            data={data}
            totalRows={totalRows}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
            onChangePage={(newPage) => onChangePage(newPage)}
            onChangeRowsPerPage={(perPage) => onChangeRowsPerPage(perPage)}
          />
        )}
      </Grid>
    </GridContainer>
  );
};

export default TradeHistoryContainer;
