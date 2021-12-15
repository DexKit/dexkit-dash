import React from 'react';
import { Grid, Box, Toolbar, Typography } from '@material-ui/core';
import { GridContainer } from '@crema';

import { useStyles } from './index.style';
import ErrorView from 'modules/Common/ErrorView';
import OrderTable from './OrderTable';
import LoadingTable from 'modules/Common/LoadingTable';

import { EthereumNetwork } from 'shared/constants/AppEnums';
import { useTradeHistory } from 'hooks/history/useTradeHistory';
import IntlMessages from '../../../@crema/utility/IntlMessages';

type Props = {
  address: string;
  token?: string;
  networkName: EthereumNetwork;
};

const TradeHistoryContainer: React.FC<Props> = (props) => {
  const { address, token, networkName } = props;
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
  } = useTradeHistory({ address, baseCurrency: token, networkName });

  return (
    <GridContainer>
      <Grid item xs={12} md={12}>
        <Toolbar className={classes.toolbar}>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            style={{ width: '100%' }}>
            <Box>
              <Box
                display={'flex'}
                justifyContent={'flex-start'}
                alignItems={'center'}>
                <Typography variant='h5' display={'block'} align={'center'}>
                  <IntlMessages id='app.history.tradeHistory' />
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
